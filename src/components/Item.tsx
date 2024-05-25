import { Image, Pressable, StyleSheet, TouchableHighlight, TouchableOpacity, View, useColorScheme } from 'react-native';
import React from 'react';
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { TimeAgo } from './TimeAgo';
import { Text } from "../components/Themed";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';

type Props = {
  item: any;
  width: number;
  height: number;
  marginHorizontal: number;
  fullWidth: number;
  x: SharedValue<number>;
  index: number;
  onPress: (index: number) => void;
};

const Item = ({
  item,
  width,
  height,
  marginHorizontal,
  fullWidth,
  x,
  index,
  onPress,
}: Props) => {
  const animatedStyle = useAnimatedStyle(() => {
    const rotateZ = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [20, 0, -20],
      Extrapolation.CLAMP,
    );
    const translateY = interpolate(
      x.value,
      [(index - 1) * fullWidth, index * fullWidth, (index + 1) * fullWidth],
      [60, 0, 60],
      Extrapolation.CLAMP,
    );
    return {
      transform: [{ rotateZ: `${rotateZ}deg` }, { translateY: translateY }],
    };
  });

  const colorScheme = useColorScheme();

  return (
    <Pressable onPress={() => onPress(index)}>
      <Animated.View
        style={[
          { width: width, height: height, marginHorizontal: marginHorizontal, transformOrigin: 'bottom' },
          animatedStyle,
        ]}
        className={`${colorScheme == "dark" ? 'bg-zinc-900' : 'bg-neutral'} rounded-3xl overflow-hidden`}>
        {/* VIDEO THUMBNAIL */}
        <View className='flex-1'>
          <Image
            source={{ uri: item.thumbnail_url }}
            style={{ width: width }}
            resizeMode="cover"
            className='flex-1'
          />
        </View>
        {/* BOTTOM */}
        <View className='absolute bottom-0 w-full bg-zinc-100 flex-row justify-between items-center px-4 py-2'>
          <View>
            {item.country && <Text className='text-black font-semibold'>{item.country?.name}</Text>}
            <Text className='text-black'><TimeAgo timestamp={item.created_at}></TimeAgo> ago</Text>
          </View>
          <View><Image source={require('../../assets/images/wildfire-logo-lit.png')} resizeMode="contain" className='w-12' /></View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default Item;