import { AppState, Image, ImageBackground } from 'react-native';
import AuthLogin from '../components/auth/AuthLogin';
import { Link } from 'expo-router';
import { Text, View } from "@/src/app/components/Themed";
import { LogoWildfireLit } from '../components/logos/LogoFireLit';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/src/lib/supabase';
import ProfilePage from '../(protected)/profile';

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
    const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

    return (
        <View className="flex-col px-4 grow">
            <View className='flex-col items-center mb-10'>
                {/* <Image
                    source={require('@/assets/images/adaptive-icon-sm.png')}
                    className='w-12 h-12'
                    width={12}
                    height={12}
                /><LogoWildfireLit /> */}
            </View>
            {session && session.user ? <ProfilePage key={session.user.id} session={session} /> : <AuthLogin />}
            <Link href="/(protected)/profile">Profile</Link>
        </View>
    )
}