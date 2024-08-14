import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin'
  import { supabase } from "@/src/lib/supabase";
import { View, StyleSheet, Pressable, useColorScheme, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
  
  export default function AuthGoogle() {
    const colorScheme = useColorScheme();
    GoogleSignin.configure({
      webClientId: '514020308684-149pm13ne6cuic0e2ugu229cl49k9sti.apps.googleusercontent.com',
      iosClientId: '514020308684-p68k4vrf3icd59bs316o81lpeq3su2dv.apps.googleusercontent.com'
    })
  
    return (
      <View className='flex items-center justify-center rounded-3xl mb-1 bg-white border'>
      <Pressable
      className='flex-row items-center justify-center gap-1 mt-2 mb-3 ml-2 mr-3'
        onPress={async () => {
          try {
            await GoogleSignin.hasPlayServices()
            const userInfo = await GoogleSignin.signIn()
            if (userInfo.idToken) {
                console.log(JSON.stringify(userInfo, null, 2));
                const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: userInfo.idToken,
              })
              console.log(error, data)
            } else {
              throw new Error('no ID token present!')
            }
          } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
              // user cancelled the login flow
            } else if (error.code === statusCodes.IN_PROGRESS) {
              // operation (e.g. sign in) is in progress already
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
              // play services not available or outdated
            } else {
              // some other error happened
            }
          }
        }}
      ><AntDesign name="google" size={14} color={`${colorScheme == 'dark' ? 'black' : 'black'}`} /><Text className="font-medium color-black" style={{ fontSize: 19 }}>Sign in with Google</Text></Pressable>
      </View>
    )
  }