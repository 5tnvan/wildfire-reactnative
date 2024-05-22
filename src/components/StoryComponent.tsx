import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  Animated,
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  cross,
  logo,
  mute,
  pause,
  play,
  unmute,
} from '../utils/exportedFunction';
import Video from 'react-native-video';

type Props = {
    data: any;
    onFinishStory: () => void;
};

const {width} = Dimensions.get('window');

export default function StoryComponent({ data, onFinishStory} : Props) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const currentStory = data[currentStoryIndex];
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pausedProgress = useRef(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [wentBack, setWentBack] = useState(0);

  const renderStoryContent = (story: any) => {
    return (
        <Video
          source={{uri: story.video_url}}
          resizeMode="cover"
          style={styles.backgroundImage}
          paused={isPaused}
          muted={isMuted}
        />
      );
  };

  const runProgressAnimation = () => {
    // this will run the animations at the top for the story
    progressAnim.setValue(pausedProgress.current); //set the value of the progress of the story
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: (1 - pausedProgress.current) * 3000, //for how long each story currently 3 seconds
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        goToNextStory(); //once finished goes to nextStory()
      }
    });
  };

  const getProgressBarWidth = (storyIndex: number, currentIndex: number) => {
    if (currentIndex > storyIndex) {
      return '100%';
    } // this is when the Story has been viewed
    if (currentIndex === storyIndex) {
      return progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'], // this is when the story is being viewed
      });
    }
    return '0%'; // this is when the Story has not been viewed yet
  };

  const goToPreviousStory = () => {
    if (isPaused) {
      setIsPaused(false);
    }
    pausedProgress.current = 0;
    progressAnim.setValue(0);
    if (currentStoryIndex === 0) {
      setWentBack(wentBack + 1);
      runProgressAnimation();
    } else {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const goToNextStory = () => {
    if (currentStoryIndex < data.length - 1) {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 3,
        useNativeDriver: false,
      }).start(() => {
        pausedProgress.current = 0;
        setCurrentStoryIndex(currentStoryIndex + 1);
        progressAnim.setValue(0);
      });
    } else {
      setWentBack(0);
      onFinishStory();
      setCurrentStoryIndex(0);
    }
  };

  const handlePressIn = () => {
    setIsPaused(true);
  };

  const handlePressOut = () => {
    setIsPaused(false);
  };

  const handleScreenTouch = (evt: GestureResponderEvent) => {
    //this function takes the width and decided where the click was pressed if left or right
    const touchX = evt.nativeEvent.locationX;
    if (touchX < width / 2) {
      goToPreviousStory();
    } else {
      goToNextStory();
    }
  };

  const pausePlay = () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const muteAndUnMute = () => {
    if (isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  useEffect(() => {
    if (!isPaused) {
      runProgressAnimation();
    } else {
      progressAnim.stopAnimation(value => {
        pausedProgress.current = value;
      });
    }
  }, [currentStoryIndex, isPaused]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Pressable
        onPress={handleScreenTouch}
        onLongPress={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.container}>
        <View style={styles.container}>
          {renderStoryContent(currentStory)}
          <SafeAreaView>
            <View style={styles.progressBarContainer}>
              {data.map((story:any, index:any) => (
                <View key={index} style={styles.progressBarBackground}>
                  <Animated.View
                    style={[
                      styles.progressBar,
                      {
                        width: getProgressBarWidth(index, currentStoryIndex),
                      },
                    ]}
                  />
                </View>
              ))}
            </View>
            <View style={styles.topBar}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => muteAndUnMute()}>
                <Image source={isMuted ? mute : unmute} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pausePlay()}>
                <Image source={isPaused ? play : pause} style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onFinishStory()}>
                <Image source={cross} style={styles.icon} />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    backgroundImage: {
      width: '100%',
      height: '100%',
      position: 'absolute',
      resizeMode: 'cover',
      borderRadius: 18,
    },
    safeArea: {
      flex: 1,
      backgroundColor: '#000',
    },
    progressBarContainer: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      paddingTop: 10,
      justifyContent: 'center',
      height: 3,
      backgroundColor: 'transparent',
    },
    progressBarBackground: {
      flex: 1,
      height: 3,
      backgroundColor: 'rgba(255,255,255,0.5)',
      marginHorizontal: 2,
    },
    progressBar: {
      height: 3,
      backgroundColor: 'white',
    },
    topBar: {
      position: 'absolute',
      left: 15,
      top: 18,
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
    },
    icon: {
      width: 25,
      height: 25,
      marginLeft: 10,
    },
    buttonContainer: {
      position: 'absolute',
      right: 10,
      top: 25,
      alignItems: 'center',
      flexDirection: 'row',
    },
  });