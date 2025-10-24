import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { AtIcon, LockIcon, UserIcon } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Register = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const nameRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current || !nameRef.current) {
      Alert.alert("Sign Up", "Please fill in all fields.");
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typography size={30} fontWeight={"800"}>
            Let&apos;s
          </Typography>
          <Typography size={30} fontWeight={"800"}>
            Get Started
          </Typography>
        </View>

        <View style={styles.form}>
          <Typography size={16} color={colors.textLighter}>
            Create an account to track your expenses
          </Typography>
          <Input
            onChangeText={(value) => (nameRef.current = value)}
            placeholder="Enter your name"
            icon={
              <UserIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            onChangeText={(value) => (emailRef.current = value)}
            placeholder="Enter your email"
            icon={
              <AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />
          <Input
            onChangeText={(value) => (passwordRef.current = value)}
            secureTextEntry
            placeholder="Enter your password"
            icon={
              <LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
          />

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typography fontWeight={"700"} color={colors.black} size={21}>
              Sign Up
            </Typography>
          </Button>
        </View>
        <View style={styles.footer}>
          <Typography size={15}>Already have an account?</Typography>
          <Pressable onPress={() => router.navigate("/(auth)/login")}>
            <Typography size={15} fontWeight={"700"} color={colors.primary}>
              Login
            </Typography>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: { flex: 1, gap: spacingY._30, paddingHorizontal: spacingX._20 },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: { gap: spacingY._20 },
  forgetPassword: { textAlign: "right", fontWeight: "500", color: colors.text },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
