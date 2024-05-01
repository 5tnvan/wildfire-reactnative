import { View, Text, Image } from 'react-native';
import AuthLogin from '../components/AuthLogin';

export default function ProfilePage() {
  return (
    <View className="flex flex-col justify-center items-end px-4 grow">
      <Image source={{ uri: "https://media.tenor.com/8HaTOA3o0OoAAAAi/pixel-cat.gif" }} width={80} height={80}/>
      <Text className="text-3xl text-primary">Profile</Text>
    </View>
  );
}