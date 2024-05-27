import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Dimensions, FlatList, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
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
import { FiresModal } from './modals/FiresModal';
import { CommentsModal } from './modals/CommentsModal';
import { useAuth } from '../services/providers/AuthProvider';


/** 
 * THREE SECS SCREEN
 * Infinity Scroll
 * **/
export default function InfiniteScroll() {
  const router = useRouter();
  const isFocused = useIsFocused(); // Get focused state

  //FETCH DIRECTLY
  const { isLoading, feed, fetchMore, refetch } = useFeed();

  // FIGURE OUT WHICH VIDEO IS IN USER'S VIEW TO PLAY
  const [playingIndex, setPlayingIndex] = useState<any>(null);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setPlayingIndex(viewableItems[0].index);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  // HANDLE END REACHED
  const handleEndReached = () => {
    console.log("end reached");
    if (!isLoading) {
      fetchMore();
    }
  };

  // HANDLE REFRESH
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true); // Set refreshing state to true
    refetch(); // Refetch data
    setRefreshing(false); // Set refreshing state back to false
  };

  // HANDLE BACK (EXIT SCREEN)
  const handleBack = () => {
    setPlayingIndex(null);
    router.back();
  };

  // HANDLE WHEN IN FOCUSED
  // useEffect(() => {
  //   if (isFocused) {
  //     console.log("refetching 3secs")
  //     refetch(); //refetch data
  //   }
  // }, [isFocused]);

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
        showsVerticalScrollIndicator={true}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
        refreshing={refreshing} // Set the refreshing state
        onRefresh={handleRefresh} // Handle refresh
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null)}
      />

      {/* BACK BUTTON */}
      <SafeAreaView className='absolute'>
        <View className="flex-row items-center justify-between w-full px-3">
          <Pressable onPress={handleBack} className='flex-row items-center'>
            <Ionicons name="chevron-back" size={18} color="#F10849" />
            <LogoWildfireLit />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const Item = ({ item, isPlaying }: any) => {
  const router = useRouter();
  const video = React.useRef<any>(null);
  const [status, setStatus] = useState<any>(null);

  //COSUME PROVIDERS
  const { user } = useAuth();

  // HANDLE MANUAL PAUSE
  const [paused, setPaused] = useState(false);

  const handleManualPause = () => {
    if (status?.isPlaying) {
      video.current.pauseAsync();
      setPaused(true); // Set paused state to true
    } else {
      video.current.playAsync();
      setPaused(false); // Set paused state to false
    }
  };

  //CHECK IF VIDEO IS BEING VIEWED
  useEffect(() => {
    if (!video.current) return;

    if (isPlaying) { //it is in view, play
      video.current.playAsync();
      setPaused(false); // Video is playing, so hide the play icon
    } else { // it is not in view, pause
      video.current.pauseAsync();
      video.current.setPositionAsync(0);
    }
  }, [isPlaying]);

  //HANDLE LIKE PRESS
  const [likeCount, setLikeCount] = useState(item["3sec_fires"][0].count);
  const [temporaryLiked, setTemporaryLiked] = useState(false);
  const [firesModalVisible, setFiresModalVisible] = useState(false); //fires modal

  const handleLikePress = async () => {
    //if liked already, a modal will appear
    if (item.liked || temporaryLiked) {
      setFiresModalVisible(true);
    } else {
      // Insert like to supabase
      const { data, error } = await supabase.from("3sec_fires").insert({
        video_id: item.id,
        user_id: user?.id,
        fire: true,
      });
      if (!error) {
        setTemporaryLiked(true); // Set temporary like state
        setLikeCount((prevCount: any) => prevCount + 1); // Increment like count
      }
    }
  };

  //HANDLE COMMENT PRESS
  const [commentModalVisible, setCommentModalVisible] = useState(false); //fires modal
  const [commentCount, setCommentCount] = useState(item["3sec_comments"][0].count);

  const handleCommentPress = async () => {
    setCommentModalVisible(true);
  };

  return (
    <>
      <Pressable onPress={handleManualPause}>
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
        {/* PLAY & TOP ICON */}
        {paused && ( // Conditionally render the play icon overlay when video is paused
          <View style={styles.playIconContainer} className='gap-2'>
            <FontAwesome5 name="play" size={36} color="white" />
          </View>
        )}
        {/* SKORT TOP */}
        <SafeAreaView className='absolute'>
          <View className="flex-row items-center justify-end w-full px-3">
            <ViewCount amount={70} />
          </View>
        </SafeAreaView>
        {/* SKORT BOTTOM */}
        <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
          <View className='flex-col items-center justify-between'>
            <View className='flex-row items-center' >
              <PressableAvatarWithUsername avatar_url={item.profile.avatar_url} username={item.profile.username} />
              <Text className='ml-1 text-lg text-white mr-2'>
                <TimeAgo timestamp={item.created_at}></TimeAgo>
              </Text>
            </View>
            {item.country &&
              <View className='flex-row items-center'>
                <FontAwesome name="location-arrow" size={14} color="white" />
                <Text className='text-white text-lg ml-1'>{item.country?.name}</Text>
              </View>
            }

          </View>
          <View className='flex-row items-center mt-2 mb-5 grow justify-between'>
            <View className='bg-secondary/70 rounded-full px-4 py-1 grow mr-1'>
              <PressableComment amount={item["3sec_comments"][0].count} onPress={handleCommentPress} />
            </View>
            {/* <View className='bg-secondary/70 flex-row rounded-full px-4 py-1'>
            <PressableShare amount={100} />
          </View> */}
            <View className='bg-secondary/70 flew-row rounded-full px-4 py-2 grow mr-1'>
              <PressableTip onPress={() => router.push("/(profile)/" + item.profile.username)} />
            </View>
            <View className='bg-secondary/70 flew-row rounded-full px-4 py-1 grow mr-0'>
              <PressableFire liked={item.liked} amount={item["3sec_fires"][0].count} onPress={handleLikePress} />
            </View>
          </View>
        </LinearGradient>
      </Pressable>

      {/* FIRES MODAL */}
      {firesModalVisible && <FiresModal visible={firesModalVisible} data={{ id: item.id, thumbnail: item.thumbnail_url }} onClose={() => setFiresModalVisible(false)} />}

      {/* FIRES MODAL */}
      {commentModalVisible && <CommentsModal visible={commentModalVisible} data={{ id: item.id, thumbnail: item.thumbnail_url }} onClose={() => setCommentModalVisible(false)} />}
    </>
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
  playIconContainer: {
    ...StyleSheet.absoluteFillObject, // Position the play icon container absolutely within the video container
    justifyContent: 'center',
    alignItems: 'center',
  },
});
