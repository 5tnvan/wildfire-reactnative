"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowersUnreadNotifications()
 * DB: supabase
 * TABLE: notifications
 * RETURN: { data }
 **/

export const fetchCommentsUnreadNotifications = async (user_id: any) => {
  const { data } = await supabase
    .from("notifications_comments")
    .select("id, read, created_at, user:commented_by(username, avatar_url)")
    .eq("user_id", user_id)
    .eq("read", false)
    .order("created_at", { ascending: false });
  return data;
};

/**
 * FETCH: fetchFollowersReadNotifications()
 * DB: supabase
 * TABLE: notifications
 * RETURN: { data }
 **/

export const fetchCommentsReadNotifications = async (user_id: any) => {
  const { data } = await supabase
    .from("notifications_comments")
    .select("id, read, created_at, user:commented_by(username, avatar_url)")
    .eq("user_id", user_id)
    .eq("read", true)
    .order("created_at", { ascending: false });
  return data;
};