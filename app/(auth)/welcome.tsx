import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const Welcome = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Typography fontWeight={"500"}>Sign In</Typography>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            source={require("../../assets/images/welcome.png")}
            style={styles.welcomeImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.footer}>
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(12)}
            style={{ alignItems: "center" }}
          >
            <Typography size={30} fontWeight={"800"}>
              Always take control
            </Typography>
            <Typography size={30} fontWeight={"800"}>
              of your finances
            </Typography>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(12)}
            style={{ alignItems: "center", gap: 2 }}
          >
            <Typography size={17} color={colors.textLight}>
              Finances must be arranged to set a better
            </Typography>
            <Typography size={17} color={colors.textLight}>
              lifestyle in failure
            </Typography>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(12)}
            style={styles.buttonContainer}
          >
            <Button>
              <Typography
                size={22}
                color={colors.neutral900}
                fontWeight={"600"}
              >
                Get Started
              </Typography>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: spacingY._7,
  },
  welcomeImage: {
    width: "100%",
    height: verticalScale(300),
    alignSelf: "center",
    marginTop: verticalScale(100),
  },
  loginButton: { alignSelf: "flex-end", marginRight: spacingX._20 },
  footer: {
    backgroundColor: colors.neutral900,
    alignItems: "center",
    paddingTop: verticalScale(30),
    paddingBottom: verticalScale(45),
    gap: spacingY._20,
    shadowColor: "white",
    shadowOffset: { width: 0, height: -10 },
    elevation: 10,
    shadowRadius: 25,
    shadowOpacity: 0.15,
  },
  buttonContainer: { width: "100%", paddingHorizontal: spacingX._25 },
});
