import { View, Text, Image } from 'react-native';
import AuthLogin from '../components/auth/AuthLogin';
import { Link } from 'expo-router';

export default function IndexScreen() {
  return (
    <View className="flex flex-col justify-center items-end px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/UQxp24htvsoAAAAi/pixel-gem.gif" }} width={80} height={80}/>
      <Text className="text-3xl text-primary">Home</Text>
      <Link href="/(auth)">Tabs</Link>
    </View>
  );
}