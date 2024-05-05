import { View, Text, Image } from 'react-native';
import AuthLogin from '../components/auth/AuthLogin';

export default function IndexPage() {
  return (
    <View className="flex flex-col justify-center items-end px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/UQxp24htvsoAAAAi/pixel-gem.gif" }} width={80} height={80}/>
      <Text className="text-3xl text-primary">Home</Text>
    </View>
  );
}