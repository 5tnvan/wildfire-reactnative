"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowersUnreadNotifications()
 * DB: supabase
 * TABLE: notifications
 * RETURN: { data }
 **/

export const fetchFollowersUnreadNotifications = async (user_id: any) => {
  const { data } = await supabase
    .from("notifications")
    .select("id, user_id, follower_id, follower_read, follower_created_at, follower:follower_id(username, avatar_url)")
    .eq("user_id", user_id)
    .eq("follower_read", false)
    .order("follower_created_at", { ascending: false });
  return data;
};

/**
 * FETCH: fetchFollowersReadNotifications()
 * DB: supabase
 * TABLE: notifications
 * RETURN: { data }
 **/

export const fetchFollowersReadNotifications = async (user_id: any) => {
  const { data } = await supabase
    .from("notifications")
    .select("id, user_id, follower_id, follower_read, follower_created_at, follower:follower_id(username, avatar_url)")
    .eq("user_id", user_id)
    .eq("follower_read", true)
    .order("follower_created_at", { ascending: false });
  return data;
};