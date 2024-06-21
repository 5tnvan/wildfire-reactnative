"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchUser } from "../utils/fetch/fetchUser";
import { checkIsBlocked } from "../utils/check/checkIsBlocked";

/**
 * USEFEED HOOK
 * Use this to get feed of videos
 **/
export const useUser = (username: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [isBlocked, setIsBlocked] = useState<any>(false);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch((prev) => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .single();

    if (profile) {
      setUser(profile);
      const authUser = await fetchUser();
      const blocked = await checkIsBlocked(authUser.user?.id, profile.id);
      if (blocked) setIsBlocked(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, user, isBlocked, refetch };
};
