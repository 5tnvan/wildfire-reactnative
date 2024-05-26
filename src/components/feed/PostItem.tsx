import { Image, StyleSheet, useColorScheme, TouchableOpacity, Pressable, Animated } from "react-native";
import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from "../Themed";
import { SimpleLineIcons, MaterialCommunityIcons, Entypo, FontAwesome } from "@expo/vector-icons";
import Video from "react-native-video";
import { TimeAgo } from "../TimeAgo";
import { Avatar } from "../avatars/avatar";
import { mute, unmute } from '../../utils/exportedFunction';

export default function PostItem({ item, isPlaying, isMuted, toggleMute }: any) {
  const colorScheme = useColorScheme();
  const videoRef = useRef<any>(null);
  const [paused, setPaused] = useState(false);

  // console.log("post item", item.id)
  // console.log("post isPlaying", isPlaying)
  // console.log("post isMuted", isMuted)
  // console.log("----------------")

  // FADE-IN ANIM
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial value for opacity: 0
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
  };

  // WATCH AGAIN
  const handleWatchAgain = () => {
    setRepeatCount(0); // Reset the repeat count
    setPaused(false); // Set paused state to false to resume the video
    fadeAnim.setValue(0); // Reset the opacity animation value
    if(videoRef.current) videoRef.current.resume();
  };

  //AFTER X PLAY REPEAT, PAUSE VIDEO
  const [repeatCount, setRepeatCount] = useState(0);

  const handleVideoEnd = () => {
    setRepeatCount(prevCount => {
      if (prevCount < 2) {
        return prevCount + 1;
      } else {
        // Pause the video after 3th repeat
        if (videoRef.current) {
          videoRef.current.seek(0);
          videoRef.current.pause();
          setPaused(true);
          fadeIn();
        }
        return prevCount;
      }
    });
  };

  //WHEN VIDEO IS IN VIEW AGAIN, RESET
  useEffect(() => {
    if (isPlaying) {
      setRepeatCount(0);
      setPaused(false);
      fadeAnim.setValue(0); // Reset opacity to 0
    }
  }, [isPlaying]);

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
          onEnd={handleVideoEnd}
        />

        {/* AVATAR */}
        <View className="absolute bg-transparent p-3"><Avatar
            avatar_url={item.profile.avatar_url}
            username={item.profile.username}
            size={"md"}
            ring={true}
          ></Avatar></View>

        {/* PAUSED */}
        {paused && (
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Pressable className="bg-zinc-100/70 p-3 rounded-full flex-row" onPress={handleWatchAgain}>
              <FontAwesome name="eye" size={24} color="black" />
              <Text className="text-black text-base ml-1">Watch again</Text>
            </Pressable>
          </Animated.View>
        )}
        
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
    padding: 10,
    borderRadius: 5,
  },
  icon: {
    width: 20,
    height: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the background color as needed
    justifyContent: 'center',
    alignItems: 'center',
  },
});
