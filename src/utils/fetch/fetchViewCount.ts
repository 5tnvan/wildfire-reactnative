"use server";

import { supabase } from "@/src/lib/supabase";


/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

//archived

export const fetchViewCount = async (video_id: any) => {
  const { data, error } = await supabase
    .from("3sec_views")
    .select("view_count")
    .eq("video_id", video_id)
    .single()

  return data;
};



/**
 * FETCH: fetchViewCount()
 * DB: supabase
 * TABLE: "3sec_views_archived"
 **/

//archived

export const fetchViewCount_archived = async (video_id: any) => {
  const { data, error } = await supabase
    .from("3sec_views")
    .select("view_count")
    .eq("video_id", video_id)

  return data;
};