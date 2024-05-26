import { Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';

export const fetchProfile = async (userId: string) => {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select("*, levels(id, level, created_at)")
            .eq('id', userId)
            .single()
        if (error && status !== 406) throw error
        return data;
    } catch (error) {
        if (error instanceof Error) Alert.alert(error.message)
        return null;
    }
};

export const fetchProfileMatchingWith = async (username: string) => {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, avatar_url")
    .ilike("username", `${username}%`);
  return data;
};
