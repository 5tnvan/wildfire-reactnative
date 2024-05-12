import { Pressable } from 'react-native';
import { Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import FormatNumber from '../FormatNumber';
import { Entypo } from '@expo/vector-icons';

type Props = {
  amount: number;
};

export function PressableShare({ amount } : Props) {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      <Entypo name="slideshare" size={24} color="white" />
      <Text className='font-medium text-base text-white ml-1'><FormatNumber number={amount} /></Text>
    </Pressable>
  );
}