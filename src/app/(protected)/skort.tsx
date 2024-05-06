import { View, Dimensions } from 'react-native';
import React from 'react';
import SkortComponent from '../components/SkortComponent';

export default function SkortScreen() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View className="bg-red-300" style={{ width: windowWidth, height: windowHeight, }}>
       <SkortComponent />
    </View>
  );
}