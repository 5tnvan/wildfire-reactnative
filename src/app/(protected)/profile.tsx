import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Pressable,
  Modal,
  useColorScheme,
  useWindowDimensions,
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
import { Stack } from "expo-router";
import { PressableAnimated } from "@/src/components/pressables/PressableAnimated";
import { SettingsModal } from "@/src/components/modals/SettingsModal";

export default function ProfileScreen() {
  const isFocused = useIsFocused(); // Get focused state
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const [storyIndex, setStoryIndex] = useState<any>(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false); //settings modal

  //CONSUME PROVIDERS
  const { isLoading: isLoadingUser, profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();
  const { feed, refetch } = useUserFeed(profile.id);

  //FETCH DIRECTLY 
  const incomingRes = useIncomingTransactions(profile.wallet_id);
  const outgoingRes = useOutgoingTransactions(profile.wallet_id);
  
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

  //OPEN CLOSE STORY MODAL 
  const [insideModal, setInsideModal] = useState(false);
  function openModal() { setInsideModal(true); }
  function closeModal() { setInsideModal(false); }

  const [insideStory, setInsideStory] = useState(false);
  function openStory() { setInsideStory(true); openModal(); }
  function closeStory() { setInsideStory(false); closeModal() }

  //REFETCH DATA WHEN SCREEN IS FOCUSED 
  useEffect(() => {
    if (isFocused) {
      console.log("refetching profile feed")
      refetch();
    }
  }, [isFocused]);

  //HANDLE PRESS ITEM
  const handleItemPress = (index: number) => {
    setStoryIndex(index);
    openStory();
  };

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
          <StoryComponent data={feed} storyIndex={storyIndex} onFinishStory={closeStory} />
        </Modal>
        :
        <>
          {/* HEADER */}
          <Stack.Screen options={{
            headerShown: true, title: '@' + profile.username, 
            headerRight: () => (
              <PressableAnimated className="bg-transparent" onPress={() => setSettingsModalVisible(true)}><Ionicons name="settings" size={20} color="white" /></PressableAnimated>
            )
          }} />
          {/* SETTINGS MODAL */}
          <SettingsModal visible={settingsModalVisible} onClose={() => setSettingsModalVisible(false)}/>
          {/* SPINNING CAROUSEL */}
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
                  <Item
                    item={item}
                    index={index}
                    x={x}
                    width={ITEM_WIDTH}
                    height={ITEM_HEIGHT}
                    marginHorizontal={MARGIN_HORIZONTAL}
                    fullWidth={ITEM_FULL_WIDTH}
                    onPress={handleItemPress}
                  />
                );
              }}
              horizontal
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={ITEM_FULL_WIDTH}
            />
          </View>
          {/* USER INTRO */}
          <View className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"} absolute bottom-0 w-full items-center justify-center p-10`}>
            {/* 
            * AVATAR
            */}
            <View className='absolute' style={{ top: -30 }}>
              <Avatar
                avatar_url={profile.avatar_url}
                username={profile.username}
                size="lg"
                ring={true}
              ></Avatar>
            </View>
            <View className="flex-row items-center mb-3">
              <View className="ml-2">
                <View className="flex-row items-center">
                </View>
                <Pressable
                  className="flex-row gap-1"
                  
                >
                  <Text className="font-semibold text-lg text-accent">
                    {followers.length}
                  </Text>
                  <Text className="text-lg">followers</Text>
                  <Text className="font-semibold text-lg text-accent">
                    {following.length}
                  </Text>
                  <Text className="text-lg">following</Text>
                </Pressable>
              </View>
            </View>
            {/* <View className="flex-col items-end">
              <Text className="text-xl font-semibold text-accent">${(calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3)}Ξ</Text>
              <Text className="text-base text-zinc-400">${(calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3)}Ξ</Text>
            </View> */}

            <PressableAnimated
              className={''}
              onPress={openStory}>
              <Text className="text-lg"> </Text>
              <Text className="text-base">Tip Now</Text>
              <MaterialCommunityIcons
                name="ethereum"
                size={17}
                color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
              />
            </PressableAnimated>
          </View>
        </>}

      {/* <Modal
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View className="bg-slate-500 grow">
          <Text className="text-black">hihi</Text>
          <Pressable
            className="flex-row gap-1"
            onPress={() => setIsModalVisible(false)}
          >
            <Text className="font-semibold">{followers.length}</Text>
            <Text>Close</Text>
            <Text className="font-semibold">{following.length}</Text>
            <Text>Close</Text>
          </Pressable>
          <Text>Followers</Text>
          <FlatList
            data={followers}
            renderItem={({ item }) => <Text>{item.follower.username}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
          <Text>Following</Text>
          <FlatList
            data={following}
            renderItem={({ item }) => <Text>{item.following.username}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal> */}
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
