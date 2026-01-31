import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionListType, TransactionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import TransactionItem from "./TransactionItem";
import Typography from "./Typography";
import Loading from "./Loading";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();

  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image,
        uid: item?.uid,
        walletId: item?.walletId,
      },
    });
  };

  return (
    <View style={styles.container}>
      {title && (
        <Typography size={20} fontWeight={"500"}>
          {title}
        </Typography>
      )}
      <View style={styles.list}>
        <FlashList<TransactionType>
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
          {...({ estimatedItemSize: 60 } as any)}
        />
      </View>
      {!loading && data.length === 0 && (
        <Typography
          size={15}
          color={colors.neutral400}
          style={{ textAlign: "center", marginTop: spacingY._15 }}
        >
          {emptyListMessage}
        </Typography>
      )}
      {loading && (
        <View style={{ top: verticalScale(100) }}>
          <Loading />
        </View>
      )}
    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  amountData: { alignItems: "flex-end", gap: 3 },
  categoryDes: { flex: 1, gap: 2.5 },
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacingX._12,
    marginBottom: spacingY._12,
    backgroundColor: colors.neutral800,
    padding: spacingY._10,
    paddingHorizontal: spacingY._10,
    borderRadius: radius._17,
  },
  list: { minHeight: 3 },
  container: { gap: spacingY._17 },
});
