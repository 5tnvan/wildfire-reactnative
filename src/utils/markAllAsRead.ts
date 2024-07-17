import { supabase } from "@/src/lib/supabase";

/**
 * markAllAsRead
 * fetch and calculate views
 * @returns views
 */
export const markAllAsRead = async (user_id: any) => {
  const { error: err1 } = await supabase
  .from("notifications")
  .update({ follower_read: true })
  .eq("user_id", user_id)
  .eq("follower_read", false)

  const { error: err2 } = await supabase
  .from("notifications_fires")
  .update({ read: true })
  .eq("user_id", user_id)
  .eq("read", false)

  const { error: err3 } = await supabase
  .from("notifications_comments")
  .update({ read: true })
  .eq("user_id", user_id)
  .eq("read", false)

  if(err1 || err2 || err3) {
    console.log("markAllAsRead error", err1, err2, err3);
  }
}