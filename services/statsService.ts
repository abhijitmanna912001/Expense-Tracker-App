import { firestore } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { ResponseType, TransactionType } from "@/types";
import {
  getLast12MonthsData,
  getLast7DaysData,
  getYearsRange,
} from "@/utils/common";
import { scale } from "@/utils/styling";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";

export const fetchWeeklyStats = async (uid?: string): Promise<ResponseType> => {
  if (!uid) {
    return { success: true, data: { stats: [], transactions: [] } };
  }

  try {
    const db = firestore;
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnap = await getDocs(transactionQuery);
    const weeklyData = getLast7DaysData();
    const transactions: TransactionType[] = [];

    querySnap.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp)
        .toDate()
        .toISOString()
        .split("T")[0];

      const dayData = weeklyData.find((day) => day.date === transactionDate);

      if (dayData) {
        if (transaction.type === "income") {
          dayData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          dayData.expense += transaction.amount;
        }
      }
    });

    const stats = weeklyData.flatMap((day) => [
      {
        value: day.income,
        label: day.day,
        spacing: scale(4),
        labelWidth: scale(30),
        frontColor: colors.primary,
      },
      { value: day.expense, frontColor: colors.rose },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("error fetching weekly stats: ", error);
    return { success: false, msg: error.msg };
  }
};

export const fetchMonthlyStats = async (
  uid?: string,
): Promise<ResponseType> => {
  if (!uid) {
    return { success: true, data: { stats: [], transactions: [] } };
  }

  try {
    const db = firestore;
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 12);

    const transactionQuery = query(
      collection(db, "transactions"),
      where("date", ">=", Timestamp.fromDate(twelveMonthsAgo)),
      where("date", "<=", Timestamp.fromDate(today)),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnap = await getDocs(transactionQuery);
    const monthlyData = getLast12MonthsData();
    const transactions: TransactionType[] = [];

    querySnap.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionDate = (transaction.date as Timestamp).toDate();
      const monthName = transactionDate.toLocaleString("default", {
        month: "short",
      });

      const shortYear = transactionDate.getFullYear().toString().slice(-2);
      const monthData = monthlyData.find(
        (month) => month.month === `${monthName} ${shortYear}`,
      );

      if (monthData) {
        if (transaction.type === "income") {
          monthData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          monthData.expense += transaction.amount;
        }
      }
    });

    const stats = monthlyData.flatMap((month) => [
      {
        value: month.income,
        label: month.month,
        frontColor: colors.primary,
      },
      {
        value: month.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("error fetching monthly stats: ", error);
    return { success: false, msg: error.msg };
  }
};

export const fetchYearlyStats = async (uid?: string): Promise<ResponseType> => {
  if (!uid) {
    return { success: true, data: { stats: [], transactions: [] } };
  }
  
  try {
    const db = firestore;

    const transactionQuery = query(
      collection(db, "transactions"),
      orderBy("date", "desc"),
      where("uid", "==", uid),
    );

    const querySnap = await getDocs(transactionQuery);
    const transactions: TransactionType[] = [];

    const firstTransaction = querySnap.docs.reduce((earliest, doc) => {
      const transactionDate = doc.data().date.toDate();
      return Math.min(transactionDate.getTime(), earliest.getTime()) ===
        transactionDate.getTime()
        ? transactionDate
        : earliest;
    }, new Date());

    const firstYear = firstTransaction.getFullYear();
    const currentYear = new Date().getFullYear();

    const yearlyData = getYearsRange(firstYear, currentYear);

    querySnap.forEach((doc) => {
      const transaction = doc.data() as TransactionType;
      transaction.id = doc.id;
      transactions.push(transaction);

      const transactionYear = (transaction.date as Timestamp)
        .toDate()
        .getFullYear();

      const yearData = yearlyData.find(
        (item) => item.year === transactionYear.toString(),
      );

      if (yearData) {
        if (transaction.type === "income") {
          yearData.income += transaction.amount;
        } else if (transaction.type === "expense") {
          yearData.expense += transaction.amount;
        }
      }
    });

    const stats = yearlyData.flatMap((year) => [
      {
        value: year.income,
        label: year.year,
        frontColor: colors.primary,
      },
      {
        value: year.expense,
        frontColor: colors.rose,
      },
    ]);

    return { success: true, data: { stats, transactions } };
  } catch (error: any) {
    console.log("error fetching yearly stats: ", error);
    return { success: false, msg: error.msg };
  }
};
