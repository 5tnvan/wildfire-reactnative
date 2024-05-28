import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, Modal, Animated } from 'react-native';
import Video from 'react-native-video';
import { useFeedFromCountry } from '@/src/hooks/useFeedFromCountry';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import StoryComponent from '../StoryComponent';

const CARD_WIDTH = Dimensions.get('window').width * 0.8;
const CARD_HEIGHT = 600
const MARGIN_LEFT = 0;
const MARGIN_RIGHT = 4;

export default function FeedCarouselByCountry() {

    // SET UP MASTER FEED
    const { feed: masterFeed, refetch: refetchFeed } = useFeedFromCountry(3);

    // FIGURE OUT WHICH VIDEO IS PLAYING
    const [playingIndex, setPlayingIndex] = useState<any>(null);
    const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
    const onViewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setPlayingIndex(viewableItems[0].index);
        } else {
            setPlayingIndex(null);
        }
    };
    const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

    // SET UP STORY COMPONENT
    const [storyFeed, setStoryFeed] = useState(null);
    const [insideStory, setInsideStory] = useState(false);
    function openStory(storyFeed: any) {
        setStoryFeed(storyFeed);
        setInsideStory(true);
        setPlayingIndex(null);
        openModal();
    }
    function closeStory() { setInsideStory(false); closeModal() }

    // SET UP MODAL COMPONENT
    const [insideModal, setInsideModal] = useState(false);
    function openModal() { setInsideModal(true); }
    function closeModal() { setInsideModal(false); }

    // HANDLE WHEN SCREEN IS IN/OUT OF FOCUS
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) { refetchFeed(); } // refetch data when in focus
        else { setPlayingIndex(null); } // stop playing when out of focus
    }, [isFocused]);

    return (
        <>
            {insideStory && (
                <Modal
                    visible={insideModal}
                    onRequestClose={() => closeModal()}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <StoryComponent data={{feed: storyFeed}} onFinishStory={closeStory} />
                </Modal>
            )}
            {masterFeed &&
                (
                    <FlatList
                        data={masterFeed}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => 
                        <Item 
                            video_url={item.first_video} 
                            country={item.country_name} 
                            onPress={() => openStory(item.data)}
                            isPlaying={index === playingIndex}
                        />}
                        snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
                        decelerationRate="fast" // Make the scrolling feel snappier
                        contentContainerStyle={styles.container}
                        snapToAlignment="center" // Snap to the start of the card
                        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
                    />
                )}

        </>
    );
};

/**
* FLATLIST ITEM
*/

const Item = ({ country, video_url, isPlaying, onPress }: any) => {
    const videoRef = useRef<any>(null);
    
    //AFTER 3rd PLAY REPEAT, PAUSE VIDEO
    const [threePlayPaused, setThreePlayPaused] = useState(false);
    const [repeatCount, setRepeatCount] = useState(0);

    const handleThreePlayRepeat = () => {
        setRepeatCount(prevCount => {
            if (prevCount < 2) {
                return prevCount + 1;
            } else {
                // Pause the video after 3th repeat
                if (videoRef.current) {
                    videoRef.current.seek(0);
                    videoRef.current.pause();
                    setThreePlayPaused(true);
                    fadeIn();
                }
                return prevCount;
            }
        });
    };

    //FADE IN 'WATCH NOW' ANIMATION
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    };

    //WHEN VIDEO IS IN VIEW AGAIN, RESET
    useEffect(() => {
        if (isPlaying) {
        setRepeatCount(0);
        setThreePlayPaused(false);
        fadeAnim.setValue(0); // Reset opacity to 0
        }
    }, [isPlaying]);
    
    return (
        <Pressable style={styles.card} onPress={onPress}>
        <Video
            ref={videoRef}
            source={{ uri: video_url }}
            resizeMode="cover"
            style={styles.video}
            repeat={true}
            volume={0}
            paused={!isPlaying || threePlayPaused}
            onEnd={handleThreePlayRepeat}
        />
        {/* WATCH THIS */}
        {threePlayPaused && (
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
            <Pressable className="bg-zinc-100/70 p-3 rounded-full flex-row" onPress={onPress}>
              <FontAwesome name="eye" size={24} color="black" />
              <Text className="text-black text-base ml-1">Watch this</Text>
            </Pressable>
          </Animated.View>
        )}
        <View className='flex-row justify-end p-2 '>
            <View className='bg-zinc-800/70 py-1 px-3 rounded-full'>
                <View className='mb-1 flex-row items-center gap-1'>
                    <FontAwesome name="location-arrow" size={14} color="white" />
                    <Text className='text-white text-base font-medium'>{country}</Text>
                </View>
            </View>
        </View>
    </Pressable>
    ); 
};

/**
* STYLES
*/
const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT
    },
    card: {
        backgroundColor: '#fff',
        width: CARD_WIDTH,
        marginLeft: MARGIN_LEFT,
        marginRight: MARGIN_RIGHT,
    },
    video: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
});