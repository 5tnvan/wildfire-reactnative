import { Alert } from 'react-native';
import { supabase } from '@/src/lib/supabase';

/**
 * FETCH: fetchUser()
 * DB: supabase
 * TABLE: "auth.user"
 * RETURN: { userData }
 **/
export const fetchUser = async () => {
    const { data: user } = await supabase.auth.getUser();
    return user;
};