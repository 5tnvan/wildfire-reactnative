import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthUser } from "@/src/services/providers/AuthUserProvider";
import { Stack } from "expo-router";
import { useAuth } from "@/src/services/providers/AuthProvider";
import { useDailyPostLimit } from "@/src/hooks/useDailyPostLimit";
import { TimeAgo } from "@/src/components/TimeAgo";

type Props = {
  iconName: any,
  iconSize: number,
  text: string,
}

export function ToolTip({ iconName, iconSize, text } : Props) {
  const colorScheme = useColorScheme();
  return (
    <View className={`flex flex-row mb-3 p-5 ${colorScheme === 'dark' ? "bg-secondary" : "bg-neutral"} rounded-full`}>
      <Text><MaterialIcons name={iconName} size={iconSize} color={"white"} /></Text>
      <Text className="ml-3">{text}</Text>
    </View>
  );
}

export default function ModalScreen() {
  const {limit, posts, postLeft, refetch} = useDailyPostLimit();
  // console.log("limit", limit);
  // console.log("posts", posts);
  // console.log("postLeft", postLeft);
  return (
    <>
      <View className="flex grow items-center justify-start pt-20 pl-5 pr-5">
        {/* Create a wildpay account */}
        <View className='flex flex-row items-center justify-center mb-5'>
          <Text className="text-lg mr-2 font-bold">Create a</Text>
          <Text className='text-lg font-bold mr-2 text-accent'>3 sec</Text>
          <Text className="text-lg mr-2 font-bold">memory</Text>
        </View>
        {/* Tooltips */}
        <View className="flex flex-col w-full">
          <Text>You have {postLeft} posts left today</Text>
          {posts && posts.map((post: { created_at: string; id: string }) => (
            <View key={post.id} className="mb-3">
              <Text className="text-white"><TimeAgo timestamp={post.created_at}></TimeAgo></Text>
              
            </View>
          ))}
        </View>
        <Pressable onPress={refetch}><Text className="white">Refetch</Text></Pressable>
        
        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </>
    
  );
}
