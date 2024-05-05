import { Image, ImageBackground } from 'react-native';
import AuthLogin from '../components/auth/AuthLogin';
import { Link } from 'expo-router';
import { Text, View } from "@/src/app/components/Themed";
import { LogoWildfireLit } from '../components/logos/LogoFireLit';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/src/lib/supabase';
import ProfilePage from '../(tabs)/profile';

export default function LoginPage() {
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
                <Image
                    source={require('@/assets/images/adaptive-icon-sm.png')}
                    className='w-12 h-12'
                /><LogoWildfireLit />
            </View>
            {session && session.user ? <ProfilePage key={session.user.id} session={session} /> : <AuthLogin />}
            {/* <Link href="/(tabs)/profile">Profile</Link> */}
        </View>
    )
}