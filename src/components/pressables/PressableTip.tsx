import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export function PressableTip() {
  return (
    <Pressable
      className='flex-row items-center'
      onPress={() => {
        alert("skort");
      }}
    >
      <FontAwesome5 name="bitcoin" size={18} color="white" />
      <Text className='font-semibold ml-1 text-white'>Tip Now</Text>
    </Pressable>
  );
}