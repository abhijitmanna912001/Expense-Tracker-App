import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typography from "@/components/Typography";
import { auth } from "@/config/firebase";
import { colors } from "@/constants/theme";
import { signOut } from "firebase/auth";
import React from "react";
import { StyleSheet } from "react-native";

const Home = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <ScreenWrapper>
      <Typography>Home</Typography>
      <Button onPress={handleLogout}>
        <Typography color={colors.black}>Logout</Typography>
      </Button>
    </ScreenWrapper>
  );
};

export default Home;

const styles = StyleSheet.create({});
