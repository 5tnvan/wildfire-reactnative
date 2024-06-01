import { supabase } from "@/src/lib/supabase";

/**
 * markAsRead
 * fetch and calculate views
 * @returns views
 */
export const markAsRead = async (notification_id: any) => {
  const { error } = await supabase
  .from("notifications")
  .update({ follower_read: true })
  .eq("id", notification_id)

  if(error) {
    console.log("markAsRead error", error);
  }
}