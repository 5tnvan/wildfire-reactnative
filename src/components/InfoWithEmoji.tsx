import { Pressable, useColorScheme } from 'react-native';
import { View } from 'react-native';
import { Text } from '../components/Themed';
type Props = {
  emoji?: string;
  text: string;
};

export function InfoWithEmoji({ emoji, text }: Props) {
    const colorScheme = useColorScheme();
  return (
    <View className={`${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} flex-row items-center justify-center rounded-full py-3`}>
        <Text className='text-base'>{emoji}</Text>
        <Text className='text-base'>{text}</Text>
    </View>
  );
}