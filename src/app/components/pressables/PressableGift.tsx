import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export function PressableGift() {
  return (
    <Pressable
      className='flex-row items-center bg-zinc-300/30 py-1 px-2 rounded-2xl'
      onPress={() => {
        alert("skort");
      }}
    >
      <MaterialCommunityIcons name="gift-open-outline" size={18} color="white" />
      <Text className='font-light ml-1 text-white'>Gift</Text>
    </Pressable>
  );
}