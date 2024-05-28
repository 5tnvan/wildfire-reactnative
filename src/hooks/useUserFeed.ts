"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import * as VideoThumbnails from "expo-video-thumbnails";
import { fetchFollowed } from "../utils/fetch/fetchFollowed";
import { fetchUser } from "../utils/fetch/fetchUser";

/**
 * useUserFeed HOOK
 * Use this to get feed of videos from any user
 **/
export const useUserFeed = (user_id: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch((prev) => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("3sec")
      .select(
        "id, video_url, thumbnail_url, created_at, views, country:country_id(id, name), profile:user_id(id, username, avatar_url)"
      )
      .eq("user_id", user_id)
      .order("created_at", { ascending: false });

      //check if auth user follows this user
    // const authUser = await fetchUser();
    // if (authUser) {
    //   const followed = fetchFollowed(authUser.user?.id, user_id);
    // }

    //add it to 
    

    setFeed(data);
    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};

/**
 * USEFEED HOOK
 * Use this to get feed of videos
 **/
export const useUserFeedByUsername = (username: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feed, setFeed] = useState<any>();
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    setTriggerRefetch((prev) => !prev);
  };

  const init = async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .single();

    if (data) {
      const { data: feed } = await supabase
        .from("3sec")
        .select(
          "id, video_url, thumbnail_url, created_at, views, country:country_id(id, name), profile:user_id(id, username, avatar_url)"
        )
        .eq("user_id", data.id)
        .order("created_at", { ascending: false });
      setFeed(feed);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, feed, refetch };
};
