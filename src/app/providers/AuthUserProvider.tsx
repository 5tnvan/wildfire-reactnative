import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { Alert } from 'react-native';

type AuthUserContext = {
    isLoading: boolean | null;
    profile: any;
    followers: any;
    following: any;
};

const AuthUserContext = createContext<AuthUserContext>({
    isLoading: null,
    profile: null,
    followers: null,
    following: null,
});

export default function AuthUserProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>();
    const [followers, setFollowers] = useState<any>();
    const [following, setFollowing] = useState<any>();

    const getFollowers = async () => {
        try {
            setIsLoading(true)
            const { data: followers } = await supabase
                .from("followers")
                .select("follower:follower_id(id, username, avatar_url, profile_bios(id))")
                .eq("following_id", session?.user.id)
                .order('created_at', { ascending: false })
                if (followers) setFollowers(followers);
        } catch (error) {
            if (error instanceof Error) Alert.alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }
    const getFollowing = async () => {
        try {
            setIsLoading(true)
            const { data: following } = await supabase
                .from("followers")
                .select("following:following_id(id, username, avatar_url, wallet_id, profile_bios(id)))")
                .eq("follower_id", session?.user.id)
                .order('created_at', { ascending: false })
                if (following) setFollowing(following);
        } catch (error) {
            if (error instanceof Error) Alert.alert(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    const getProfile = async () => {
        try {
            setIsLoading(true)
            const { data, error, status } = await supabase
                .from('profiles')
                .select()
                .eq('id', session?.user.id)
                .single()
            if (error && status !== 406) throw error
            if (data) setProfile(data);
        } catch (error) {
            if (error instanceof Error) Alert.alert(error.message)
        } finally {
            setIsLoading(false)
        }
    };

    /**
     * SUPABASE CALL
     * Get user's session
     * **/
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])

    /**
     * SUPABASE CALL
     * Get authenticated user's profile
     * **/
    useEffect(() => {
        if (session) {
            getProfile();
            getFollowers();
            getFollowing();
        }
    }, [session])

    return (
        <AuthUserContext.Provider
            value={{
                isLoading,
                profile,
                followers,
                following
            }}
        >
            {children}
        </AuthUserContext.Provider>
    );
}

export const useAuthUser = () => useContext(AuthUserContext);