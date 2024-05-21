"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * USEFEED HOOK
 * Use this to get feed of videos
 **/
export const useFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any[]>([]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
    .from('1sec')
    .select('video_url, created_at, profile:user_id(id, username, avatar_url)');

  if (data && data.length > 0) {
    const videos = data.map((video: any) => ({
      uri: video.video_url,
      fires: 1456,
      comments: 50,
      shares: 203,
      views: 5034,
      username: video.profile.username,
      avatar_url: video.profile.avatar_url,
      created_at: video.created_at
    }));

    setFeed(videos);
    setIsLoading(false);
  }};

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
