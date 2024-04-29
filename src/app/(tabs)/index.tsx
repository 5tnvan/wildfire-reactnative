import { View, Text, Image } from 'react-native';

import EditScreenInfo from '@/src/app/components/EditScreenInfo';

export default function TabOneScreen() {
  return (
    <View className="flex flex-col justify-center items-center px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/ZZu2QC-efdUAAAAi/cute-cat-white.gif" }} width={80} height={80}/>
      <Text className="text-3xl">Welcome back</Text>
      <Text className="text-3xl">Email:</Text>
      <Text className="text-3xl">Password:</Text>
      <Text className="text-3xl">Login Button</Text>
    </View>
  );
}