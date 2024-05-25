"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchUser } from "../utils/fetch/fetchUser";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";

/**
 * useUserFollowingFeed HOOK
 * Use this to get auth's user feed of videos from those they follow
 **/
export const useUserFollowingFeed = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset to first page
    setFeed([]); // Clear existing feed
    setHasMore(true); // Reset hasMore flag
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchFeed = async (page: number) => {
    setIsLoading(true);
    
    // Get list of auth's user following
    const user = await fetchUser();
    const following = await fetchFollowing(user.user?.id);

    if (following) {
      const followingArray = following.map((f: any) => f.following.id); // Create an array of IDs from following

      const { data, error } = await supabase
        .from('1sec')
        .select('id, video_url, created_at, profile:user_id(id, username, avatar_url)')
        .in('user_id', followingArray)
        .order('created_at', { ascending: false })
        .range(page * 3, (page + 1) * 3 - 1); // Fetch 3 items per page

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      if (!data || data.length < 3) {
        setHasMore(false);
      }

      setFeed(prevFeed => [...prevFeed, ...data]); // Append new data to existing feed
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page, triggerRefetch]);

  return { isLoading, feed, hasMore, fetchMore: () => setPage(prev => prev + 1), refetch };
};
