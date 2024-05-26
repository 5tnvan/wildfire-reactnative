import { View, StyleSheet } from 'react-native';
import { useAuthUserFollows } from '@/src/services/providers/AuthUserFollowsProvider';
import { useIsFocused } from '@react-navigation/native';
import StatCarousel from '@/src/components/carousel/StatCarousel';
import FollowingCarousel from '@/src/components/carousel/FollowingCarousel';
import Header from '../../components/feed/Header';
import Posts from '../../components/feed/Posts';

export default function IndexScreen() {
  const isFocused = useIsFocused();

  //CONSUME PROVIDERS
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();

  return (
    <>
      {/* HEADER */}
      <Header />

      {/* STAT */}
      <View className='mb-2'>
        <FollowingCarousel data={following} />
        <StatCarousel />
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