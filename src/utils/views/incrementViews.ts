"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const watched = async (video_id: any, user_id: any) => {
    const { data, error, count } = await supabase
      .from("3sec_views")
      .select('*', { count: 'exact' })
      .eq("video_id", video_id)
      .eq("user_id", user_id)

      console.log("count", count)

      return count !== null && count > 0;
  };

  export const insert_views = async (video_id: any, user_id: any) => {
    const { error } = await supabase
      .from("3sec_views")
      .insert({ video_id: video_id, user_id: user_id})

      if(error) console.log("error insert views", error);

      return error;
  };

export const increment_views = async (video_id: any, user_id: any) => {
    const { error } = await supabase.rpc("3sec_views_incr", { 
        p_video_id: video_id, 
        p_user_id: user_id });
    if(error) console.log("error increment_views", error);
};