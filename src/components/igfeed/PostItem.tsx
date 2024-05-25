import { Image, StyleSheet, useColorScheme, TouchableOpacity, Pressable } from "react-native";
import React, { useRef } from 'react';
import { Text, View } from "../Themed";
import { SimpleLineIcons, MaterialCommunityIcons, Entypo } from "@expo/vector-icons";
import Video from "react-native-video";
import { TimeAgo } from "../TimeAgo";
import { Avatar } from "../avatars/avatar";
import { mute, unmute } from '../../utils/exportedFunction';

export default function PostItem({ item, isPlaying, isMuted, toggleMute }: any) {
  const colorScheme = useColorScheme();
  const videoRef = useRef(null);

  return (
    <View className="bg-zinc-900 mb-3 rounded-2xl">
      {/* HEADER */}
      <View className="bg-transparent flex-row items-center px-3 py-4 rounded-2xl">
          <Text className="ml-2 font-semibold text-base">@{item.profile.username}</Text>
          <Text className="ml-1 text-base"><TimeAgo timestamp={item.created_at}></TimeAgo></Text>
        </View>
      {/* VIDEO */}
      <View className="w-full h-[500px] relative mb-1">
        <Video
          ref={videoRef}
          source={{ uri: item.video_url }}
          resizeMode="cover"
          style={styles.video}
          repeat={true}
          volume={isMuted ? 0 : 1}
          paused={!isPlaying}
        />
        <View className="absolute bg-transparent p-3"><Avatar
            avatar_url={item.profile.avatar_url}
            username={item.profile.username}
            size={"md"}
            ring={true}
          ></Avatar></View>
        
        {/* MUTE BUTTON */}
        <Pressable onPress={toggleMute} style={styles.muteButton}>
          <Image source={isMuted ? mute : unmute} style={styles.icon} />
        </Pressable>
      </View>

      {/* ACTIONS */}
      <View className="flex-row bg-transparent gap-2 p-2 self-end ">
          <View className="py-1 px-2 rounded-full flex-row items-center bg-zinc-900/70">
            <SimpleLineIcons name="fire" size={24} color="white" />
            {/* <Text className="ml-1">1.2k</Text> */}
          </View>
          <View className="py-1 px-2 rounded-full flex-row items-center bg-zinc-900/70">
            <MaterialCommunityIcons name="comment-processing-outline" size={26} color="white" />
            {/* <Text className="ml-1">333</Text> */}
          </View>
          <View className="py-1 px-2 rounded-full flex-row items-center bg-zinc-900/70">
            <Entypo name="slideshare" size={24} color="white" />
            {/* <Text className="ml-1">124</Text> */}
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  video: {
    width: '100%',
    height: '100%',
  },
  muteButton: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
});
