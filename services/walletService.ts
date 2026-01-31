import { firestore } from "@/config/firebase";
import { ResponseType, WalletType } from "@/types";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { uploadFileCloudinary } from "./ImageService";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>,
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadRes = await uploadFileCloudinary(
        walletData.image,
        "wallets",
      );

      if (!imageUploadRes.success)
        return {
          success: false,
          msg: imageUploadRes.msg || "Failed to upload wallet image",
        };

      walletToSave.image = imageUploadRes.data;
    }

    if (!walletData?.id) {
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }

    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

    await setDoc(walletRef, walletToSave, { merge: true });
    return { success: true, data: { ...walletToSave, id: walletRef.id } };
  } catch (error: any) {
    console.log("error creating or updating the wallet:", error);
    return { success: false, msg: error.msg };
  }
};

export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, "wallets", walletId);
    await deleteTransactionsByWalletId(walletId);
    await deleteDoc(walletRef);
    
    return { success: true, msg: "Wallet Deleted Successfully" };
  } catch (error: any) {
    console.log("error deleting the wallet:", error);
    return { success: false, msg: error.msg };
  }
};

export const deleteTransactionsByWalletId = async (
  walletId: string,
): Promise<ResponseType> => {
  try {
    while (true) {
      const transactionQuery = query(
        collection(firestore, "transactions"),
        where("walletId", "==", walletId),
        limit(500),
      );

      const transactionSnap = await getDocs(transactionQuery);

      if (transactionSnap.size === 0) {
        break;
      }

      const batch = writeBatch(firestore);
      transactionSnap.forEach((transactionDoc) => {
        batch.delete(transactionDoc.ref);
      });

      await batch.commit();
      console.log(`${transactionSnap.size} transactions deleted in this batch`);
    }

    return { success: true, msg: "All transactions deleted successfully" };
  } catch (error: any) {
    console.log("error deleting the wallet:", error);
    return { success: false, msg: error?.message || "Something went wrong" };
  }
};
