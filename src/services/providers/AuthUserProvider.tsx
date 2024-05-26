import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { Alert } from 'react-native';
import { fetchFollowers } from '@/src/utils/fetch/fetchFollowers';
import { fetchFollowing } from '@/src/utils/fetch/fetchFollowing';
import { fetchProfile } from '@/src/utils/fetch/fetchProfile';

type AuthUserContext = {
    isLoading: boolean | null;
    profile: any;
};

const AuthUserContext = createContext<AuthUserContext>({
    isLoading: null,
    profile: null,
});

export default function AuthUserProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [profile, setProfile] = useState<any>();

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
            setIsLoading(true);
            fetchProfile(session.user.id).then((data) => {
                setProfile(data);
            });
            setIsLoading(false);
        }
    }, [session])

    return (
        <AuthUserContext.Provider
            value={{
                isLoading,
                profile
            }}
        >
            {children}
        </AuthUserContext.Provider>
    );
}

export const useAuthUser = () => useContext(AuthUserContext);