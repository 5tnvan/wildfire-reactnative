import { View, Image, Text } from "react-native";
import { StyleSheet } from 'react-native';

type Props = {
  avatar_url: any;
  username: string;
  size: string;
  ring: boolean;
};

export function Avatar({ avatar_url, username, size, ring }: Props) {
  let width1 = 0;
  let height1 = 0;

  if (size == "sm") {
    width1 = 30;
    height1 = 30;
  }

  if (size == "md") {
    width1 = 40;
    height1 = 40;
  }

  if (size == "lg") {
    width1 = 50;
    height1 = 50;
  }

  return (
    <>
      {avatar_url && 
      <View className={`rounded-full ${ring ? 'border-2 border-accent' : ''}`} style = {{ width: width1, height: height1}}>
      <Image
        source={{ uri: avatar_url }}
        className={`rounded-full bg-contain w-full h-full`}
      />
    </View>}
      {!avatar_url && 
      <View className={`rounded-full ${ring ? 'border-2 border-accent' : ''} items-center justify-center bg-slate-300`} style = {{ width: width1, height: height1}}>
      <Text className="font-semibold text-lg text-secondary">{username?.charAt(0).toUpperCase()}</Text>
    </View>}
    </>
  );
}

const styles = StyleSheet.create({
});