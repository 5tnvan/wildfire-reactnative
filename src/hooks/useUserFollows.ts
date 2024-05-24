"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchFollowers } from "../utils/fetch/fetchFollowers";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";

/**
 * useUserFollows HOOK
 * Use this to get auth's user followers and following 
 **/
export const useUserFollows = (username: any) => {
  const [isLoading, setIsLoading] = useState(true);
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

  return { isLoading, followers, following, refetch };
};
