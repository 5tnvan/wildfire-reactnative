import { supabase } from '@/src/lib/supabase';

/**
 * FETCH: isBlocked()
 * DB: supabase
 * TABLE: "user_block"
 * RETURN: { blocked }
 **/
export const checkIsBlocked = async (user_id: any, blocked_id: any) => {
    const { data: blocked } = await supabase
        .from("user_block")
        .select()
        .eq("user_id", user_id)
        .eq("blocked_id", blocked_id)
        .single();
    if (blocked) return blocked;
};