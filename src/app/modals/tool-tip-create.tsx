import { StatusBar } from "expo-status-bar";
import { Platform, Pressable, StyleSheet, useColorScheme } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Image } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthUser } from "@/src/services/providers/AuthUserProvider";
import { Stack, router } from "expo-router";
import { useAuth } from "@/src/services/providers/AuthProvider";
import { useDailyPostLimit } from "@/src/hooks/useDailyPostLimit";
import { TimeAgo } from "@/src/components/TimeAgo";
import StatCarousel from "@/src/components/carousel/StatCarousel";
import { PressableAnimated } from "@/src/components/pressables/PressableAnimated";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { LevelsModal } from "@/src/components/modals/LevelsModal";

type Props = {
  iconName: any,
  iconSize: number,
  text: string,
}

export function ToolTip({ iconName, iconSize, text }: Props) {
  const colorScheme = useColorScheme();
  return (
    <View className={`flex flex-row mb-3 p-5 ${colorScheme === 'dark' ? "bg-secondary" : "bg-neutral"} rounded-full`}>
      <Text><MaterialIcons name={iconName} size={iconSize} color={"white"} /></Text>
      <Text className="ml-3">{text}</Text>
    </View>
  );
}

export default function ModalScreen() {

  const { limit, posts, postLeft, refetch } = useDailyPostLimit();

  //HANDLE LEVELS MODAL
  const [levelsModalVisible, setLevelsModalVisible] = useState(false); //levels modal


  // HANDLE WHEN SCREEN IS IN/OUT OF FOCUS
  const isFocused = useIsFocused();
  useEffect(() => {
      if (isFocused) { refetch(); } // refetch data when in focus
  }, [isFocused]);

  
  return (
    <>
      <View className="flex grow items-center justify-start p-5">
        {/* Create a wildpay account */}
        <View className='flex flex-row items-center justify-center mb-5'>
          <Text className="text-lg mr-2 font-bold">You have</Text>
          <Text className='text-lg font-bold mr-2 text-accent'>{postLeft}</Text>
          <Text className="text-lg mr-2 font-bold">posts left today</Text>
        </View>

        {posts && posts.length > 0 &&
          <><View className='flex flex-row items-center justify-center mb-5'>
            <Text className="text-lg mr-2 font-bold">You last post was</Text>
            <Text className="text-lg font-bold mr-2 text-accent">
              <TimeAgo timestamp={posts[0]?.created_at}></TimeAgo>
            </Text>
            <Text className="text-lg mr-2 font-bold">ago</Text>
          </View>
          </>
        }

        <PressableAnimated onPress={() => setLevelsModalVisible(true)}><Text className="white">Level Up</Text></PressableAnimated>
        <LevelsModal visible={levelsModalVisible} onClose={() => setLevelsModalVisible(false)} />

        {/* Use a light status bar on iOS to account for the black space above the modal */}
        <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
      </View>
    </>

  );
}
