import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { useAuthUserFollows } from '@/src/services/providers/AuthUserFollowsProvider';
import { useUserFeed } from '@/src/hooks/useUserFeed';
import { useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useIncomingTransactions } from '@/src/hooks/useIncomingTransactions';
import StatCarousel from '@/src/components/carousel/StatCarousel';
import FollowingCarousel from '@/src/components/carousel/FollowingCarousel';
import { useUserFollowingFeed } from '@/src/hooks/useUserFollowingFeed';
import Header from '../../components/igfeed/Header';
import Navigation from '../../components/igfeed/Navigation';
import Posts from '../../components/igfeed/Posts';
import Stories from '../../components/igfeed/Stories';

export default function IndexScreen() {
  const isFocused = useIsFocused(); // Get focused state

  /**
   * CONSUME PROVIDERS
   */
  const { profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();
  /**
   * FETCH DIRECTLY
   */
  const incomingRes = useIncomingTransactions(profile?.wallet_id);
  const { feed: userFeed, refetch: refetchUserFeed } = useUserFeed(profile?.id);

  /**
   * REFETCH PROVIDERS WHEN SCREEN IS IN FOCUS
   */
  useEffect(() => {
    if (isFocused) {
      console.log("refetching index feed")
      refetchUserFeed();
    }
  }, [isFocused]);

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* STAT */}
      <View className='mb-2'>
        {/* <FollowingCarousel data={following} />
        <StatCarousel /> */}
      </View>

      {/* FEED */}
      <Posts />
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black', // Ensures the background color allows for transparency
  },
});