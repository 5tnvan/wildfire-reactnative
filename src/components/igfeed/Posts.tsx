import React, { useState, useRef, useEffect } from 'react';
import { FlatList, View } from 'react-native';
import PostItem from './PostItem';
import { useUserFollowingFeed } from "@/src/hooks/useUserFollowingFeed";
import { useIsFocused } from '@react-navigation/native';

export default function Posts() {
  const { feed: userFollowingFeed } = useUserFollowingFeed();
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);
  const isFocused = useIsFocused();

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = ({ viewableItems } : any) => {
    if (viewableItems.length > 0) {
      setPlayingIndex(viewableItems[0].index);
    }
  };

  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }]);

  useEffect(() => {
    if (!isFocused) {
      setPlayingIndex(null);
    }
  }, [isFocused]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <FlatList
      data={userFollowingFeed}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item, index }) => (
        <PostItem
          item={item}
          isPlaying={index === playingIndex}
          isMuted={isMuted}
          toggleMute={toggleMute}
        />
      )}
      viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
    />
  );
}
