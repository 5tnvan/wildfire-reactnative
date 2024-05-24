import { Image, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { SafeAreaView } from 'react-native-safe-area-context';
import DiscoverCarousel from '@/src/components/carousel/DiscoverCarousel';
import FeedCarouselByTime from '@/src/components/carousel/FeedCarouselByTime';
import FeedCarouselByCountry from '@/src/components/carousel/FeedCarouselByCountry';
import { useState } from 'react';

export default function DiscoverScreen() {
  const [selectedItemId, setSelectedItemId] = useState('3');

  const handlePress = (id: any) => {
    setSelectedItemId(id);
  }

  const renderSelectedCarousel = () => {
    switch (selectedItemId) {
      case '1':
        return <FeedCarouselByTime />;
      case '3':
        return <FeedCarouselByCountry />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="">
      <Text className='text-2xl px-3 py-5 font-semibold'>What are you in the mood for?</Text>
      <View className='mb-4'><DiscoverCarousel handlePress={handlePress} /></View>
      {renderSelectedCarousel()}
    </SafeAreaView>
  );
}