import React, { useEffect, useRef, useState } from 'react';
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

/** 
 * SKORT SCREEN
 * Skort is a short with a reveal
 * **/
export default function SkortComponent() {
  
  const router = useRouter();
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  const [videos2, setVideos2] = useState<any[]>([]);

useEffect(() => {
  const fetchVideos = async () => {
    try {
      const { data } = await supabase
        .from('1sec')
        .select('video_url, created_at, profile:user_id(id, username, avatar_url)');

        console.log("video data", data);

      if (data && data.length > 0) {
        const videos = data.map((video: any) => ({
          uri: video.video_url,
          fires: 1456,
          comments: 50,
          shares: 203,
          views: 5034,
          username: video.profile.username,
          avatar_url: video.profile.avatar_url,
          created_at: video.created_at
        }));

        setVideos2(videos);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  fetchVideos();
}, []);


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
          <View className='flex-row items-center gap-1 mr-2'><FontAwesome name="map-pin" size={18} color="orange" /><Text className='text-accent text-base font-bold'>Czechia</Text></View>
          <ViewCount amount={item.views} />
          {/* <View className='ml-3'><PressableGift /></View> */}
        </View>
      </SafeAreaView>
      {/* SKORT BOTTOM */}
      <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
        <View className='flex-row items-center'>
          <View className='flex-row items-center'>
            <PressableAvatarWithUsername avatar_url={item.avatar_url} username={item.username} />
            <Text className='ml-1 text-lg text-slate-200 mr-2'><TimeAgo timestamp={item.created_at}></TimeAgo></Text>
          </View>
        </View>
        {/* <View className='flex-row items-center mt-2 mb-5'>
          <View className='mr-1'><PressableTip /></View>
          <View className='mr-1'><PressableNFT /></View>
          <View className='mr-1'><PressableBuy name={item.username}/></View>
        </View> */}
        <View className='flex-row items-center mt-2 mb-5'>
          <View className='bg-secondary/70 rounded-full px-4 py-1 mr-2' style={styles.shadow}><PressableComment amount={item.comments} /></View>
          <View className='bg-secondary/70 flex-row rounded-full px-4 py-1 mr-2' style={styles.shadow}><PressableShare amount={item.shares} /></View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-1 mr-2' style={styles.shadow}><PressableFire amount={item.fires} /></View>
          <View className='bg-secondary/70 flew-row rounded-full px-4 py-2 mr-2' style={styles.shadow}><PressableTip /></View>
        </View>
      </LinearGradient>

      {/* SKORT RIGHT */}
      {/* <View className='absolute bottom-32 right-2'>
        <View className='mb-3' style={styles.shadow}><PressableFire amount={item.fires} /></View>
        <View className='mb-3' style={styles.shadow}><PressableComment amount={item.comments} /></View>
        <View className='mb-3' style={styles.shadow}><PressableShare amount={item.shares} /></View>
      </View> */}
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