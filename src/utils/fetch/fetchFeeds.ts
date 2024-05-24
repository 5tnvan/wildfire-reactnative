"use server";

import { supabase } from "@/src/lib/supabase";

/**
 * FETCH: fetchFollowers()
 * DB: supabase
 * TABLE: "follows"
 **/

export const fetchFeedByCountry = async (country_id: any) => {
  const { data, error } = await supabase
    .from("1sec_random_view")
    .select(
      "video_url, thumbnail_url, created_at, country:country_id(name), profile:user_id(id, username, avatar_url)"
    )
    .eq("country_id", country_id);

  return data;
};
