import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from 'react-native';
import { Text, View } from "@/src/app/components/Themed";

type Props = {
  iconName: any,
  iconSize: number,
  text: string,
  bgColor: string
}

export function ToolTip({ iconName, iconSize, text, bgColor } : Props) {
  return (
    <View className={`flex flex-row gap-4 w-full pb-3 pr-3 ${bgColor} rounded`}>
          <Text><FontAwesome name={iconName} size={iconSize} /></Text>        
          <Text className="">{text}</Text>
        </View>
  );
}

export default function ModalScreen() {
  return (
    <View className="flex grow items-center justify-start pt-20 pl-5 pr-5">
      {/* Create a wildpay account */}
      <View className='flex flex-row items-center justify-center mb-5'>
        <Text className="text-lg text-black dark:text-white mr-2 font-bold">Create a</Text>
        <Image
          source={require('@/assets/images/wildpay-logo.png')}
          className='w-5 h-5 mr-1'
        />
        <Text className='text-primary text-lg font-bold mr-2'>wildpay</Text>
        <Text className="text-lg text-black dark:text-white font-bold">account</Text>
      </View>
      <View className="w-full">
        
        <View className="flex flex-row gap-4 w-full pb-3 pr-3 bg-red-400 rounded">
          <Text><FontAwesome name="user" size={16} /></Text>        
          <Text className="">Your Wildpay followers sync to Wildfire</Text>
        </View>
        
        <View className="flex flex-row gap-4 w-full pb-3 pr-3 bg-red-400 rounded">
          <Text><FontAwesome name="key" size={16} colorDark="white" colorLight="dark" className="" /></Text>
          <Text className="">Login with the same credentials</Text>
        </View>

        <View className="flex flex-row gap-4 w-full pb-3 pr-3 bg-red-400 rounded">
          <Text><FontAwesome name="bitcoin" size={16} colorDark="white" colorLight="dark" className="" /></Text>
          <Text className="">Receive coins on Wildfire & withdraw on Wildpay</Text>
        </View>
      </View>
      <ToolTip iconName="user" iconSize={16} text="Your Wildpay followers sync to Wildfire" bgColor="bg-primary" />


      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
