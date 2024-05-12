import { Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';

const fetchProfile = async (userId: string) => {
    try {
        const { data, error, status } = await supabase
            .from('profiles')
            .select()
            .eq('id', userId)
            .single()
        if (error && status !== 406) throw error
        return data;
    } catch (error) {
        if (error instanceof Error) Alert.alert(error.message)
        return null;
    }
};

export default fetchProfile;
