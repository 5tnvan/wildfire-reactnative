import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Text, View } from "@/src/app/components/Themed";

export default function ModalScreen() {
  return (
    <View className="flex grow items-center justify-start mt-20 p-5">
      <Text className="text-2xl">Create a Wildpay Account</Text>
      <View
        className="text-lg my-6 h-px w-4/5"
        lightColor="#eee"
        darkColor="#333"
      />
      <View className="gap-3 w-full">
      <View className="flex-row m-0 w-full bg-red-400 rounded p-5">
        <Text className="text-md">
        <FontAwesome name="user" size={16} color="white" className="mr-3"/>
          <Text>  Your Wildpay followers sync to Wildfire</Text>
        </Text>
      </View>
      <View className="flex-row m-0 w-full bg-red-400 rounded p-5 ">
        <Text className="text-md">
        <FontAwesome name="key" size={16} color="white" className="mr-3"/>
          <Text>  You login with the same credentials</Text>
        </Text>
      </View>
      <View className="flex-row m-0 w-full bg-red-400 rounded p-5 ">
        <Text className="text-md">
        <FontAwesome name="bitcoin" size={16} color="white" className="mr-3"/>
          <Text>  You receive payments on Wildfire & withdraw on Wildpay</Text>
        </Text>
      </View>
      </View>
      

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
