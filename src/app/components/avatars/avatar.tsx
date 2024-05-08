import { View, Image } from "react-native";
import { StyleSheet } from 'react-native';

type Props = {
  avatar_url: string;
  size: string;
  ring: boolean;
  };
  
  export function Avatar({ avatar_url, size, ring }: Props) {
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
      halo = 14;
    }

    return (
      <View className={`w-${halo} h-${halo} flex-row justify-center items-center rounded-full overflow-hidden bg-accent`}>
        <View className={`border-${border} w-${width} h-${height} border-white rounded-full`}>
        <Image
          source={{ uri: avatar_url }}
          className={`rounded-full bg-contain`}
          style={styles.image}
        />
        </View>
      </View>
    );
  }

  const styles = StyleSheet.create({
    image: {
      width: '100%',
      height: '100%',
    },
  });