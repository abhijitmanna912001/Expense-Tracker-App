import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/contexts/authContext";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { AtIcon, LockIcon } from "phosphor-react-native";
import React, { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Login = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login: loginUser } = useAuth();

  const handleSubmit = async () => {
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Login", "Please fill in all fields.");
    }
    setIsLoading(true);

    const res = await loginUser(emailRef.current, passwordRef.current);
    setIsLoading(false);

    if (!res.success) {
      Alert.alert("Login Error", res.msg);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton iconSize={28} />
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typography size={30} fontWeight={"800"}>
            Hey,
          </Typography>
          <Typography size={30} fontWeight={"800"}>
            Welcome Back
          </Typography>
        </View>

        <View style={styles.form}>
          <Typography size={16} color={colors.textLighter}>
            Login now to track your expenses
          </Typography>
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

          <Typography
            size={14}
            color={colors.text}
            style={{ alignSelf: "flex-end" }}
          >
            Forgot Password?
          </Typography>

          <Button loading={isLoading} onPress={handleSubmit}>
            <Typography fontWeight={"700"} color={colors.black} size={21}>
              Login
            </Typography>
          </Button>
        </View>
        <View style={styles.footer}>
          <Typography size={15}>Don&apos;t have an account?</Typography>
          <Pressable onPress={() => router.navigate("/(auth)/register")}>
            <Typography size={15} fontWeight={"700"} color={colors.primary}>
              Sign up
            </Typography>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Login;

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
