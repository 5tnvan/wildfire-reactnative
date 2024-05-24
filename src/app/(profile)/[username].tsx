import { View, Image, Pressable, useColorScheme, StyleSheet, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '../../components/Themed';
import { useUser } from '@/src/hooks/useUser';
import { Avatar } from '@/src/components/avatars/avatar';
import { useUserFollows } from '@/src/hooks/useUserFollows';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from 'react';
import { fetchUser } from '@/src/utils/fetch/fetchUser';
import { supabase } from '@/src/lib/supabase';
import { useUserFeed, useUserFeedByUsername } from '@/src/hooks/useUserFeed';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Item from '@/src/components/Item';

export default function ProfileUsernameScreen() {
  
  const colorScheme = useColorScheme();
  const { username } = useLocalSearchParams();
  const usernameAsTitle = Array.isArray(username) ? username[0] : username;
  const { user } = useUser(username);
  const { followers, following } = useUserFollows(username);
  const { feed, refetch } = useUserFeedByUsername(username);

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

  if (!user) return <><Text>User not found</Text></>

  return (
    <>
      <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, headerBackTitle: 'Back', title: '@' + usernameAsTitle ?? '' }} />
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
        {/* <Pressable onPress={openStory} className="bg-primary text-white p-5 rounded-lg"><Text>Open Story</Text></Pressable> */}
      </View>
      <SafeAreaView className=''>
        <Text>Hello {username}</Text>
        <Text>{user.username}</Text>
      </SafeAreaView>
      <View className={`${colorScheme == "dark" ? "bg-zinc-900" : "bg-white"} absolute bottom-0 w-full items-center justify-center p-10`}>
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
        <Pressable
          className={`${colorScheme == "dark" ? "bg-secondary" : "bg-zinc-200"} flex-row justify-between rounded-full items-center px-4 py-2 w-full`}>
          <Text className="text-lg"> </Text>
          <Text className="text-base">Tip Now</Text>
          <MaterialCommunityIcons
            name="ethereum"
            size={17}
            color={colorScheme === "dark" ? "white" : "black"} // Adjust color based on colorScheme
          />
        </Pressable>
      </View>

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