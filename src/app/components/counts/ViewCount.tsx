import { View } from 'react-native';
import { Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import FormatNumber from '../FormatNumber';

type Props = {
  amount: number;
};

export function ViewCount({ amount } : Props) {
  return (
    <View
      className='flex-row items-center'
    >
      <Ionicons name="eye" size={24} color="white" />
      <Text className='font-light text-lg text-white ml-1'><FormatNumber number={amount} /></Text>
    </View>
  );
}