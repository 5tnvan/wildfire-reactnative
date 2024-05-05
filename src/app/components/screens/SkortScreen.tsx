import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LogoWildfireLit } from '../logos/LogoFireLit';
import { ViewCount } from '../counts/ViewCount';
import { PressableShare } from '../pressables/PressableShare';
import { PressableComment } from '../pressables/PressableComment';
import { PressableFire } from '../pressables/PressableFire';
import { PressableAvatarWithUsername } from '../pressables/PressableAvatarWithUsername';
import { PressableTip } from '../pressables/PressableTip';
import { PressableGift } from '../pressables/PressableGift';
import { PressableBuy } from '../pressables/PressableBuy';
import FormatNumber from '../FormatNumber';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableNFT } from '../pressables/PressableNFT';

const videos2 = [
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "This is for bigger fun! This is for bigger fun! This is for bigger fun! This is for bigger fun!",
    fires: 1456,
    comments: 50,
    shares: 203,
    views: 5034,
    username: "big_bunny",
    avatar_url: "https://media1.tenor.com/m/hOFCCrNX1-4AAAAC/deadpixels-dpgc.gif",
    followers: 53,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Bigger Blazes :)",
    fires: 220,
    comments: 5,
    shares: 30,
    views: 68730,
    username: "small_pie",
    avatar_url: "https://media1.tenor.com/m/s1tF13IX81gAAAAC/blank-stare-really.gif",
    followers: 1003,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big buck big",
    fires: 1030,
    comments: 540,
    shares: 270,
    views: 687330,
    username: "big_bunny",
    avatar_url: "https://media1.tenor.com/m/hOFCCrNX1-4AAAAC/deadpixels-dpgc.gif",
    followers: 2209,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephant do not forget",
    fires: 2700,
    comments: 770,
    shares: 370,
    views: 397893,
    username: "small_pie",
    avatar_url: "https://media1.tenor.com/m/s1tF13IX81gAAAAC/blank-stare-really.gif",
    followers: 114232,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
    title: "Big escapes",
    fires: 200,
    comments: 70,
    shares: 30,
    views: 29887,
    username: "chewbaka",
    avatar_url: "https://media1.tenor.com/m/rgJleMzUa8MAAAAC/bailes.gif",
    followers: 1234456,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    title: "The Smoking Tire heads out to Adams Motorsports Park in Riverside",
    fires: 2700,
    comments: 770,
    shares: 370,
    views: 397893,
    username: "small_pie",
    avatar_url: "https://media1.tenor.com/m/s1tF13IX81gAAAAC/blank-stare-really.gif",
    followers: 114232,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    title: "The Smoking Tire is going on the 2010 Bullrun Live Rally in a 2011 Shelby GT500",
    fires: 230,
    comments: 730,
    shares: 30,
    views: 2987,
    username: "chewbaka",
    avatar_url: "https://media1.tenor.com/m/rgJleMzUa8MAAAAC/bailes.gif",
    followers: 1234456,
  },
];

/** 
 * SKORT SCREEN
 * Skort is a short with a reveal
 * **/
export default function SkortScreen() {
  const router = useRouter();
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  useEffect(() => {
    // Cleanup function to reset the playlist when navigating back
    return () => {
      setCurrentViewableItemIndex(0);
    };
  }, []);

  return (
    <View className='flex-1'>
      {/* SKORT FLATLIST */}
      <FlatList
        data={videos2}
        renderItem={({ item, index }) => (
          <Item item={item} shouldPlay={index === currentViewableItemIndex} />
        )}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {/* SKORT TOP */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-between w-full px-3">
          <Pressable onPress={() => router.back()} className='flex-row items-center'><Ionicons name="chevron-back" size={18} color="#F10849" /><LogoWildfireLit /></Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const Item = ({ item, shouldPlay }: { shouldPlay: boolean; item: any }) => {
  const video = React.useRef<Video | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync();
    } else {
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [shouldPlay]);



  return (
    <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
      {/* SKORT VIDEO */}
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          source={{ uri: item.uri }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>
      {/* SKORT TOP */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-end w-full px-3" style={styles.shadow}>
          <ViewCount amount={item.views} />
          <View className='ml-3'><PressableGift /></View>
        </View>
      </SafeAreaView>
      {/* SKORT BOTTOM */}
      <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
        <View className='flex-row items-center'>
          <View className='flex-row items-center'>
            <PressableAvatarWithUsername avatar_url={item.avatar_url} username={item.username} />
            <Text className='ml-1 text-base text-slate-200 mr-2'><FormatNumber number={item.followers}></FormatNumber> followers</Text>
          </View>
        </View>
        <Text className='text-white text-lg ml-2'>{item.title}</Text>
        <View className='flex-row items-center mt-2 mb-5'>
          <View className='mr-1'><PressableTip /></View>
          <View className='mr-1'><PressableNFT /></View>
          <View className='mr-1'><PressableBuy name={item.username}/></View>
        </View>
      </LinearGradient>

      {/* SKORT RIGHT */}
      <View className='absolute bottom-32 right-2'>
        <View className='mb-3' style={styles.shadow}><PressableFire amount={item.fires} /></View>
        <View className='mb-3' style={styles.shadow}><PressableComment amount={item.comments} /></View>
        <View className='mb-3' style={styles.shadow}><PressableShare amount={item.shares} /></View>
      </View>
    </Pressable>
  );
}


/** 
 * SKORT STYLES
 * Css for skorts
 * **/
const styles = StyleSheet.create({
  videoContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  }
});