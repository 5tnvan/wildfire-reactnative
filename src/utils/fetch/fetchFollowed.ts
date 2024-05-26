"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchFollowed = async (follower_id: any, following_id: any) => {
  const { data } = await supabase
    .from("followers")
    .select()
    .eq("follower_id", follower_id)
    .eq("following_id", following_id)

    if(data && data.length > 0) return true;
    else return false;
};
