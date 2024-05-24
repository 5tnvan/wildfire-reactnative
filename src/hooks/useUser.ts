"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

/**
 * USEFEED HOOK
 * Use this to get feed of videos
 **/
export const useUser = (username: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
    .from('profiles')
    .select("*")
    .eq('username', username)
    .single();
    if(data) {
      setUser(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, user, refetch };
};
