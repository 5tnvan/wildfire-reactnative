import { View, Dimensions } from 'react-native';
import React from 'react';
import SkortScreen from '../components/screens/SkortScreen';

export default function SkortPage() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View className="bg-red-300" style={{ width: windowWidth, height: windowHeight, }}>
       <SkortScreen />
    </View>
  );
}