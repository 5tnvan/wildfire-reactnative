import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { fetchFollowersUnreadNotifications } from '@/src/utils/fetch/fetchFollowersNotifications';

type AuthUserNotificationContext = {
    isLoading: boolean | null;
    followersNotifications: any,
    refetch: () => void;
};

const AuthUserNotificationContext = createContext<AuthUserNotificationContext>({
    isLoading: null,
    followersNotifications: null,
    refetch: () => {},
});

export default function AuthUserNotificationProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [followersNotifications, setFollowersNotifications] = useState<any>();
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
     * Get authenticated user's notifications
     * **/
    useEffect(() => {
        if (session) {
            setIsLoading(true);
            fetchFollowersUnreadNotifications(session.user.id).then((data) => {
                setFollowersNotifications(data);
            });
            setIsLoading(false);
        }
    }, [session, triggerRefetch])

    /**
     * SUPABASE REALTIME CALL
     * Refetch when 
     * **/
    const handleChange = (payload: any) => {
        console.log("Notification change received!", payload);
        refetch();
    };

    supabase
        .channel("test")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${session?.user.id}` },
            handleChange,
        )
        .subscribe();

    return (
        <AuthUserNotificationContext.Provider
            value={{
                isLoading,
                followersNotifications,
                refetch
            }}
        >
            {children}
        </AuthUserNotificationContext.Provider>
    );
}

export const useAuthUserNotifications = () => useContext(AuthUserNotificationContext);