import { firestore } from "@/config/firebase";
import { ResponseType, TransactionType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { uploadFileCloudinary } from "./ImageService";
import { createOrUpdateWallet } from "./walletService";

const safe = (n?: number) => Math.max(0, Number(n || 0));

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>,
): Promise<ResponseType> => {
  try {
    const { id, type, image, walletId, amount } = transactionData;

    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, msg: "Invalid Transaction Data" };
    }

    // UPDATE TRANSACTION
    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id),
      );

      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;

      if (shouldRevertOriginal) {
        let res = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId,
        );

        if (!res.success) return res;
      }
    } else {
      let res = await updateWalletForNewTransaction(
        walletId,
        Number(amount),
        type,
      );

      if (!res?.success) return res;
    }

    // Upload image if provided
    if (image) {
      const imageUploadRes = await uploadFileCloudinary(image, "transactions");

      if (!imageUploadRes.success)
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload receipt",
        };

      transactionData.image = imageUploadRes.data;
    }

    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    // ✅ IMPORTANT FIX: remove undefined fields before saving to Firestore
    Object.keys(transactionData).forEach((key) => {
      if (transactionData[key as keyof typeof transactionData] === undefined) {
        delete transactionData[key as keyof typeof transactionData];
      }
    });

    await setDoc(transactionRef, transactionData, { merge: true });

    return {
      success: true,
      data: { ...transactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("error creating or updating transaction:", error);
    return { success: false, msg: error?.message || "Something went wrong" };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string,
) => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);

    if (!walletSnapshot.exists()) {
      console.log("error updating wallet for new transaction:");
      return { success: false, msg: "Wallet not found" };
    }

    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        msg: "Selected Wallet don't have enough balance",
      };
    }

    const updatedType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? safe(walletData.amount) + amount
        : safe(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? safe(walletData.totalIncome) + amount
        : safe(walletData.totalExpenses) + amount;

     await updateDoc(walletRef, {
       amount: safe(updatedWalletAmount),
       [updatedType]: safe(updatedTotals),
     });
    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction:", error);
    return { success: false, msg: error.msg };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string,
) => {
  try {
    const originalWalletSnap = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId),
    );

    const originalWallet = originalWalletSnap.data() as WalletType;

    let newWalletSnap = await getDoc(doc(firestore, "wallets", newWalletId));
    let newWallet = newWalletSnap.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense: number =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount = safe(
      safe(originalWallet.amount) + revertIncomeExpense,
    );

    const revertedIncomeExpenseAmount = safe(
      Number(originalWallet[revertType]) - Number(oldTransaction.amount),
    );

    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          msg: "Selected Wallet don't have enough balance",
        };
      }

      if (safe(newWallet.amount) < newTransactionAmount) {
        return {
          success: false,
          msg: "Selected Wallet don't have enough balance",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    newWalletSnap = await getDoc(doc(firestore, "wallets", newWalletId));
    newWallet = newWalletSnap.data() as WalletType;

    const updateType =
      newTransactionType === "income" ? "totalIncome" : "totalExpenses";

    const updatedTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount)
        : -Number(newTransactionAmount);

    const newWalletAmount = safe(
      safe(newWallet.amount) + updatedTransactionAmount,
    );

    const newIncomeExpenseAmount = safe(
      Number(newWallet[updateType]) + Number(newTransactionAmount),
    );

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction:", error);
    return { success: false, msg: error.msg };
  }
};

export const deleteTransaction = async (
  transactionId: string,
  walletId: string,
) => {
  try {
    const transactionRef = doc(firestore, "transactions", transactionId);
    const transactionSnap = await getDoc(transactionRef);

    if (!transactionSnap.exists()) {
      return { success: false, msg: "Transaction not found" };
    }

    const transactionData = transactionSnap.data() as TransactionType;
    const transactionType = transactionData?.type;
    const transactionAmount = Number(transactionData?.amount);

    const walletSnap = await getDoc(doc(firestore, "wallets", walletId));
    const walletData = walletSnap.data() as WalletType;
    const updateType =
      transactionType === "income" ? "totalIncome" : "totalExpenses";

    const newWalletAmount =
      transactionType === "income"
        ? safe(walletData.amount) - transactionAmount
        : safe(walletData.amount) + transactionAmount;

    if (transactionType === "income" && newWalletAmount < 0) {
      return { success: false, msg: "You cannot delete this transaction" };
    }

    const newIncomeExpenseAmount = safe(
      Number(walletData[updateType]) - transactionAmount,
    );

    await createOrUpdateWallet({
      id: walletId,
      amount: safe(newWalletAmount),
      [updateType]: newIncomeExpenseAmount,
    });

    await deleteDoc(transactionRef);
    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction:", error);
    return { success: false, msg: error.msg };
  }
};
