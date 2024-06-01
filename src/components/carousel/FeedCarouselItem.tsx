import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, Modal, Animated } from 'react-native';
import Video from 'react-native-video';
import { FontAwesome } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width * 0.8;
const MARGIN_LEFT = 0;
const MARGIN_RIGHT = 4;


const Item = ({ time, video_url, isPlaying, onPress }: any) => {

    //console.log("rendering", isPlaying, video_url );

    const videoRef = useRef<any>(null);
    
    //AFTER 3rd PLAY REPEAT, PAUSE VIDEO
    const [threePlayPaused, setThreePlayPaused] = useState(false);
    const repeatCountRef = useRef(0);

    const handleThreePlayRepeat = () => {
        if (repeatCountRef.current < 2) {
            repeatCountRef.current += 1;
        } else {
            // Pause the video after 3rd repeat
            if (videoRef.current) {
                videoRef.current.seek(0);
                videoRef.current.pause();
                setThreePlayPaused(true);
                fadeIn();
            }
        }
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
        repeatCountRef.current = 0;
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
                <Text className='text-base text-white font-medium mb-1'>{time}</Text>
            </View>
        </View>
    </Pressable>
     );
}

export default memo(Item, (prevProps, nextProps) => { return prevProps.isPlaying === nextProps.isPlaying; });

const styles = StyleSheet.create({
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