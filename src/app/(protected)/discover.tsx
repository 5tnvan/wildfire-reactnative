import { View, Text, Image } from 'react-native';
import AuthLogin from '../../components/auth/AuthLogin';

export default function DiscoverScreen() {
  return (
    <View className="flex flex-col justify-center items-end px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/FOwSn0xEGcYAAAAi/char.gif" }} width={80} height={80}/>
      <Text className="text-3xl text-primary">Discover</Text>
    </View>
  );
}