"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchUser } from "../utils/fetch/fetchUser";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  console.log("page, from, to", page, from, to);
  return { from, to };
};

/**
 * useUserFollowingFeed HOOK
 * Use this to get auth's user feed of videos from those they follow
 **/
export const useUserFollowingFeed = () => {
  const range = 3;
  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // Added state to track if there's more data to fetch
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setPage(0); // Reset page
    setFeed([]); // Reset feed
    setHasMore(true); // Reset hasMore to true
    setTriggerRefetch(prev => !prev); // Trigger refetch
  };

  const fetchMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increase page by 1
    }
  };

  const fetchFeed = async (page: number) => {
    setIsLoading(true);

    // Get list of auth's user following
    const user = await fetchUser();
    const following = await fetchFollowing(user.user?.id);

    if (following) {
      const followingArray = following.map((f: any) => f.following.id); // Create an array of IDs from following
      const { from, to } = getRange(page, range);

      const { data, error } = await supabase
        .from('1sec_desc_view')
        .select('id, video_url, created_at, profile:user_id(id, username, avatar_url)')
        .in('user_id', followingArray)
        .range(from, to);

      if (error) {
        console.error("Error fetching data:", error);
      } else {
        // console.log("data", JSON.stringify(data, null, 2));

        if (data.length < range) {
          setHasMore(false); // No more data to fetch
        }

        setFeed((existingFeed) => [...existingFeed, ...data]);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(page);
  }, [page, triggerRefetch]);

  return { isLoading, feed, hasMore, fetchMore, refetch,  };
};
