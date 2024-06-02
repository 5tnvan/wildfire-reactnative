import { View, Pressable, useColorScheme, StyleSheet, useWindowDimensions, Modal, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Text } from '../../components/Themed';
import { useUser } from '@/src/hooks/useUser';
import { Avatar } from '@/src/components/avatars/avatar';
import { useUserFollows } from '@/src/hooks/useUserFollows';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useUserFeedByUsername } from '@/src/hooks/useUserFeed';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { PressableAnimated } from '@/src/components/pressables/PressableAnimated';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FollowsModal } from '@/src/components/modals/FollowsModal';
import { useAuth } from '@/src/services/providers/AuthProvider';
import WheelOfFortuneItem from '@/src/components/carousel/WheelOfFortuneItem';
import StoryModal from '@/src/components/modals/StoryModal';

export default function ProfileUsernameScreen() {

  const isFocused = useIsFocused(); // Get focused state
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const { username } = useLocalSearchParams();
  const [storyIndex, setStoryIndex] = useState<any>(null);

  //CONSUME PROVIDERS
  const { user: authUser } = useAuth();
  const { user } = useUser(username);
  const { followed, followers, following, refetch: refetchFollows } = useUserFollows(username);

  //FETCH DIRECTLY
  const { isLoading: isLoadingFeed, feed } = useUserFeedByUsername(username);

  //MODALS
  const [storyModalVisible, setStoryModalVisible] = useState(false);
  const [followsModalVisible, setFollowsModalVisible] = useState(false); //follows modal
  
  //SPINNING CAROUSELL ANIMATION 
  const x = useSharedValue(0);
  const ITEM_WIDTH = 250;
  const ITEM_HEIGHT = 450;
  const MARGin_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGin_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  function openStory() { setStoryModalVisible(true); }
  function closeStory() { setStoryModalVisible(false); }

  const handleStoryPress = (index: number) => {
    setStoryIndex(index);
    openStory();
  };

  const handleFollow = async () => {
    const { error } = await supabase
      .from("followers")
      .insert({ follower_id: authUser?.id, following_id: user.id });
    if (!error) refetchFollows();
  }  

  if (!user) return <><Text>User not found</Text></>

  return (
    <>
      {storyModalVisible &&
        <StoryModal visible={storyModalVisible} data={{ authUser: authUser, user: user, feed: feed, followed: followed }} storyIndex={storyIndex} onClose={closeStory} />
      }
      <>
        {/* HEADER */}
        <Stack.Screen options={{
          headerShown: true,
          presentation: 'card',
          headerBackTitle: 'Back',
          title: '@' + username,
          headerRight: () => (
            <View>
              {followed != null && followed &&
                <PressableAnimated className="py-1 px-3 flex-row items-center" onPress={() => setFollowsModalVisible(true)}>
                  <Text className='mr-1'>Following </Text>
                  <View><Ionicons name="checkmark-circle-outline" size={16} color={colorScheme == 'dark' ? 'white' : 'black'} /></View>
                </PressableAnimated>
              }
              {followed != null && !followed &&
                <PressableAnimated className="bg-accent py-1 px-3 flex-row justify-center" onPress={handleFollow}>
                  <Text className='text-black font-medium'>Follow</Text>
                </PressableAnimated>
              }
            </View>
          )
        }} />
        {/* FOLLOWS MODAL */}
        {followsModalVisible && <FollowsModal visible={followsModalVisible} data={{ user: user, followers: followers }} onClose={() => { setFollowsModalVisible(false); refetchFollows() }} />}
        
        {/* CONTAINER FOR MAIN CONTENT*/}
        <View className="flex-1 flex-col justify-between">

          {/* LOADING FEED */}
          {isLoadingFeed && <View className="flex-row justify-center items-center grow ">
            <ActivityIndicator />
          </View>}

          {/* NO FEED */}
          {!isLoadingFeed && feed && feed.length === 0 &&
            <View className="flex-row justify-center items-center grow ">
              <PressableAnimated onPress={() => console.log("clicked")}>🤫 User hasn't posted yet</PressableAnimated>
            </View>}

          {/* SPINNING CAROUSEL FEED */}
          {!isLoadingFeed && feed && feed.length > 0 &&
            <>
              <View style={styles.container}>
                <Animated.FlatList
                  onScroll={onScroll}
                  ListHeaderComponent={<View />}
                  ListHeaderComponentStyle={{ width: SPACER }}
                  ListFooterComponent={<View />}
                  ListFooterComponentStyle={{ width: SPACER }}
                  data={feed}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.id + item.name}
                  renderItem={({ item, index }) => {
                    return (
                      <WheelOfFortuneItem
                        item={item}
                        index={index}
                        x={x}
                        width={ITEM_WIDTH}
                        height={ITEM_HEIGHT}
                        marginHorizontal={MARGin_HORIZONTAL}
                        fullWidth={ITEM_FULL_WIDTH}
                        onPress={handleStoryPress}
                      />
                    );
                  }}
                  horizontal
                  scrollEventThrottle={16}
                  decelerationRate="fast"
                  snapToInterval={ITEM_FULL_WIDTH}
                />
              </View>
            </>}

          {/* USER BOTTOM INFO */}
          <View className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"} w-full items-center justify-center p-10`}>
            <View className='absolute' style={{ top: -30 }}>
              <Avatar
                avatar_url={user.avatar_url}
                username={user.username}
                size="lg"
                ring={true}
              ></Avatar>
            </View>
            <Text className='font-medium text-lg text-accent'>@{user.username}</Text>
            <Pressable className="flex-row gap-1 mb-3">
              <Text className="font-semibold text-lg text-accent">
                {followers?.length}
              </Text>
              <Text className="text-lg">followers</Text>
              {/* <Text className="font-semibold text-lg text-accent">
            {following?.length}
          </Text>
          <Text className="text-lg">following</Text> */}
            </Pressable>
            <PressableAnimated
              onPress={() => alert("djhdjs")}>
              <Text className="text-lg"> </Text>
              <Text className="text-base">Tip Now</Text>
              <MaterialCommunityIcons
                name="ethereum"
                size={17}
                color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
              />
            </PressableAnimated>
          </View>
        </View>
      </>
    </>

  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
    flex: 1,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 26,
    fontWeight: '300',
    textAlign: 'center',
  },
});