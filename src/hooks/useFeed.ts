"use client"; // Removed this line as it's not necessary in a React Native environment

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";
import { fetchUser } from "../utils/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);

    const { data } = await supabase
      .from('1sec_desc_view')
      .select('id, video_url, created_at, views, country:country_id(id, name), profile:user_id(id, username, avatar_url)');

    setFeed(data);
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
