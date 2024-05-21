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

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { isLoading: isLoadingUser, profile } = useAuthUser();
  const { isLoading: isLoadingFollows, followers, following } = useAuthUserFollows();
  const incomingRes = useIncomingTransactions(profile.wallet_id);
  const outgoingRes = useOutgoingTransactions(profile.wallet_id);
  const { feed } = useUserFeed(profile.id);
  console.log("eth", calculateSum(incomingRes.ethereumData));
  console.log("base", calculateSum(outgoingRes.baseData));
  console.log("feed", feed);

  return (
    <>
      <View
        className={`${
          colorScheme == "dark" ? "bg-zinc-900" : "bg-white"
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
                    className={`${
                      colorScheme == "dark" ? "bg-secondary" : "bg-zinc-100"
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
            className={`${
              colorScheme == "dark" ? "bg-secondary" : "bg-zinc-200"
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
      <FlatList
            data={feed}
            renderItem={({ item }) => <Text>{item.thumbnail_url}</Text>}
            keyExtractor={(item, index) => index.toString()}
          />
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
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
