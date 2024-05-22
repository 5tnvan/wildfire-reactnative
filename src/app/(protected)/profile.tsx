import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Pressable,
  Modal,
  FlatList,
  Image,
  useColorScheme,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useAuthUser } from "../../services/providers/AuthUserProvider";
import { Text } from "../../components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar } from "../../components/avatars/avatar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuthUserFollows } from "@/src/services/providers/AuthUserFollowsProvider";
import { useIncomingTransactions } from "@/src/hooks/useIncomingTransactions";
import { useOutgoingTransactions } from "@/src/hooks/useOutgoingTransactions";
import { calculateSum } from "@/src/utils/calculateSum";
import { useUserFeed } from "@/src/hooks/useUserFeed";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from "@/src/components/Item";
import Button from "@/src/components/Button";
import StoryComponent from "@/src/components/StoryComponent";
//import {SystemBars} from 'react-native-bars';
import { useIsFocused, useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading: isLoadingUser, profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();
  const incomingRes = useIncomingTransactions(profile.wallet_id);
  const outgoingRes = useOutgoingTransactions(profile.wallet_id);
  const { feed, refetch } = useUserFeed(profile.id);
  const isFocused = useIsFocused(); // Get focused state

  const { width } = useWindowDimensions();
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

  const [insideStory, setInsideStory] = useState(false);

  function openStory() {
    setInsideStory(true);
  }

  function closeStory() {
    setInsideStory(false);
  }

  // Call refetch function every time the screen is focused
  useEffect(() => {
    if (isFocused) {
      console.log("refetching profile feed")
      refetch();
    }
  }, [isFocused]);

  return (
    <>
      {insideStory ? <StoryComponent data={feed} onFinishStory={closeStory} /> :
        <>
          <View
            className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"
              } pt-5`}
          >
            <SafeAreaView className="px-3">
              <View className="flex-row justify-between">
                <View className="flex-row items-center mb-3">
                  <Avatar
                    avatar_url={profile.avatar_url}
                    size="md"
                    ring={true}
                  ></Avatar>
                  <View className="ml-2">
                    <View className="flex-row items-center">
                      <Text className="text-lg ml-1 font-semibold mr-1">
                        @{profile.username}
                      </Text>
                      <Pressable
                        className={`${colorScheme == "dark" ? "bg-secondary" : "bg-zinc-100"
                          } px-2 py-1 rounded-full`}
                      >
                        <Text>Follow</Text>
                      </Pressable>
                    </View>
                    <Pressable
                      className="flex-row gap-1"
                      onPress={() => setIsModalVisible(true)}
                    >
                      <Text className="font-semibold text-base text-accent">
                        {followers.length}
                      </Text>
                      <Text className="text-base">followers</Text>
                      <Text className="font-semibold text-base text-accent">
                        {following.length}
                      </Text>
                      <Text className="text-base">following</Text>
                    </Pressable>
                  </View>
                </View>
                <View className="flex-col items-end">
                  <Text className="text-xl font-semibold text-accent">${(calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3)}Ξ</Text>
                  <Text className="text-base text-zinc-400">${(calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3)}Ξ</Text>
                </View>
              </View>
              <Pressable
                className={`${colorScheme == "dark" ? "bg-secondary" : "bg-zinc-200"
                  }  flex-row justify-between rounded-full items-center p-2 relative`}
              >
                <Text className="text-lg"> </Text>
                <Text className="text-lg">Tip Now</Text>
                <MaterialCommunityIcons
                  name="ethereum"
                  size={20}
                  color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
                />
              </Pressable>
            </SafeAreaView>
          </View>
          <SafeAreaView style={styles.container}>
            {/* <SystemBars animated={true} barStyle={'light-content'} /> */}
            {/* <View style={styles.textContainer}>
        <Text style={styles.text}>Choose a style that perfectly</Text>
        <Text style={styles.text}>reflects your true self</Text>
      </View> */}
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
                    marginHorizontal={MARGin_HORIZONTAL}
                    fullWidth={ITEM_FULL_WIDTH}
                  />
                );
              }}
              horizontal
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={ITEM_FULL_WIDTH}
            />
            {/* <Button /> */}
            <Pressable onPress={openStory} className="bg-primary text-white p-5 rounded-lg"><Text>Open Story</Text></Pressable>
          </SafeAreaView>
        </>}

      <Modal
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
      </Modal>

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
