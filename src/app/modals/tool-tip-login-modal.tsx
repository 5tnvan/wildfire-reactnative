import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from 'react-native';
import { Text, View } from "@/src/components/Themed";

type Props = {
  iconName: any,
  iconSize: number,
  text: string,
}

export function ToolTip({ iconName, iconSize, text } : Props) {
  const colorScheme = useColorScheme();
  
  return (
    <View className={`flex flex-row mb-3 p-5 ${colorScheme === 'dark' ? "bg-secondary" : "bg-neutral"} rounded-full`}>
      <Text><FontAwesome name={iconName} size={iconSize} /></Text>
      <Text className="ml-3">{text}</Text>
    </View>
  );
}

export default function ModalScreen() {
  return (
    <View className="flex grow items-center justify-start pt-20 pl-5 pr-5">
      {/* Create a wildpay account */}
      <View className='flex flex-row items-center justify-center mb-5'>
        <Text className="text-lg mr-2 font-bold">Log in with </Text>
        <Image
          source={require('@/assets/images/wildpay-logo.png')}
          className='w-5 h-5 mr-1'
        />
        <Text className='text-indigo-800 text-lg font-bold mr-2'>wildpay</Text>
      </View>
      {/* Tooltips */}
      <View className="flex flex-col w-full">
        <ToolTip iconName="key" iconSize={16} text="Login with the same credentials" />
        <ToolTip iconName="bitcoin" iconSize={16} text="Reset password if you don't remember" />
        <ToolTip iconName="bitcoin" iconSize={16} text="Register a new account if you don't have one" />
      </View>
      
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
