import { View, Text, Image, ImageBackground, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthLogin from '../components/AuthLogin';
import React from 'react';
import { Button, Input } from 'react-native-elements'
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import SkortScreen from '../components/Skort';

export default function SkortPage() {
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
   
    <View className="bg-red-300" style={{ width: windowWidth, height: windowHeight, }}>
       <SkortScreen />
    </View>
  );
}