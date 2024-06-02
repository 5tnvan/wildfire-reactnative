"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const increment_views = async (video_id: any) => {
  console.log("incremented views");
  const { error } = await supabase.rpc("3sec_views_increment", {
    p_video_id: video_id,
  });
  if (error) console.log("error increment_views", error);
};