import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import { Image } from 'react-native';
import { Text } from "@/src/components/Themed";
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  iconName: any,
  iconSize: number,
  children: React.ReactNode;
}

export function ToolTip({ iconName, iconSize, children }: Props) {
  const colorScheme = useColorScheme();
  return (
    <View className={`flex flex-row mb-3 p-5 ${colorScheme === 'dark' ? "bg-zinc-900" : "bg-neutral"} rounded-full`}>
      <Text><MaterialIcons name={iconName} size={iconSize} color={colorScheme === 'dark' ? 'bg-neutral' : 'bg-zinc-900'} /></Text>
      <Text className="ml-3">{children}</Text>
    </View>
  );
}

export default function ModalScreen() {
  return (
    <SafeAreaView className="flex-1 items-center px-5">

      <View className="grow">

        {/* Create a wildpay account */}
        <View className='flex flex-row items-center justify-center mb-5'>
          <Text className="text-lg mr-2 font-bold">What is</Text>
          <Image
            source={require('@/assets/images/wildpay-logo.png')}
            className='w-5 h-5 mr-1'
          />
          <Text className='text-lg font-bold mr-2' style={{ color: '#3D45E7' }}>wildpay</Text>
          <Text className="text-lg font-bold">?</Text>
        </View>

        {/* Tooltips */}
        <View className="flex flex-col w-full">
          <ToolTip iconName="money" iconSize={16} ><Text>A borderless <Text className="font-semibold text-accent">payment</Text> app</Text></ToolTip>
          <ToolTip iconName="accessibility-new" iconSize={16}><Text>Keep the same <Text className="font-semibold text-accent">followers</Text> and <Text className="font-semibold text-accent">credentials</Text></Text></ToolTip>
          <ToolTip iconName="currency-bitcoin" iconSize={16}><Text>Get your <Text className="font-semibold text-accent">paycheck</Text> instantly, anytime</Text></ToolTip>
        </View>
      </View>

      {/* Link */}
      <Link href="https://www.wildpay.com/" className="mb-4"><Text className="text-base underline">{`Visit www.wildpay.com`}</Text></Link>
      
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}
