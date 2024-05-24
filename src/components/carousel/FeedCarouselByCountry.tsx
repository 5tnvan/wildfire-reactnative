import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, Modal } from 'react-native';
import Video from 'react-native-video';
import { useFeedFromCountry } from '@/src/hooks/useFeedFromCountry';
import { FontAwesome } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import StoryComponent from '../StoryComponent';

const CARD_WIDTH = Dimensions.get('window').width * 0.8;
const CARD_HEIGHT = 600
const MARGIN_LEFT = 0;
const MARGIN_RIGHT = 4;

/**
* COMPONENT
*/
export default function FeedCarouselByCountry() {

    // SET UP MASTER FEED
    const { feed: masterFeed, refetch } = useFeedFromCountry(3);

    // SET UP STORY COMPONENT
    const [storyFeed, setStoryFeed] = useState(null);
    const [insideStory, setInsideStory] = useState(false);
    function openStory(storyFeed: any) {
        setStoryFeed(storyFeed);
        setInsideStory(true);
        openModal();
    }
    function closeStory() { setInsideStory(false); closeModal() }

    // SET UP MODAL COMPONENT
    const [insideModal, setInsideModal] = useState(false);
    function openModal() { setInsideModal(true); }
    function closeModal() { setInsideModal(false); }

    // REFETCH DATA WHEN SCREEN IS IN FOCUS
    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) refetch();
    }, [isFocused]);

    return (
        <>
            {insideStory && (
                <Modal
                    visible={insideModal}
                    onRequestClose={() => closeModal()}
                    animationType="slide"
                    presentationStyle="pageSheet"
                >
                    <StoryComponent data={storyFeed} onFinishStory={closeStory} />
                </Modal>
            )}
            {masterFeed &&
                (
                    <FlatList
                        data={masterFeed}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => <Item video_url={item.first_video} country={item.country_name} onPress={() => openStory(item.data)} />}
                        snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
                        decelerationRate="fast" // Make the scrolling feel snappier
                        contentContainerStyle={styles.container}
                        snapToAlignment="center" // Snap to the start of the card
                    />
                )}

        </>
    );
};

/**
* FLATLIST ITEM
*/
type Props = {
    video_url: any,
    country: any,
    onPress: any,
};

const Item = ({ video_url, country, onPress }: Props) => (
    <Pressable style={styles.card} onPress={onPress}>
        <Video
            source={{ uri: video_url }}
            resizeMode="cover"
            style={styles.backgroundImage}
            //   repeat={true}
            volume={1}
        />
        <View className='flex-row justify-end p-2 '>
            <View className='bg-zinc-800/70 py-1 px-3 rounded-full'>
                <View className='mb-1 flex-row items-center gap-1'>
                    <FontAwesome name="location-arrow" size={14} color="white" />
                    <Text className='text-white text-base font-medium'>{country}</Text>
                </View>
            </View>
        </View>
    </Pressable>
);

/**
* STYLES
*/
const styles = StyleSheet.create({
    container: {
        height: CARD_HEIGHT
    },
    card: {
        backgroundColor: '#fff',
        width: CARD_WIDTH,
        marginLeft: MARGIN_LEFT,
        marginRight: MARGIN_RIGHT,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
});