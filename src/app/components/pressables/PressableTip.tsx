import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export function PressableTip() {
  return (
    <Pressable
      className='flex-row items-center bg-zinc-800/70 py-1 px-2 rounded-2xl border border-zinc-800'
      onPress={() => {
        alert("skort");
      }}
    >
      <FontAwesome5 name="bitcoin" size={18} color="white" />
      <Text className='font-semibold ml-1 text-white'>Tip Now</Text>
    </Pressable>
  );
}