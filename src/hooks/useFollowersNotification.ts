"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchUser } from "../utils/fetch/fetchUser";
import { fetchFollowersNotifications } from "../utils/fetch/fetchFollowersNotifications";

/**
 * useFeed HOOK
 * Use this to check daily posting limit
 **/
export const useFollowerNotifications = () => {

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>();
  const [notifications, setNotifications] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch(prev => !prev); //toggle triggerRefetch to false/true
  };

  const init = async () => {
    setIsLoading(true);
    const user = await fetchUser();
    if (user.user?.id) {
      setUser(user);
      const notificationsData = await fetchFollowersNotifications(user?.user?.id);
      setNotifications(notificationsData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  //LISTEN TO REALTIME CHANGES
  const handleChange = (payload: any) => {
    console.log("Change received!", payload);
    refetch();
  };

  supabase
    .channel("test")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user?.user?.id}` },
      handleChange,
    )
    .subscribe();

  return { isLoading, notifications, refetch };
};
