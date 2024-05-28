import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { fetchFollowers } from '@/src/utils/fetch/fetchFollowers';
import { fetchFollowing } from '@/src/utils/fetch/fetchFollowing';

type AuthUserFollowsContext = {
    isLoading: boolean | null;
    followers: any;
    following: any;
    refetch: () => void;
};

const AuthUserFollowsContext = createContext<AuthUserFollowsContext>({
    isLoading: null,
    followers: null,
    following: null,
    refetch: () => {},
});

export default function AuthUserFollowsProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [followers, setFollowers] = useState<any>();
    const [following, setFollowing] = useState<any>();
    const [triggerRefetch, setTriggerRefetch] = useState(false);

    const refetch = () => {
        setTriggerRefetch((prev) => !prev);
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
            setIsLoading(true);
            fetchFollowers(session.user.id).then((res) => {
                setFollowers(res);
            });
            fetchFollowing(session.user.id).then((res) => {
                setFollowing(res);
            });
            setIsLoading(false);
        }
    }, [session, triggerRefetch])

    return (
        <AuthUserFollowsContext.Provider
            value={{
                isLoading,
                followers,
                following,
                refetch
            }}
        >
            {children}
        </AuthUserFollowsContext.Provider>
    );
}

export const useAuthUserFollows = () => useContext(AuthUserFollowsContext);