import React from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

const CARD_WIDTH = Dimensions.get('window').width * 0.6;
const CARD_HEIGHT = 110
const MARGIN_LEFT = 7;
const MARGIN_RIGHT = 7;

const cardData = [
    { id: '1', title: 'A time to remember', stat: 'Yesterday', icon: 'clock' },
    { id: '2', title: 'A person to follow', stat: 'Rising Star', icon: 'person' },
    { id: '3', title: 'A country to visit', stat: '249', icon: 'location-arrow'}
];

type ComponentProps = {
    handlePress: (id: string) => void;
};

/**
* COMPONENT
*/
export default function DiscoverCarousel({ handlePress } : ComponentProps) {
    return (
        <FlatList
            data={cardData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item id={item.id} title={item.title} stat={item.stat} icon={item.icon} onPress={handlePress} />}
            snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
            decelerationRate="fast" // Make the scrolling feel snappier
            contentContainerStyle={styles.container}
            snapToAlignment="start" // Snap to the start of the card
        />
    );
};

type ItemProps = {
    id: any,
    title: any,
    stat: any,
    icon: any,
    onPress: (id: string) => void;
};

/**
* FLATLIST ITEM
*/
const Item = ({ id, title, stat, icon, onPress }: ItemProps) => (
    <Pressable style={styles.card} onPress={() => onPress(id)}>
        <View className='flex-row'>
            <View className=''>
                <Text className='text-lg font-medium mb-1'>{title}</Text>
                <Text className={`text-4xl font-bold ${id == 1 ? 'text-accent' : 'text-secondary'} mb-2`}>{stat}</Text>
            </View>
            <View className=' grow items-end'>
                <FontAwesome6 name={icon} size={30} color="black" />
            </View>
        </View>
    </Pressable>
);

/**
* STYLES
*/
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
