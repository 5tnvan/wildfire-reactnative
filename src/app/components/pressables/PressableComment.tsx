import { Pressable } from 'react-native';
import { Text } from 'react-native';
import FormatNumber from '../FormatNumber';
import { MaterialCommunityIcons } from '@expo/vector-icons';


type Props = {
  amount: number;
};

export function PressableComment({ amount } : Props) {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      <MaterialCommunityIcons name="comment-processing-outline" size={26} color="white" />
      <Text className='font-medium text-base text-white ml-1'><FormatNumber number={amount} /></Text>
    </Pressable>
  );
}