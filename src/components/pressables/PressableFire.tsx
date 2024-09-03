import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import FormatNumber from '../FormatNumber';
import { FontAwesome5 } from '@expo/vector-icons';

type Props = {
  amount: number;
  liked: any;
  onPress: any;
};

export function PressableFire({ amount, liked, onPress } : Props) {
  return (
    <TouchableOpacity
      className='flex-row items-center justify-center'
      onPress={() => {
        onPress()
      }}
    >
      <FontAwesome5 name="fire" size={22} color={liked.liked || liked.temporaryLiked ? 'red' : 'white'} />
      {amount > 0 && <Text className='font-medium text-base text-white ml-2'><FormatNumber number={amount} /></Text>}
    </TouchableOpacity>
  );
}