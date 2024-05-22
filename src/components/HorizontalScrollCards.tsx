import React from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from './avatars/avatar';

const CARD_WIDTH = Dimensions.get('window').width * 0.6;
const CARD_HEIGHT = 145
const MARGIN_LEFT = 7;
const MARGIN_RIGHT = 7;

const cardData = [
    { id: '1', title: 'Total Views', stat: '22', cta: 'Create', icon: 'eye', avatar: false },
    { id: '2', title: 'Level 1', stat: 'creator', cta: 'View all levels', avatar: true },
    { id: '3', title: 'Balance', stat: '$23', cta: 'View Wildpay', icon: 'coins' },
];

type Props = {
    id: any,
    title: any,
    stat: any,
    cta: any,
    eye: any,
    avatar: any,
    profile: any,
};

const Item = ({ id, title, stat, cta, eye, avatar, profile }: Props) => (
    <View style={styles.card}>
        <View className='flex-row'>
            <View className=''>
                <Text className='text-lg font-medium mb-1'>{title}</Text>
                <Text className={`text-4xl font-bold ${id == 1 ? 'text-accent' : 'text-secondary'} mb-2`}>{stat}</Text>
                <Pressable className='bg-accent px-5 py-1 rounded-full w-fit '><Text className='font-semibold'>{cta}</Text></Pressable>
            </View>
            <View className=' grow items-end'>
                {avatar &&
                <View>
                    <View className='absolute z-10 right-1 w-3 h-3 bg-green-400 rounded-full'></View>
                    <Avatar avatar_url={profile?.avatar_url} username={profile.username} size={'md'} ring={true}></Avatar>
                </View>
                }
                <FontAwesome5 name={eye} size={30} color="black" />
            </View>
        </View>
    </View>
);

export default function HorizontalScrollCards({ data } : any) {
    console.log("profile", data);
    return (
        <FlatList
            data={cardData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item id={item.id} title={item.title} stat={item.stat} cta={item.cta} eye={item.icon} avatar={item.avatar} profile={data} />}
            snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
            decelerationRate="fast" // Make the scrolling feel snappier
            contentContainerStyle={styles.container}
            snapToAlignment="start" // Snap to the start of the card
        />
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#444FFF',
        height: CARD_HEIGHT
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        width: CARD_WIDTH,
        marginLeft: MARGIN_LEFT,
        marginRight: MARGIN_RIGHT,
        padding: 15,
    },
});
