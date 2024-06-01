"use client"; // Removed this line as it's not necessary in a React Native environment

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { fetchFollowing } from "../utils/fetch/fetchFollowing";
import { fetchUser } from "../utils/fetch/fetchUser";

const getRange = (page: number, range: number) => {
  const from = page * range;
  const to = from + range - 1;
  return { from, to };
};

/**
 * useFeed HOOK
 * Use this to get feed of videos
 **/
export const useFeed = () => {
  const range = 3;

  const [isLoading, setIsLoading] = useState(false);
  const [feed, setFeed] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchFeed = async () => {
    setIsLoading(true);
    const { from, to } = getRange(page, range);

    const user = await fetchUser();

    const { data, error } = await supabase
      .from('3sec_desc_view')
      .select('id, thumbnail_url, video_url, created_at, country:country_id(id, name), profile:user_id(id, username, avatar_url), 3sec_fires(count), 3sec_comments(count)')
      .range(from, to)

      if (error) {
        console.error("useFeed Error fetching data:", error);
      } else {
        // console.log("data", JSON.stringify(data, null, 2));

        // Check if each post is liked by the user
        const likedPostsPromises = data.map(async (post: any) => {
          const { data: liked, error } = await supabase
            .from("3sec_fires")
            .select()
            .eq("user_id", user.user?.id)
            .eq("video_id", post.id)
            .single();

          return { ...post, liked: !!liked }; // Add a property 'liked' to each post indicating whether it's liked by the user
        });

        // Wait for all promises to resolve
        const masterData = await Promise.all(likedPostsPromises);

        if (data.length < range) {
          setHasMore(false); // No more data to fetch
        }

        setFeed((existingFeed) => [...existingFeed, ...masterData]);
      }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFeed();
  }, [page, triggerRefetch]);

  return { isLoading, feed, fetchMore, refetch };
};
