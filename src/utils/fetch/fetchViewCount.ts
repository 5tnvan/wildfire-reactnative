"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchViewCount = async (video_id: any) => {
    console.log("video_id", video_id)
  const { data, error } = await supabase
    .from("3sec_views")
    .select("view_count")
    .eq("video_id", video_id)

  return data;
};