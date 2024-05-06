import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/src/lib/supabase';

type AuthContext = {
    session: Session | null;
    user: User | null;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContext>({
    session: null,
    user: null,
    isAuthenticated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
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
        <AuthContext.Provider
            value={{
                session,
                user: session?.user || null,
                isAuthenticated: !!session?.user && !session.user.is_anonymous,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);