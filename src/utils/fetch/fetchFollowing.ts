"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowing()
 * DB: supabase
 * TABLE: "following"
 **/

export const fetchFollowing = async (user_id: any) => {
    const { data: following } = await supabase
    .from("followers")
    .select("following:following_id(id, username, avatar_url, wallet_id, profile_bios(id)))")
    .eq("follower_id", user_id)
    .order('created_at', { ascending: false })

    return following;

};