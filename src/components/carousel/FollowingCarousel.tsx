import React from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, useColorScheme } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from '../avatars/avatar';
import { useRouter } from 'expo-router';

const CARD_WIDTH = Dimensions.get('window').width * 0.15;
const CARD_HEIGHT = 58;
const MARGIN_LEFT = 0;
const MARGIN_RIGHT = 0;


type Props = {
    id: any,
    profile: any;
    colorScheme: any;
    onPress: any;
  };

const Item = ({ id, profile, colorScheme, onPress } : Props) => (
    <Pressable style={styles.card} className='items-center' onPress={() => onPress(profile.username)}>
        <Avatar avatar_url={profile.avatar_url} username={profile.username} size={'lg'} ring={true}></Avatar>
        <Text numberOfLines={1} ellipsizeMode='tail' className={`${colorScheme == "dark" ? "text-white" : "text-black"}`}>{profile.username}{id}</Text>
    </Pressable>
);

export default function FollowingCarousel({ data } : any) {
    const colorScheme = useColorScheme();
    const router = useRouter();

    // console.log("data.following", data);

    /**
     * HANDLE PRESS EVENT
     */
    const handleLink = (username: any) => {
        router.push("/(profile)/" + username);
    };

    return (
        <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item id={item.following.id} profile={item.following} colorScheme={colorScheme} onPress={handleLink}/>}
            snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
            decelerationRate="fast" // Make the scrolling feel snappier
            contentContainerStyle={styles.container}
            snapToAlignment="start" // Snap to the start of the card
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        height: 'auto',
        paddingVertical: 10,
    },
    card: {
        // backgroundColor: '#fff',
        // borderRadius: 10,
        width: CARD_WIDTH,
        marginLeft: MARGIN_LEFT,
        marginRight: MARGIN_RIGHT,
    },
});
