import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  useColorScheme,
  useWindowDimensions,
  Linking,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAuthUser } from "../../services/providers/AuthUserProvider";
import { Text } from "../../components/Themed";
import { Avatar } from "../../components/avatars/avatar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthUserFollows } from "@/src/services/providers/AuthUserFollowsProvider";
import { useIncomingTransactions } from "@/src/hooks/useIncomingTransactions";
import { useOutgoingTransactions } from "@/src/hooks/useOutgoingTransactions";
import { useUserFeed } from "@/src/hooks/useUserFeed";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from "@/src/components/Item";
import StoryComponent from "@/src/components/StoryComponent";
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Stack, useRouter } from "expo-router";
import { PressableAnimated } from "@/src/components/pressables/PressableAnimated";
import { SettingsModal } from "@/src/components/modals/SettingsModal";
import { FollowersModal } from "@/src/components/modals/FollowersModal";
import { FollowingModal } from "@/src/components/modals/FolllowingModal";

export default function ProfileScreen() {
  const router = useRouter();
  const isFocused = useIsFocused(); // Get focused state
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [storyIndex, setStoryIndex] = useState<any>(null);

  //CONSUME PROVIDERS
  const { isLoading: isLoadingUser, profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following, refetch: refetchFollows } = useAuthUserFollows();

  //FETCH DIRECTLY 
  const { isLoading: isLoadingFeed, feed, refetch: refetchFeed } = useUserFeed(profile.id);
  // console.log("feed", feed[0]);

  //HANDLE SETTINGS MODAL
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

  //SPINNING CAROUSELL ANIMATION 
  const x = useSharedValue(0);
  const ITEM_WIDTH = 250;
  const ITEM_HEIGHT = 450;
  const MARGIN_HORIZONTAL = 20;
  const ITEM_FULL_WIDTH = ITEM_WIDTH + MARGIN_HORIZONTAL * 2;
  const SPACER = (width - ITEM_FULL_WIDTH) / 2;

  const onScroll = useAnimatedScrollHandler({
    onScroll: event => {
      x.value = event.contentOffset.x;
    },
  });

  //HANDLE STORY PRESS
  const handleStoryPress = (index: number) => {
    setStoryIndex(index);
    openStory();
  };

  //OPEN CLOSE STORY MODAL 
  const [insideModal, setInsideModal] = useState(false);
  function openModal() { setInsideModal(true); }
  function closeModal() { setInsideModal(false); }

  const [insideStory, setInsideStory] = useState(false);
  function openStory() { setInsideStory(true); openModal(); }
  function closeStory() { setInsideStory(false); closeModal() }

  // HANDLE FOLLOWS MODAL
  const [followersModalVisible, setFollowersModalVisible] = useState(false);
  const [followingModalVisible, setFollowingModalVisible] = useState(false);

  //REFETCH DATA WHEN SCREEN IS FOCUSED 
  useEffect(() => {
    if (isFocused) {
      console.log("refetching profile")
      refetchFeed();
      refetchFollows();
    }
  }, [isFocused]);

  return (
    <>
      {insideStory ?
        // STORY MODAL
        <Modal
          visible={insideModal}
          onRequestClose={() => closeModal()}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <StoryComponent data={{feed: feed, followed: null}} storyIndex={storyIndex} onFinishStory={closeStory} />
        </Modal>
        :
        <>
          {/* HEADER */}
          <Stack.Screen options={{
            headerShown: true, title: '@' + profile.username,
            headerRight: () => (
              <PressableAnimated className="bg-transparent" onPress={() => setSettingsModalVisible(true)}><Ionicons name="settings" size={20} color={`${colorScheme == 'dark' ? 'white' : 'black'}`} /></PressableAnimated>
            )
          }} />

          {/* SETTINGS MODAL */}
          <SettingsModal visible={settingsModalVisible} onClose={() => setSettingsModalVisible(false)} />

          {/* CONTAINER FOR MAIN CONTENT*/}
          <View className="flex-1 flex-col justify-between">

            {/* LOADING FEED */}
            {isLoadingFeed && <View className="flex-row justify-center items-center grow ">
              <ActivityIndicator />
            </View>}

            {/* START YOUR FIRST POST */}
            {!isLoadingFeed && feed && feed.length === 0 && 
            <View className="flex-row justify-center items-center grow ">
              <PressableAnimated onPress={() => router.push("/create")}>🥳 Start your first post</PressableAnimated>
            </View>}

            {/* SPINNING CAROUSEL */}
            {!isLoadingFeed && feed && feed.length > 0 &&
              <>
                <View className='flex-1 pt-10'>
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
                        <Item
                          item={item}
                          index={index}
                          x={x}
                          width={ITEM_WIDTH}
                          height={ITEM_HEIGHT}
                          marginHorizontal={MARGIN_HORIZONTAL}
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
                </View></>}

                {/* USER BOTTOM INFO */}
                <View className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"} w-full items-center justify-center p-8`}>
                  {/* AVATAR */}
                  <View className='absolute' style={{ top: -30 }}>
                    <Avatar
                      avatar_url={profile.avatar_url}
                      username={profile.username}
                      size="lg"
                      ring={true}
                    ></Avatar>
                  </View>  
                  {/* FOLLOWERS FOLLOWING */}
                  <View className="flex-row items-center mb-3">
                      <TouchableOpacity className="flex-row gap-1 mr-1" onPress={() => setFollowersModalVisible(true)}>
                        <Text className="font-semibold text-lg text-accent">
                          {followers.length}
                        </Text>
                        <Text className="text-lg">followers</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-row gap-1"
                        onPress={() => setFollowingModalVisible(true)}
                      >
                        <Text className="font-semibold text-lg text-accent">
                          {following.length}
                        </Text>
                        <Text className="text-lg">following</Text>
                      </TouchableOpacity>
                  </View>
                  {/* FOLLOWERS MODAL */}
                  <FollowersModal visible={followersModalVisible} data={{ user: profile, followers: followers }} onClose={() => setFollowersModalVisible(false)} />
                  {/* FOLLOWING MODAL */}
                  <FollowingModal visible={followingModalVisible} data={{ user: profile, following: following }} onClose={() => setFollowingModalVisible(false)} />
                  {/* TIP NOW */}
                  <PressableAnimated
                    className={''}
                    onPress={() => (Linking.openURL('https://www.wildpay.app/' + profile.username))}>
                      <Text className="text-lg"> </Text>
                      <Text className="text-base">Tip Now</Text>
                      <MaterialCommunityIcons
                        name="ethereum"
                        size={14}
                        color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
                      />
                  </PressableAnimated>
                </View>
          </View>
        </>}
    </>
  );
}

const styles = StyleSheet.create({
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
