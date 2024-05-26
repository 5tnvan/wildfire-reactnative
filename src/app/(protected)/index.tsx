import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuthUserFollows } from '@/src/services/providers/AuthUserFollowsProvider';
import { useIsFocused } from '@react-navigation/native';
import StatCarousel from '@/src/components/carousel/StatCarousel';
import FollowingCarousel from '@/src/components/carousel/FollowingCarousel';
import Header from '../../components/feed/Header';
import Posts from '../../components/feed/Posts';

export default function IndexScreen() {
  const isFocused = useIsFocused();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();
  const [isScrolling, setIsScrolling] = useState(false);

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* STAT */}
      
        <View className='mb-2'>
          <FollowingCarousel data={following} />
          {!isScrolling && (
          <StatCarousel />)}
        </View>
      

      {/* FEED */}
      <Posts setIsScrolling={setIsScrolling} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
});
