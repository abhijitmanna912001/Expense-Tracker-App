import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { colors } from "@/constants/theme";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";

const Home = () => {
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <View>
      <Text>Home</Text>
      <Button onPress={handleLogout}>
        <Typography color={colors.black}>Logout</Typography>
      </Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
