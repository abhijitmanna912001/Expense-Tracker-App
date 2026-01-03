import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { scale, verticalScale } from "@/utils/styling";
import { orderBy, where } from "firebase/firestore";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  DotsThreeOutlineIcon,
} from "phosphor-react-native";
import React, { useMemo } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import Typography from "./Typography";

const HomeCard = () => {
  const { user } = useAuth();

  const constraints = useMemo(
    () =>
      user?.uid
        ? [where("uid", "==", user.uid), orderBy("created", "desc")]
        : [],
    [user?.uid]
  );

  const { data: wallets, loading: walletsLoading } = useFetchData<WalletType>(
    "wallets",
    constraints
  );

  const totals = useMemo(() => {
    return wallets.reduce(
      (acc, item) => {
        acc.balance += Number(item.amount || 0);
        acc.income += Number(item.totalIncome || 0);
        acc.expenses += Number(item.totalExpenses || 0);
        return acc;
      },
      { balance: 0, income: 0, expenses: 0 }
    );
  }, [wallets]);

  return (
    <ImageBackground
      source={require("../assets/images/card.png")}
      resizeMode="stretch"
      style={styles.bgImage}
    >
      <View style={styles.container}>
        <View>
          <View style={styles.totalBalanceRow}>
            <Typography color={colors.neutral800} size={17} fontWeight={"500"}>
              Total Balance
            </Typography>
            <DotsThreeOutlineIcon
              size={verticalScale(23)}
              color={colors.black}
              weight="fill"
            />
          </View>
          <Typography color={colors.black} size={30} fontWeight={"bold"}>
            $ {walletsLoading ? "----" : totals.balance.toFixed(2)}
          </Typography>
        </View>

        <View style={styles.stats}>
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <ArrowDownIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typography
                size={16}
                color={colors.neutral700}
                fontWeight={"500"}
              >
                Income
              </Typography>
            </View>

            <View style={{ alignSelf: "center" }}>
              <Typography size={17} fontWeight={"600"} color={colors.green}>
                $ {walletsLoading ? "----" : totals.income.toFixed(2)}
              </Typography>
            </View>
          </View>
          <View style={{ gap: verticalScale(5) }}>
            <View style={styles.incomeExpense}>
              <View style={styles.statsIcon}>
                <ArrowUpIcon
                  size={verticalScale(15)}
                  color={colors.black}
                  weight="bold"
                />
              </View>
              <Typography
                size={16}
                color={colors.neutral700}
                fontWeight={"500"}
              >
                Expense
              </Typography>
            </View>
            <View style={{ alignSelf: "center" }}>
              <Typography size={17} fontWeight={"600"} color={colors.rose}>
                $ {walletsLoading ? "----" : totals.expenses.toFixed(2)}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;

const styles = StyleSheet.create({
  incomeExpense: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingY._7,
  },
  statsIcon: {
    backgroundColor: colors.neutral350,
    padding: spacingY._5,
    borderRadius: 50,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalBalanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._5,
  },
  container: {
    padding: spacingX._20,
    paddingHorizontal: scale(23),
    height: "87%",
    width: "100%",
    justifyContent: "space-between",
  },
  bgImage: { height: scale(210), width: "100%" },
});
