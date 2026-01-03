import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Typography from "./Typography";
import { TransactionItemProps } from "@/types";
import { expenseCategories, incomeCategory } from "@/constants/data";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import Animated, { FadeInDown } from "react-native-reanimated";
import { Timestamp } from "firebase/firestore";

const TransactionItem = ({
  item,
  index,
  handleClick,
}: TransactionItemProps) => {
  let category =
    item?.type === "income"
      ? incomeCategory
      : expenseCategories[item?.category!];
  const IconComponent = category.icon;

  const date = (item?.date as Timestamp)
    ?.toDate()
    ?.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <Animated.View
      entering={FadeInDown.delay(index + 70)
        .springify()
        .damping(14)}
    >
      <TouchableOpacity style={styles.row} onPress={() => handleClick(item)}>
        <View style={[styles.icon, { backgroundColor: category.bgColor }]}>
          {IconComponent && (
            <IconComponent
              size={verticalScale(25)}
              weight="fill"
              color={colors.white}
            />
          )}
        </View>

        <View style={styles.categoryDes}>
          <Typography size={17}>{category.label}</Typography>
          <Typography
            size={12}
            color={colors.neutral400}
            textProps={{ numberOfLines: 1 }}
          >
            {item.description}
          </Typography>
        </View>

        <View style={styles.amountData}>
          <Typography
            fontWeight={"500"}
            color={item.type === "income" ? colors.primary : colors.rose}
          >
            {`${item?.type === "income" ? "+ $" : "- $"}${item?.amount}`}
          </Typography>
          <Typography size={13} color={colors.neutral400}>
            {date}
          </Typography>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
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
  icon: {
    height: verticalScale(44),
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius._12,
    borderCurve: "continuous",
  },
  categoryDes: { flex: 1, gap: 2.5 },
  amountData: { alignItems: "flex-end", gap: 3 },
});
