import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { ChartBarIcon, HouseIcon, UserIcon, WalletIcon } from "phosphor-react-native";
import React from "react";
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

const tabBarIcons: any = {
  index: (isFocused: boolean) => (
    <HouseIcon
      size={verticalScale(30)}
      weight={isFocused ? "fill" : "regular"}
      color={isFocused ? colors.primary : colors.neutral400}
    />
  ),
  statistics: (isFocused: boolean) => (
    <ChartBarIcon
      size={verticalScale(30)}
      weight={isFocused ? "fill" : "regular"}
      color={isFocused ? colors.primary : colors.neutral400}
    />
  ),
  wallet: (isFocused: boolean) => (
    <WalletIcon
      size={verticalScale(30)}
      weight={isFocused ? "fill" : "regular"}
      color={isFocused ? colors.primary : colors.neutral400}
    />
  ),
  profile: (isFocused: boolean) => (
    <UserIcon
      size={verticalScale(30)}
      weight={isFocused ? "fill" : "regular"}
      color={isFocused ? colors.primary : colors.neutral400}
    />
  ),
};

export default function CustomTabs({
  state,
  descriptors,
  navigation,
}: Readonly<BottomTabBarProps>) {

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
          >
            {tabBarIcons[route.name]?.(isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS === "ios" ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.neutral800,
    justifyContent: "space-around",
    alignItems: "center",
    borderTopColor: colors.neutral700,
    borderTopWidth: 1,
  },
  tabBarItem: {
    marginBottom: Platform.OS === "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});
