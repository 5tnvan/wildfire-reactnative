import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { LogoWildfireLit } from './logos/LogoFireLit';
import { ViewCount } from './counts/ViewCount';
import { PressableShare } from './pressables/PressableShare';
import { PressableComment } from './pressables/PressableComment';
import { PressableFire } from './pressables/PressableFire';
import { PressableAvatarWithUsername } from './pressables/PressableAvatarWithUsername';
import { PressableTip } from './pressables/PressableTip';
import { PressableGift } from './pressables/PressableGift';
import { PressableBuy } from './pressables/PressableBuy';
import FormatNumber from './FormatNumber';
import { LinearGradient } from 'expo-linear-gradient';
import { PressableNFT } from './pressables/PressableNFT';
import { supabase } from '../lib/supabase';
import { TimeAgo } from './TimeAgo';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

type Props = {
  data: any;
};

/** 
 * SKORT SCREEN
 * Feed of videos
 * **/
export default function SkortComponent({ data }: Props) {
  const router = useRouter();

  //Keeps track of which video is currently in the user's view. This is crucial for knowing which video to play.
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);

  //Manages how videos in the feed are played and paused based on their visibility on the screen.
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  //This function updates currentViewableItemIndex based on the item currently in view.
  //It's essential for determining which video should be playing as the user scrolls.
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };

  //Manages how videos in the feed are played and paused based on their visibility on the screen.
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  //Handle when user goes back
  const reset = () => {
    // setCurrentViewableItemIndex(0);
    router.back();
  };

  return (
    <View className='flex-1'>
      {/* VIDEO FEED */}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <Item item={item} shouldPlay={index === currentViewableItemIndex} />
        )}
        keyExtractor={(item, index) => index.toString()}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />

      {/* BACK BUTTON */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-between w-full px-3">
          <Pressable onPress={reset} className='flex-row items-center'>
            <Ionicons name="chevron-back" size={18} color="#F10849" />
            <LogoWildfireLit />
          </Pressable>
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
          <View className='flex-row items-center gap-1 mr-2'>
            <FontAwesome name="map-pin" size={18} color="orange" />
            <Text className='text-accent text-base font-bold'>Czechia</Text>
          </View>
          <ViewCount amount={item.views} />
          {/* <View className='ml-3'><PressableGift /></View> */}
        </View>
      </SafeAreaView>
      {/* SKORT BOTTOM */}
      <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
        <View className='flex-row items-center'>
          <View className='flex-row items-center'>
            <PressableAvatarWithUsername avatar_url={item.avatar_url} username={item.username} />
            <Text className='ml-1 text-lg text-slate-200 mr-2'>
              <TimeAgo timestamp={item.created_at}></TimeAgo>
            </Text>
          </View>
        </View>
        <View className='flex-row items-center mt-2 mb-5'>
          <View className='bg-secondary/70 rounded-full px-4 py-1 mr-2' style={styles.shadow}>
            <PressableComment amount={item.comments} />
          </View>
          <View className='bg-secondary/70 flex-row rounded-full px-4 py-1 mr-2' style={styles.shadow}>
            <PressableShare amount={item.shares} />
          </View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-1 mr-2' style={styles.shadow}>
            <PressableFire amount={item.fires} />
          </View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-2 mr-2' style={styles.shadow}>
            <PressableTip />
          </View>
        </View>
      </LinearGradient>
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
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.27,
    // shadowRadius: 4.65,

    // elevation: 6,
  }
});
