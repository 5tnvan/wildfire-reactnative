import { View, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useRef, useState } from 'react';

import { Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const videos = [
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
];

const videos2 = [
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    title: "This is for bigger fun!",
    likes: 100,
    comments: 50,
    shares: 20,
    username: "big_bunny",
    avatar_url: "https://media1.tenor.com/m/hOFCCrNX1-4AAAAC/deadpixels-dpgc.gif",
    followers: 500,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    title: "Bigger Blazes :)",
    likes: 200,
    comments: 70,
    shares: 30,
    username: "small_pie",
    avatar_url: "https://media.tenor.com/xahLJFsO-cEAAAAi/thank-you.gif",
    followers: 1000,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    title: "Big buck big",
    likes: 100,
    comments: 50,
    shares: 20,
    username: "big_bunny",
    avatar_url: "https://media1.tenor.com/m/hOFCCrNX1-4AAAAC/deadpixels-dpgc.gif",
    followers: 500,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Elephant do not forget",
    likes: 200,
    comments: 70,
    shares: 30,
    username: "small_pie",
    avatar_url: "https://media.tenor.com/xahLJFsO-cEAAAAi/thank-you.gif",
    followers: 1000,
  },
  {
    uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    title: "Big escapes",
    likes: 200,
    comments: 70,
    shares: 30,
    username: "chewbaka",
    avatar_url: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    followers: 2374,
  },
];

export function LogoWildfireLit() {
  return (
    <Image
      source={require('@/assets/images/wildfire-logo-lit.png')}
      className='w-[68px] h-[24px]'
    />
  );
}

type Props = {
  width: number;
  height: number;
  border: number;
};

export function Avatar({ width, height, border }: Props) {
  return (
    <View className={`border-white rounded-full border-${border} overflow-hidden`}>
      <Image
        source={{ uri: "https://media1.tenor.com/m/TpQVgP2rs58AAAAC/goma-cat-peach-cat.gif" }}
        className={`rounded-full bg-contain`}
        width={width}
        height={height}
      />
    </View>


  );
}

export function PressableSkort() {
  return (
    <Pressable
      className='flex-row items-center bg-neutral px-1 rounded-lg border'
      onPress={() => {
        alert("skort");
      }}
    >
      <Image
        source={require('@/assets/images/dice-01.png')}
        className='w-5 h-5'
      />
      <Text className='font-semibold'>Roll dice</Text>
    </Pressable>
  );
}

export function PressableBuy() {
  return (
    <Pressable
      className='flex-row items-center bg-primary py-1 px-2 rounded-2xl border'
      onPress={() => {
        alert("skort");
      }}
    >
      <Image
        source={require('@/assets/images/dollar-coin.png')}
        className='w-5 h-5'
      />
      <Text className='font-semibold ml-1'>Buy $BUNNEH</Text>
    </Pressable>
  );
}

export function PressableAvatarWithUsername() {
  return (
    <Pressable
      className='flex-row items-center'
      onPress={() => {
        alert("avatar");
      }}
    >
      <Avatar width={45} height={45} border={2} />
      <Text className='font-semibold text-lg text-white ml-1'>@bunneh</Text>
    </Pressable>
  );
}

export function PressableFire() {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      <Image
        source={require('@/assets/images/fire-icon-36-36.png')}
        width={100}
        height={100}
      />
      <Text className='font-semibold text-lg text-white ml-1'>3k</Text>
    </Pressable>
  );
}
export function PressableComment() {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      <FontAwesome name="commenting-o" size={24} color="white" />
      <Text className='font-semibold text-lg text-white ml-1'>255</Text>
    </Pressable>
  );
}
export function PressableShare() {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      <FontAwesome5 name="share" size={20} color="white" />
      <Text className='font-semibold text-lg text-white ml-1'>35</Text>
    </Pressable>
  );
}

export default function SkortScreen() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  }
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
  return (
    <View style={styles.container} className=''>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <Item item={item} shouldPlay={index === currentViewableItemIndex} />
        )}
        keyExtractor={item => item}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
      {/* SKORT TOP */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-between w-full px-3">
          <View className='flex-row items-center'>
            <LogoWildfireLit />
            <Text className='text-lg text-white font-semibold ml-2'>Is there extraterrestrial life?</Text>
          </View>
          <View><PressableSkort /></View>
        </View>
      </SafeAreaView>

        {/* SKORT BOTTOM */}
        <View className='absolute bottom-20 flex-row justify-between items-center w-full p-3'>
          <View className='flex-row items-center'>
            <PressableAvatarWithUsername />
            <Text className='ml-1 text-base text-slate-300 mr-2'>3k followers</Text>
          </View>
          <PressableBuy />
        </View>


      {/* SKORT BOTTOM RIGHT */}
      <View className='absolute bottom-44 right-3 flex-col items-center justify-end'>
        <View className='mb-2'><PressableFire /></View>
        <View className='mb-2'><PressableComment /></View>
        <View className='mb-2'><PressableShare /></View>
      </View>
    </View>
  );
}

const Item = ({ item, shouldPlay }: { shouldPlay: boolean; item: string }) => {
  const video = React.useRef<Video | null>(null);
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) {
      video.current.playAsync()
    } else {
      video.current.pauseAsync()
      video.current.setPositionAsync(0)
    }
  }, [shouldPlay])

  return (
    <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          source={{ uri: item }}
          style={styles.video}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  videoContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});