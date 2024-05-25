import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import PostItem from './PostItem';
import { useUserFollowingFeed } from "@/src/hooks/useUserFollowingFeed";
import { useIsFocused } from '@react-navigation/native';

export default function Posts() {
  const isFocused = useIsFocused();

  //FETCH DIRECTLY
  const { isLoading, feed: userFollowingFeed, hasMore, fetchMore, refetch } = useUserFollowingFeed();

  //FIGURE OUT WHICH VIDEO IS IN USER'S VIEW TO PLAY
  const [playingIndex, setPlayingIndex] = useState<any>(null);
  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };
  const onViewableItemsChanged = ({ viewableItems } : any) => {
    if (viewableItems.length > 0) {
      setPlayingIndex(viewableItems[0].index);
    }
  };
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  // HANDLE TOGGLE MUTE
  const [isMuted, setIsMuted] = useState(true);
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  // HANDLE END REACH
  const handleEndReached = () => {
    if (hasMore && !isLoading) {
      fetchMore();
    }
  };

  // REFETCH WHEN SCREEN IS IN FOCUS
  useEffect(() => {
    if (!isFocused) {
      setPlayingIndex(null);
    } else {
      refetch();
    }
  }, [isFocused]);

  return (
    <FlatList
      data={userFollowingFeed}
      renderItem={({ item, index }) => (
        <PostItem
          item={item}
          isPlaying={index === playingIndex}
          isMuted={isMuted}
          toggleMute={handleToggleMute}
        />
      )}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5} // Adjust the threshold as needed
    />
  );
}
