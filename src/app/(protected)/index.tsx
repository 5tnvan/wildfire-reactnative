import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useAuthUserFollows } from '@/src/services/providers/AuthUserFollowsProvider';
import { useIsFocused } from '@react-navigation/native';
import StatCarousel from '@/src/components/carousel/StatCarousel';
import FollowingCarousel from '@/src/components/carousel/FollowingCarousel';
import Header from '../../components/feed/Header';
import Posts from '../../components/feed/Posts';

export default function IndexScreen() {
  const isFocused = useIsFocused();
  const headerHeightAnim = useRef(new Animated.Value(150)).current; // Initial value for header height

  //CONSUME PROVIDERS
  const { following, refetch: refetchFollows } = useAuthUserFollows();
  
  //STATES
  const [isScrolling, setIsScrolling] = useState(false);

  // HIDE WHEN SCROLL ANIMATION
  useEffect(() => {
    const targetHeight = isScrolling ? 0 : 150; // Collapsed and expanded height
    Animated.timing(headerHeightAnim, {
      toValue: targetHeight,
      duration: 300, // Duration of the animation
      useNativeDriver: false, // We're not using the native driver since height isn't a supported property
    }).start();
  }, [isScrolling]);

  // IS FOCUSED
  useEffect(() => {
    if (isFocused) {
      refetchFollows();
    }
  }, [isFocused]);

  return (
    <View className='flex-1'>
      {/* HEADER */}
      <Header />

      {/* STATS */}
      <View className=''>
        <FollowingCarousel data={following} />
        <Animated.View style={{ height: headerHeightAnim }}>
          <StatCarousel />
        </Animated.View>
      </View>

      {/* FEED */}
      <Posts setIsScrolling={setIsScrolling} following={following} />
    </View>
  );
}
