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
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    
    //get list of auth's user following
    const user = await fetchUser();
    const following = await fetchFollowing(user.user?.id);

    
    if(following) {
      const followingArray = following?.map((f: any) => f.following.id); // Create an array of IDs from following

      const { data } = await supabase
      .from('1sec')
      .select('video_url, created_at, profile:user_id(id, username, avatar_url)')
      .in('user_id', followingArray);

      setFeed(data);
      setIsLoading(false);
    }
    
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
