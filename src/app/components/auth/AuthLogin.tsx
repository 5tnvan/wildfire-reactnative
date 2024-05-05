import { supabase } from '@/src/lib/supabase'
import React, { useState } from 'react'
import { Alert, View, AppState, Pressable, Text, Button } from 'react-native'
import { Input } from 'react-native-elements'

export default function AuthLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  return (
    <View className='w-full'>
      <View>
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View>
        <Button title="Log In" disabled={loading} onPress={() => signInWithEmail()} />
          {/* <Pressable className='items-center justify-center p-3 rounded-full bg-accent' onPress={() => console.log("ya")}>
            <Text className='text-lg text-black font-semibold'>Log In</Text>
          </Pressable> */}
      </View>

    </View>
  )
}
