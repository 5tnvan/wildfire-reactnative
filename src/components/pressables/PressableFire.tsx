import { Pressable, TouchableOpacity } from 'react-native';
import { Text, Image } from 'react-native';
import FormatNumber from '../FormatNumber';
import { SimpleLineIcons } from '@expo/vector-icons';
import { PressableAnimated } from './PressableAnimated';

type Props = {
  amount: number;
  liked: any;
  onPress: any;
};

export function PressableFire({ amount, liked, onPress } : Props) {
  return (
    <TouchableOpacity
      className='flex-row items-center justify-evenly'
      onPress={() => {
        onPress()
      }}
    >
      <SimpleLineIcons name="fire" size={22} color={liked.liked || liked.temporaryLiked ? 'red' : 'white'} />
      {amount > 0 && <Text className='font-medium text-base text-white ml-1'><FormatNumber number={amount} /></Text>}
    </TouchableOpacity>
  );
}