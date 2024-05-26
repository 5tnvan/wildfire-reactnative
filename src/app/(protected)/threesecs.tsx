import { View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from '../../components/InfiniteScroll';

export default function SkortScreen() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View className="bg-red-300" style={{ width: windowWidth, height: windowHeight, }}>
      <InfiniteScroll />
    </View>
  );
}