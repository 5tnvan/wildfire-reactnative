import { StyleSheet, Image, useColorScheme, View } from "react-native";
import React from 'react';
import { Text } from "../Themed";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require("../../../assets/images/wildfire-logo-lit.png")}
        style={styles.logo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    height: 50,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  logo: {
    width: 75,
    height: 50,
    resizeMode: "contain",
  },
});