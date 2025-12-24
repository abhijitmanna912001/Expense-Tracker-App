import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import WalletListItem from "@/components/WalletListItem";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { orderBy, where } from "firebase/firestore";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const Wallet = () => {
  const router = useRouter();
  const { user } = useAuth();

  const constraints = useMemo(
    () =>
      user?.uid
        ? [where("uid", "==", user.uid), orderBy("created", "desc")]
        : [],
    [user?.uid]
  );

  const {
    data: wallets,
    loading: walletsLoading,
    error,
  } = useFetchData<WalletType>("wallets", constraints);

  // ✅ AUTH LOADING UI (AFTER hooks)
  if (!user) {
    return (
      <ScreenWrapper>
        <Loading />
      </ScreenWrapper>
    );
  }

  const getTotalBalance = () =>
    wallets.reduce((total, item) => {
      total = total + (item.amount || 0);
      return total;
    }, 0);

  return (
    <ScreenWrapper style={{ backgroundColor: colors.black }}>
      <View style={styles.container}>
        <View style={styles.balanceView}>
          <View style={{ alignItems: "center" }}>
            <Typography size={45} fontWeight={"500"}>
              ${getTotalBalance()?.toFixed(2)}
            </Typography>
            <Typography size={16} color={colors.neutral300}>
              Total Balance
            </Typography>
          </View>
        </View>

        <View style={styles.wallets}>
          <View style={styles.flexRow}>
            <Typography size={20} fontWeight={"500"}>
              My Wallets
            </Typography>
            <TouchableOpacity
              onPress={() => router.push("/(modals)/walletModal")}
            >
              <PlusCircleIcon
                weight="fill"
                color={colors.primary}
                size={verticalScale(33)}
              />
            </TouchableOpacity>
          </View>
          {walletsLoading && <Loading />}
          <FlatList
            data={wallets}
            renderItem={({ item, index }) => {
              return (
                <WalletListItem item={item} index={index} router={router} />
              );
            }}
            contentContainerStyle={styles.listStyles}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  listStyles: { paddingVertical: spacingY._25, paddingTop: spacingY._15 },
  wallets: {
    flex: 1,
    backgroundColor: colors.neutral900,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,
  },
  container: { flex: 1, justifyContent: "space-between" },
  balanceView: {
    height: verticalScale(160),
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
});
