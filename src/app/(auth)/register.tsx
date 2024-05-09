import { View, Text, Image, ScrollView } from "react-native";
import AuthRegister from "../components/auth/AuthRegister";

export default function RegisterScreen() {
  return (
    <ScrollView className="flex flex-col justify-content px-4 grow">
      {/* Create a wildpay account */}
      <View className="flex flex-row items-center justify-center my-5">
        <Text className="text-lg text-black dark:text-white mr-2 font-bold">
          Create a
        </Text>
        <Image
          source={require("@/assets/images/wildpay-logo.png")}
          className="w-5 h-5 mr-1"
        />
        <Text className="text-indigo-600 text-lg font-bold mr-2">wildpay</Text>
        <Text className="text-lg text-black dark:text-white font-bold">
          account
        </Text>
      </View>

      {/* Card */}
      <AuthRegister />
    </ScrollView>
  );
}
