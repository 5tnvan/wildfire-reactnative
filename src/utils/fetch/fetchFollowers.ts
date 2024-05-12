"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchFollowers = async (user_id: any) => {
  const { data: followers } = await supabase
    .from("followers")
    .select("follower:follower_id(id, username, avatar_url, profile_bios(id))")
    .eq("following_id", user_id)
    .order("created_at", { ascending: false });

    return followers;
};
