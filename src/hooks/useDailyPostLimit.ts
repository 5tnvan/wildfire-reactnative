"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchUser } from "../utils/fetch/fetchUser";

/**
 * useFeed HOOK
 * Use this to check daily posting limit
 **/
export const useDailyPostLimit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState<boolean | null>(null);
  const [postLeft, setPostLeft] = useState<number | null>(null);
  const [posts, setPosts] = useState<any>([null]);
  const [triggerRefetch, setTriggerRefetch] = useState(false);

  const refetch = () => {
    console.log('refetchnggg')
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);

    // Fetch user
    const user = await fetchUser();

    // Fetch level (if data returns, setLevel to 1, otherwise leave level as 0)
    const { data: levelData, error: levelError } = await supabase
      .from('levels')
      .select('level')
      .eq('user_id', user.user?.id)
      .single();

    console.log("levelData", levelData);

    // Fetch last video posts
    const { data: posts, error: postsError } = await supabase
      .from('3sec')
      .select('id, created_at')
      .eq('user_id', user.user?.id)
      .order('created_at', { ascending: false })
      .limit(2);

    if (postsError) {
      console.error(postsError);
      setIsLoading(false);
      return;
    }

    console.log("posts", posts);

    setPosts(posts);

    const now = new Date();

    if (!levelData) {
      console.log("im here, level 0")
      if (posts && posts.length > 0) {
        const postDate = new Date(posts[0].created_at);
        const diff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60); // difference in hours

        if (diff < 24) {
          setLimit(true);
          setPostLeft(0);
        } else {
          setLimit(false);
          setPostLeft(1);
        }
      } else {
        setLimit(false);
        setPostLeft(1);
      }
    }

    if (levelData) {
      console.log("im here, level 1")
      if (posts && posts.length > 1) {
        
        const postDate1 = new Date(posts[0].created_at);
        const postDate2 = new Date(posts[1].created_at);
        const diff1 = (now.getTime() - postDate1.getTime()) / (1000 * 60 * 60); // difference in hours
        const diff2 = (now.getTime() - postDate2.getTime()) / (1000 * 60 * 60); // difference in hours

        if (diff1 < 24 && diff2 < 24) {
          setLimit(true);
          setPostLeft(0);
        } else if (diff1 < 24) {
          setLimit(false);
          setPostLeft(1);
        } else {
          setLimit(false);
          setPostLeft(2);
        }
      } else if (posts && posts?.length === 1) {
        const postDate = new Date(posts[0].created_at);
        const diff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60); // difference in hours

        if (diff < 24) {
          setLimit(false);
          setPostLeft(1);
        } else {
          setLimit(false);
          setPostLeft(2);
        }
      } else {
        setLimit(false);
        setPostLeft(2);
      }
    }

    setIsLoading(false);
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, limit, posts, postLeft, refetch };
};
