import { Alert, AppState, Image, Pressable, useColorScheme } from 'react-native';
import { Text, View } from "@/src/app/components/Themed";
import { LogoWildfireLit } from '../components/logos/LogoFireLit';
import 'react-native-url-polyfill/auto'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase';
import { Input } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordShown, setPasswordShown] = useState(false);

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
  }
  return (
    <View className="flex-col px-4 grow">
      <View className='flex-col items-center mt-10 mb-10'>
        <Image
          source={require('@/assets/images/adaptive-icon-sm.png')}
          className='w-12 h-12'
          width={12}
          height={12}
        /><LogoWildfireLit />
      </View>
      <View className='w-full'>
        <View>
          <Input
            label="Email"
            leftIcon={{ type: 'font-awesome', name: 'envelope' }}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            autoCapitalize={'none'}
            className={`${colorScheme == 'dark' ? 'text-gray-200' : 'text-gray-800' }`}
          />
        </View>
        <View>
          <Input
            label="Password"
            leftIcon={{ type: 'font-awesome', name: 'lock' }}
            rightIcon={
              <Pressable onPress={() => setPasswordShown(!passwordShown)}>
                <Ionicons name={passwordShown ? 'eye' : 'eye-off'} size={24} color="grey" />
              </Pressable>
            }
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={!passwordShown}
            placeholder="Password"
            autoCapitalize={'none'}
            className={`${colorScheme == 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
          />
        </View>
        <View>
          <Pressable className={`items-center justify-center p-3 rounded-full ${colorScheme == 'dark' ? 'bg-secondary' : 'bg-neutral'}`} onPress={() => signInWithEmail()}>
            <Text className={`text-lg font-semibold ${colorScheme == 'dark' ? 'text-white' : 'text-black'}`}>Log In</Text>
          </Pressable>
        </View>

      </View>
    </View>
  )
}