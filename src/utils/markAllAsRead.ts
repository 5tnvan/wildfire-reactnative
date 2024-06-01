import { supabase } from "@/src/lib/supabase";

/**
 * markAllAsRead
 * fetch and calculate views
 * @returns views
 */
export const markAllAsRead = async (user_id: any) => {
  const { error } = await supabase
  .from("notifications")
  .update({ follower_read: true })
  .eq("user_id", user_id)
  .eq("follower_read", false)

  if(error) {
    console.log("markAllAsRead error", error);
  } else {
    console.log("markAllAsRead success");
  }
}