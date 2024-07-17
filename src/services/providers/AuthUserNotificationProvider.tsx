import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';
import { fetchFollowersUnreadNotifications } from '@/src/utils/fetch/fetchFollowersNotifications';
import { fetchFiresUnreadNotifications } from '@/src/utils/fetch/fetchFiresNotifications';
import { fetchCommentsUnreadNotifications } from '@/src/utils/fetch/fetchCommentsNotifications';

type AuthUserNotificationContext = {
    isLoading: boolean | null;
    followersNotifications: any,
    firesNotifications: any,
    commentsNotifications: any,
    refetch: () => void;
};

const AuthUserNotificationContext = createContext<AuthUserNotificationContext>({
    isLoading: null,
    followersNotifications: null,
    firesNotifications: null,
    commentsNotifications: null,
    refetch: () => {},
});

export default function AuthUserNotificationProvider({ children }: PropsWithChildren) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [session, setSession] = useState<Session | null>(null);
    const [followersNotifications, setFollowersNotifications] = useState<any>();
    const [firesNotifications, setFiresNotifications] = useState<any>();
    const [commentsNotifications, setCommentsNotifications] = useState<any>();
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
            fetchFiresUnreadNotifications(session.user.id).then((data) => {
                setFiresNotifications(data);
            });
            fetchCommentsUnreadNotifications(session.user.id).then((data) => {
                setCommentsNotifications(data);
            });
            setIsLoading(false);
        }
    }, [session, triggerRefetch])

    /**
     * SUPABASE REALTIME CALL
     * Refetch when 
     * **/
    const handleFollowersChange = (payload: any) => {
        console.log("Followers notification change received!", payload);
        refetch();
    };
    const handleFiresChange = (payload: any) => {
        console.log("Fires notification change received!", payload);
        refetch();
    };
    const handleCommentsChange = (payload: any) => {
        console.log("Fires notification change received!", payload);
        refetch();
    };

    supabase
        .channel("test")
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${session?.user.id}` },
            handleFollowersChange,
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notifications_fires", filter: `user_id=eq.${session?.user.id}` },
            handleFiresChange,
        )
        .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "notifications_comments", filter: `user_id=eq.${session?.user.id}` },
            handleCommentsChange,
        )
        .subscribe();

    return (
        <AuthUserNotificationContext.Provider
            value={{
                isLoading,
                followersNotifications,
                firesNotifications,
                commentsNotifications,
                refetch
            }}
        >
            {children}
        </AuthUserNotificationContext.Provider>
    );
}

export const useAuthUserNotifications = () => useContext(AuthUserNotificationContext);