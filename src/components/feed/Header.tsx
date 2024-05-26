import { StyleSheet, Image, useColorScheme } from "react-native";
import React from 'react';
import { Text, View } from "../Themed";

export default function Header() {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/images/wildfire-logo-lit.png")}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  logo: {
    width: 75,
    height: 50,
    resizeMode: "contain",
  },
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionItem: {
    width: 27,
    height: 27,
    resizeMode: "contain",
    marginLeft: 20,
  },
});