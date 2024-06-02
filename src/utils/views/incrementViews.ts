"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/
//archived
export const watched_archived = async (video_id: any, user_id: any) => {
  const { data, error, count } = await supabase
    .from("3sec_views")
    .select("*", { count: "exact" })
    .eq("video_id", video_id)
    .eq("user_id", user_id);

  console.log("watched", count !== null && count > 0);

  return count !== null && count > 0;
};
//archived
export const insert_views_archived = async (video_id: any, user_id: any) => {
  console.log("inserted new view row", video_id, user_id);
  const { error } = await supabase
    .from("3sec_views")
    .insert({ video_id: video_id, user_id: user_id });

  if (error) {
    console.log("error insert views", error);
  }

  return error;
};
//archived
export const increment_views_archived = async (video_id: any, user_id: any) => {
  console.log("incremented views");
  const { error } = await supabase.rpc("3sec_views_incr", {
    p_video_id: video_id,
    p_user_id: user_id,
  });
  if (error) console.log("error increment_views", error);
};


export const increment_views = async (video_id: any) => {
  console.log("incremented views");
  const { error } = await supabase.rpc("3sec_views_increment", {
    p_video_id: video_id,
  });
  if (error) console.log("error increment_views", error);
};