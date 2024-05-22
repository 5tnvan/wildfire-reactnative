import React from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, useColorScheme } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from './avatars/avatar';

const CARD_WIDTH = Dimensions.get('window').width * 0.15;
const CARD_HEIGHT = 100
const MARGIN_LEFT = 7;
const MARGIN_RIGHT = 7;


type Props = {
    profile: any;
    colorScheme: any;
  };

const Item = ({ profile, colorScheme } : Props) => (
    <View style={styles.card} className='items-center'>
        <Avatar avatar_url={profile.avatar_url} username={profile.username} size={'lg'} ring={true}></Avatar>
        <Text numberOfLines={1} ellipsizeMode='tail' className={`${colorScheme == "dark" ? "text-white" : "text-black"}`}>{profile.username}</Text>
    </View>
);

export default function FollowingScroll({ data } : any) {
    const colorScheme = useColorScheme();
    return (
        <FlatList
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item profile={item.following} colorScheme={colorScheme}/>}
            snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
            decelerationRate="fast" // Make the scrolling feel snappier
            contentContainerStyle={styles.container}
            snapToAlignment="start" // Snap to the start of the card
        />
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff000',
        height: CARD_HEIGHT
    },
    card: {
        // backgroundColor: '#fff',
        // borderRadius: 10,
        width: CARD_WIDTH,
        marginLeft: MARGIN_LEFT,
        marginRight: MARGIN_RIGHT,
    },
});
