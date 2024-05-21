"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as VideoThumbnails from 'expo-video-thumbnails';

/**
 * USEFEED HOOK
 * Use this to get feed of videos
 **/
export const useUserFeed = (user_id: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
    .from('1sec')
    .select('video_url, thumbnail_url, created_at, profile:user_id(id, username, avatar_url)')
    .eq('user_id', user_id);

    setFeed(data);
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
