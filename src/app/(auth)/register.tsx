import { View, Text, Image, ImageBackground, StyleSheet } from 'react-native';
import AuthRegister from '../components/auth/AuthRegister';

export default function RegisterScreen() {
  return (
    <View className="flex flex-col justify-center px-4 grow">

      {/* Create a wildpay account */}
      <View className='flex flex-row items-center justify-center mb-5'>
        <Text className="text-lg text-black dark:text-white mr-2 font-bold">Create a</Text>
        <Image
          source={require('@/assets/images/wildpay-logo.png')}
          className='w-5 h-5 mr-1'
        />
        <Text className='text-indigo-600 text-lg font-bold mr-2'>wildpay</Text>
        <Text className="text-lg text-black dark:text-white font-bold">account</Text>
      </View>

      {/* Card */}
      <View style={styles.imageContainer} className='mb-10'>
        <ImageBackground
          source={require('@/assets/images/wildpay-card.png')}
          style={styles.imageBackground}
        >
          <Text className="text-3xl font-extrabold">username</Text>
        </ImageBackground>
      </View>

      {/* Card */}
      <AuthRegister />
    </View>
  );
}
const styles = StyleSheet.create({
  imageContainer: {
    width: '100%', // Set width to 400px
    aspectRatio: 315 / 200, // Maintain aspect ratio (width / height)
  },
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});