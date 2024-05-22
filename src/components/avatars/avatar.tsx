import { View, Image, Text } from "react-native";
import { StyleSheet } from 'react-native';

type Props = {
  avatar_url: any;
  username: string;
  size: string;
  ring: boolean;
};

export function Avatar({ avatar_url, username, size, ring }: Props) {
  let width = 0;
  let height = 0;
  let border = 0;
  let halo = 0;

  if (size == "md") {
    width = 12;
    height = 12;
  }

  if (size == "md" && ring) {
    border = 2;
    halo = 12;
  }

  if (size == "lg") {
    width = 16;
    height = 16;
  }

  if (size == "lg" && ring) {
    border = 2;
    halo = 16;
  }

  return (
    <>
      {avatar_url && 
      <View className={`w-${halo} h-${halo} flex-row justify-center items-center rounded-full overflow-hidden border-accent border-4`}>
        <View className={`border-${border} w-${width} h-${height} border-white rounded-full`}>
          <Image
            source={{ uri: avatar_url }}
            className={`rounded-full bg-contain`}
            style={styles.image}
          />
        </View>
      </View>}
      {!avatar_url && 
      <View className={`w-${halo} h-${halo} flex-row justify-center items-center rounded-full overflow-hidden border-accent border-4`}>
        <View className={`border-${border} w-${width} h-${height} border-white rounded-full items-center justify-center bg-slate-300`}>
          <Text className="font-semibold text-lg text-secondary">{username.charAt(0).toUpperCase()}</Text>
        </View>
      </View>}
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
  },
});