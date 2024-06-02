import React, { memo, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import Video from 'react-native-video';
import { PressableComment } from '../pressables/PressableComment';
import { PressableFire } from '../pressables/PressableFire';
import { PressableAvatarWithUsername } from '../pressables/PressableAvatarWithUsername';
import { PressableTip } from '../pressables/PressableTip';
import FormatNumber from '../FormatNumber';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { TimeAgo } from '../TimeAgo';
import { FontAwesome } from '@expo/vector-icons';
import { FiresModal } from '../modals/FiresModal';
import { CommentsModal } from '../modals/CommentsModal';
import { useAuth } from '../../services/providers/AuthProvider';
import { increment_views } from '../../utils/views/incrementViews';
import { fetchViewCount } from '@/src/utils/fetch/fetchViewCount';

function InfiniteScrollItem({ item, isPlaying }: any) {

    const router = useRouter();
    const video = React.useRef<any>(null);

    //COSUME PROVIDERS
    const { user } = useAuth();

    //CHECK IF VIDEO IS BEING VIEWED
    //Handles play/pause based on isPlaying prop
    useEffect(() => {
        if (!video.current) return;

        if (isPlaying) { //it is in view, play
            video.current.seek(0);
            video.current.resume();
            setPaused(false); // Video is playing, so hide the play icon
        } else { // it is not in view, pause
            video.current.pause();
            video.current.seek(0);
        }
    }, [isPlaying]);

    //AFTER 3rd PLAY REPEAT, PAUSE VIDEO
    //const [repeatCount, setRepeatCount] = useState(0);
    const repeatCountRef = useRef(0);
    const [threePlayPaused, setThreePlayPaused] = useState(false);

    const handleThreePlayRepeat = () => {
        if (repeatCountRef.current < 2) {
            repeatCountRef.current += 1;
          } else {
            // Pause the video after 3rd repeat
            if (video.current) {
              video.current.seek(0);
              video.current.pause();
              setThreePlayPaused(true);
              fadeIn();
            }
          }
    };

    // HANDLE WATCH AGAIN
    const handleWatchAgain = () => {
        //incrementviews
        handleIncrementViews()
        //reset
        repeatCountRef.current = 0;
        setThreePlayPaused(false);
        fadeAnim.setValue(0);
        if (video.current) {
            video.current.resume();
        }
    };
    const fadeAnim = useRef(new Animated.Value(0)).current; // WATCH AGAIN FADE-IN ANIM
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    //WHEN VIDEO IS IN VIEW AGAIN, RESET
    // Resets repeat count and visibility of watch again button when item becomes active
    useEffect(() => {
        if (isPlaying) {
            handleIncrementViews();
            repeatCountRef.current = 0;
            setThreePlayPaused(false);
            fadeAnim.setValue(0);
        }
    }, [isPlaying]);

    // HANDLE MANUAL PAUSE
    const [paused, setPaused] = useState(false);

    const handleManualPause = () => {
        if (!threePlayPaused) {
            if (isPlaying && !paused) {
                video.current.pause();
                setPaused(true);
            } else {
                video.current.resume();
                setPaused(false);
            }

        }
    };

    //HANDLE LIKE PRESS
    const [likeCount, setLikeCount] = useState(item["3sec_fires"][0].count);
    const [temporaryLiked, setTemporaryLiked] = useState(false);
    const [firesModalVisible, setFiresModalVisible] = useState(false); //fires modal

    const handleLikePress = async () => {
        //if liked already, a modal will appear
        if (item.liked || temporaryLiked) {
            setFiresModalVisible(true);
            if (video.current) {
                video.current.pause();
            }
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
        // Pause the video when comment modal is opened
        if (video.current) {
            video.current.pause();
        }
    };

    //GET VIDEO VIEWS
    const [totalViews, setTotalViews] = useState<any>(null);
    const handleGetViews = async () => {
        const res = await fetchViewCount(item.id);
        setTotalViews(res?.view_count);
    }

    //HANDLE INCREMENT VIEWS
    const handleIncrementViews = async () => {
        increment_views(item.id);
    }

    return (
        <>
            <Pressable onPress={handleManualPause}>
                {/* FULL-SCREEN VIDEO */}
                <View style={styles.videoContainer}>
                    <Video
                        ref={video}
                        source={{ uri: item.video_url }}
                        resizeMode="cover"
                        style={styles.video}
                        repeat={true}
                        onEnd={handleThreePlayRepeat}
                        paused={!isPlaying}
                    />
                </View>
                {/* WATCH AGAIN */}
                {threePlayPaused && (
                    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
                        <Pressable className="bg-zinc-100/70 p-3 rounded-full flex-row" onPress={handleWatchAgain}>
                            <FontAwesome name="eye" size={24} color="black" />
                            <Text className="text-black text-base ml-1">Watch again</Text>
                        </Pressable>
                    </Animated.View>
                )}
                {/* PLAY ICON */}
                {paused && ( // Conditionally render the play icon overlay when video is paused
                    <View style={styles.playIconContainer} className='gap-2'>
                        <FontAwesome5 name="play" size={36} color="white" />
                    </View>
                )}
                {/* TOP */}
                <SafeAreaView className='absolute right-3'>
                    <TouchableOpacity className={`flex-row items-center rounded-full bg-white/70`} onPress={() => handleGetViews()}>
                        <View className='px-2 py-1'><FontAwesome name="eye" size={18} color="black" /></View>
                        {totalViews && <Text className='text-lg mr-2'><FormatNumber number={totalViews} /></Text>}
                    </TouchableOpacity>
                </SafeAreaView>
                {/* BOTTOM */}
                <LinearGradient className='absolute bottom-0 p-3 w-full' colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 1)']}>
                    <View className='flex-col items-center justify-between'>
                        <View className='flex-row items-center'>
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
                            <PressableComment amount={commentCount} onPress={handleCommentPress} />
                        </View>
                        <View className='bg-secondary/70 flew-row rounded-full px-4 py-2 grow mr-1'>
                            <PressableTip onPress={() => Linking.openURL("https://www.wildpay.app/" + item.profile.username)} />
                        </View>
                        <View className='bg-secondary/70 flew-row rounded-full px-4 py-1 grow mr-0'>
                            <PressableFire liked={{ liked: item.liked, temporaryLiked: temporaryLiked }} amount={likeCount} onPress={handleLikePress} />
                        </View>
                    </View>
                </LinearGradient>
            </Pressable>
            {/* FIRES MODAL */}
            {firesModalVisible && <FiresModal visible={firesModalVisible} data={{ id: item.id, thumbnail: item.thumbnail_url }} onClose={() => {
                setFiresModalVisible(false);
                if (video.current && !threePlayPaused && !paused) {
                    video.current.resume();
                }
            }} />}
            {/* COMMENT MODAL */}
            {commentModalVisible && <CommentsModal visible={commentModalVisible} data={{ id: item.id, thumbnail: item.thumbnail_url }} onClose={() => {
                if (video.current && !threePlayPaused && !paused) {
                    video.current.resume();
                }
                setCommentModalVisible(false)
            }} />}
        </>
    );

}
export default memo(InfiniteScrollItem);

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
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });