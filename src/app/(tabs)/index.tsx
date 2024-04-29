import { View, Text, Image } from 'react-native';
import AuthLogin from '../components/AuthLogin';

export default function LoginScreen() {
  return (
    <View className="flex flex-col justify-center items-end px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/ZZu2QC-efdUAAAAi/cute-cat-white.gif" }} width={80} height={80}/>
      <Text className="text-3xl">Welcome back</Text>
      <AuthLogin />
    </View>
  );
}