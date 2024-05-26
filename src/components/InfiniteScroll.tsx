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
import { useFeed } from '../hooks/useFeed';
import { useIsFocused } from '@react-navigation/native';


/** 
 * THREE SECS SCREEN
 * Infinity Scroll
 * **/
export default function InfiniteScroll() {
  const router = useRouter();
  const isFocused = useIsFocused(); // Get focused state
  
  //FETCH DIRECTLY
  const { isLoading, feed, refetch } = useFeed();

  console.log("feed", JSON.stringify(feed, null, 2));

  // FIGURE OUT WHICH VIDEO IS IN USER'S VIEW TO PLAY
  const [playingIndex, setPlayingIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setPlayingIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  // HANDLE EXIT
  const reset = () => {
    // setplayingIndex(0);
    router.back();
  };

  // HANDLE WHEN IN FOCUSED
  useEffect(() => {
    if (isFocused) {
      console.log("refetching 3secs")
      refetch(); //refetch data
    }
  }, [isFocused]);

  return (
    <View className='flex-1'>
      {/* VIDEO FEED */}
      <FlatList
        data={feed}
        renderItem={({ item, index }) => (
          <Item 
          item={item} 
          isPlaying={index === playingIndex} />
        )}
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

const Item = ({ item, isPlaying }: any) => {
  const video = React.useRef<any>(null);
  const [status, setStatus] = useState<any>(null);

  //CHECK IF VIDEO IS BEING VIEWED
  useEffect(() => {
    if (!video.current) return;

    if (isPlaying) { //it is in view, play
      video.current.playAsync();
    } else { // it is not in view, pause
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [isPlaying]);

  return (
    <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
      {/* SKORT VIDEO */}
      <View style={styles.videoContainer}>
        <Video
          ref={video}
          source={{ uri: item.video_url }}
          resizeMode={ResizeMode.COVER}
          style={styles.video}
          isLooping
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      </View>
      {/* SKORT TOP */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-end w-full px-3" style={styles.shadow}>
          <ViewCount amount={70} />
        </View>
      </SafeAreaView>
      {/* SKORT BOTTOM */}
      <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
        <View className='flex-col items-center justify-between'>
          <View className='flex-row items-center' >
            <PressableAvatarWithUsername avatar_url={item.profile.avatar_url} username={item.profile.username} />
            <Text className='ml-1 text-lg text-white mr-2' style={styles.shadow}>
              <TimeAgo timestamp={item.created_at}></TimeAgo>
            </Text>
          </View>
          {item.country && 
          <View className='flex-row items-center' style={styles.shadow}>
          <FontAwesome name="location-arrow" size={14} color="white" />
          <Text className='text-white text-lg ml-1'>{item.country?.name}</Text>
          </View>
          }
          
        </View>
        <View className='flex-row items-center mt-2 mb-5 justify-stretch'>
          <View className='bg-secondary/70 rounded-full px-4 py-1 mr-2'>
            <PressableComment amount={100} />
          </View>
          <View className='bg-secondary/70 flex-row rounded-full px-4 py-1 mr-2'>
            <PressableShare amount={100} />
          </View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-1 mr-2'>
            <PressableFire amount={100} />
          </View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-2 mr-2'>
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
    shadowColor: "#fff",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 10,

    elevation: 0,
  }
});
