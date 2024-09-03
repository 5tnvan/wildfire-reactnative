import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export function PressableTip({ onPress } : any) {
  return (
    <Pressable
      className='flex-row items-center justify-evenly'
      onPress={() => {
        onPress()
      }}
    >
      {/* <FontAwesome5 name="ethereum" size={18} color="white" /> */}
      <Text className='font-semibold ml-1 text-base text-white'>Tip Now</Text>
    </Pressable>
  );
}