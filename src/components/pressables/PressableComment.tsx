import { Pressable, TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import FormatNumber from '../FormatNumber';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PressableAnimated } from './PressableAnimated';


type Props = {
  amount: number;
  onPress: any;
};

export function PressableComment({ amount, onPress } : Props) {
  return (
    <TouchableOpacity
      className='flex-row items-center justify-evenly '
      onPress={() => {
        onPress();
      }}
    >
      <MaterialCommunityIcons name="message-reply-text-outline" size={26} color="white" />
      {amount > 0 && <Text className='font-medium text-base text-white ml-1'><FormatNumber number={amount} /></Text>}
    </TouchableOpacity>
  );
}