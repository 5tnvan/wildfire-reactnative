import { StyleSheet, Image, useColorScheme } from "react-native";
import React from 'react';
import { Text, View } from "../Themed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView className="px-2 h-0">
      <Image
        source={require("../../../assets/images/wildfire-logo-lit.png")}
        style={styles.logo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 75,
    height: 50,
    resizeMode: "contain",
  },
});