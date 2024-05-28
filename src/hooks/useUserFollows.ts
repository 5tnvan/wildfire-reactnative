"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchFollowers } from "../utils/fetch/fetchFollowers";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";
import { fetchFollowed } from "../utils/fetch/fetchFollowed";
import { fetchUser } from "../utils/fetch/fetchUser";

/**
 * useUserFollows HOOK
 * Use this to get ANY user's followers and following by username
 **/
export const useUserFollows = (username: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState<any>();
  const [following, setFollowing] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch((prev) => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
    .from('profiles')
    .select("id")
    .eq('username', username)
    .single();
    if(data) {
      const user = await fetchUser();
      fetchFollowed(user?.user?.id, data.id).then((res:any) => {
        setFollowed(res);
      });
      fetchFollowers(data.id).then((res) => {
        setFollowers(res);
      });
      fetchFollowing(data.id).then((res) => {
        setFollowing(res);
      });
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    init();
    
  }, [triggerRefetch]);

  return { isLoading, followed, followers, following, refetch };
};
