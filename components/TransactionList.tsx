import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { TransactionListType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { StyleSheet, View } from "react-native";
import TransactionItem from "./TransactionItem";
import Typography from "./Typography";
import Loading from "./Loading";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const handleClick = () => {};

  return (
    <View style={styles.container}>
      {title && (
        <Typography size={20} fontWeight={"500"}>
          {title}
        </Typography>
      )}
      <View style={styles.list}>
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem item={item} index={index} />
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
