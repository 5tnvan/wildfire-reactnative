import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
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

export function ToolTip({ iconName, iconSize, children } : Props) {
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
        <View className='flex-row items-center justify-center mb-5'>
          <Text className="text-lg mr-2 font-bold">Log in with </Text>
          <Image
            source={require('@/assets/images/wildpay-logo.png')}
            className='w-5 h-5 mr-1'
          />
          <Text className='text-lg font-bold mr-2' style={{ color: '#3D45E7' }}>wildpay</Text>
        </View>

        {/* Tooltips */}
        <View className="flex-col w-full">
          <ToolTip iconName="key" iconSize={16}><Text>Login with the same <Text className="font-semibold text-accent">username</Text> and <Text className="font-semibold text-accent">password</Text></Text></ToolTip>
        </View>
        
      </View>
      
      {/* Link */}
      <Link href="/(auth)/register" className="mb-4"><Text className="text-base underline">{`Don't have an account? Register`}</Text></Link>
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </SafeAreaView>
  );
}
