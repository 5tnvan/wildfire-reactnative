import { Pressable } from 'react-native';
import { Text, Image } from 'react-native';
import FormatNumber from '../FormatNumber';
import { SimpleLineIcons } from '@expo/vector-icons';

type Props = {
  amount: number;
};

export function PressableFire({ amount } : Props) {
  return (
    <Pressable
      className='flex-col items-center'
      onPress={() => {
        alert("fire");
      }}
    >
      {/* <Image
        source={require('@/assets/images/fire-icon-36-36.png')}
        width={100}
        height={100}
      /> */}
      <SimpleLineIcons name="fire" size={24} color="white" />
      <Text className='font-medium text-base text-white ml-1'><FormatNumber number={amount} /></Text>
    </Pressable>
  );
}