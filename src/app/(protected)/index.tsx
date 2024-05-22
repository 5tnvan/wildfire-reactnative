import { View, Text, Image } from 'react-native';
import { Link } from 'expo-router';
import HorizontalScrollCards from '@/src/components/HorizontalScrollCards';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { useAuthUserFollows } from '@/src/services/providers/AuthUserFollowsProvider';
import FollowingScroll from '@/src/components/FollowingScroll';

export default function IndexScreen() {
  const { profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();

  return (
    <>
      <SafeAreaView className=''>
        <View className='mb-2'>
          <Text className='text-white text-2xl font-bold p-2'>Home</Text>
        </View>
        <View className='mb-2'>
          <HorizontalScrollCards data={profile} />
        </View>
      </SafeAreaView>
      <View className='absolute bottom-0'>
        <FollowingScroll data={following} />
      </View>
    </>

  );
}