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
    setTriggerRefetch(prev => !prev);
  };

  const init = async () => {
    setIsLoading(true);

    const now = new Date(); // Get current date and time
    const user = await fetchUser();

    // Fetch level (if data returns, setLevel to 1, otherwise leave level as 0)
    const { data: levelData, error: levelError } = await supabase
      .from('levels')
      .select('level')
      .eq('user_id', user.user?.id)
      .single();

    // Fetch last video posts
    const { data: posts, error: postsError } = await supabase
      .from('3sec')
      .select('id, created_at')
      .eq('user_id', user.user?.id)
      .order('created_at', { ascending: false })
      .limit(6);

    if (postsError) {
      console.error(postsError);
      setIsLoading(false);
      return;
    }

    setPosts(posts);

    // Determine the allowed number of posts based on user classification
    const maxPosts = levelData ? 6 : 3; // 'Creator' allows 6 posts, 'Noob' allows 3 posts

    // Filter posts made within the last 24 hours, default to empty array if posts is undefined
    const postsInLast24Hours = (posts || []).filter(post => {
      const postDate = new Date(post.created_at);
      const diff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60); // Difference in hours
      return diff < 24;
    });

    // Calculate the number of posts left
    const postsLeft = Math.max(0, maxPosts - postsInLast24Hours.length);
    setPostLeft(postsLeft);

    // Determine if the user has reached their limit
    setLimit(postsLeft === 0);

    setIsLoading(false); // Stop loading
  };

  useEffect(() => {
    init();
  }, [triggerRefetch]);

  return { isLoading, limit, posts, postLeft, refetch };
};
