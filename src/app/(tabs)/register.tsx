import { View,Text, Image } from 'react-native';
import AuthRegister from '../components/AuthRegister';

export default function RegisterScreen() {
  return (
    <View className="flex flex-col justify-center px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/t9ppolkZgqUAAAAi/chubby-cute.gif" }} width={80} height={80}/>
      <Text className="text-3xl text-primary">Create an account</Text>
      <AuthRegister />
    </View>
  );
}