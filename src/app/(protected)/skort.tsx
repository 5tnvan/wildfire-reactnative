import { View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import SkortComponent from '../../components/SkortComponent';
import { useFeed } from '@/src/hooks/useFeed';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function SkortScreen() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const isFocused = useIsFocused(); // Get focused state

  const [videos2, setVideos2] = useState<any[]>([]);
  const { isLoading, feed, refetch } = useFeed();

  // Call refetch function every time the screen is focused
  useEffect(() => {
    if (isFocused) {
      console.log("refetching skorts")
      refetch();
    }
  }, [isFocused]);

  return (
    <View className="bg-red-300" style={{ width: windowWidth, height: windowHeight, }}>
      <SkortComponent data={feed} />
    </View>
  );
}