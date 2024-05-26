import { Image, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { SafeAreaView } from 'react-native-safe-area-context';
import DiscoverCarousel from '@/src/components/carousel/DiscoverCarousel';
import FeedCarouselByTime from '@/src/components/carousel/FeedCarouselByTime';
import FeedCarouselByCountry from '@/src/components/carousel/FeedCarouselByCountry';
import { useState } from 'react';
import { SearchUserModal } from '@/src/components/modals/SearchUserModal';
import { FontAwesome5 } from '@expo/vector-icons';
import { PressableAnimated } from '@/src/components/pressables/PressableAnimated';

export default function DiscoverScreen() {
  const [selectedItemId, setSelectedItemId] = useState('1');
  const [searchUserModalVisible, setSearchUserModalVisible] = useState(false); //follows modal

  const handlePress = (id: any) => {
    setSelectedItemId(id);
  }

  const renderSelectedCarousel = () => {
    switch (selectedItemId) {
      case '1':
        return <FeedCarouselByTime />;
      // case '2':
      //   return null;
      case '2':
        return <FeedCarouselByCountry />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="">
      {/* HEADER */}
      <View className='flex-row justify-between items-center'>
        <Text className='text-2xl px-3 py-5 font-semibold'>Discover</Text>
        <PressableAnimated className='pr-4' onPress={() => setSearchUserModalVisible(true)}><FontAwesome5 name="search" size={24} color="white" /></PressableAnimated>
      </View>
      {/* SEARCH */}
      <SearchUserModal visible={searchUserModalVisible} onClose={() => setSearchUserModalVisible(false)} />
      <View className='mb-4'><DiscoverCarousel handlePress={handlePress} /></View>
      {renderSelectedCarousel()}
    </SafeAreaView>
  );
}