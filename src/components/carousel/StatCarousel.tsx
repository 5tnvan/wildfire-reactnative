import React, { useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Dimensions, Pressable, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Avatar } from '../avatars/avatar';
import { calculateSum } from '../../utils/calculateSum';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { useIncomingTransactions } from '@/src/hooks/useIncomingTransactions';
import { useUserFeed } from '@/src/hooks/useUserFeed';

const CARD_WIDTH = Dimensions.get('window').width * 0.6;
const CARD_HEIGHT = 145
const MARGIN_LEFT = 1;
const MARGIN_RIGHT = 7;

const cardData = [
    // { id: '1', title: 'Total Views', stat: 0, cta: 'Create', icon: 'eye', avatar: false },
    { id: '2', title: '', stat: '', cta: 'View all levels', avatar: true },
    { id: '3', title: 'Balance', stat: 0, cta: 'View Wildpay', icon: 'coins' },
];

export default function StatCarousel() {
    const router = useRouter();
    const isFocused = useIsFocused(); // Get focused state

    //CONSUME PROVIDERS
    const { profile } = useAuthUser();

    //FETCH DIRECTLY
    const incomingRes = useIncomingTransactions(profile?.wallet_id);
    const { feed: userFeed, refetch: refetchUserFeed } = useUserFeed(profile?.id);

    //REFETCH PROVIDERS WHEN SCREEN IS IN FOCUS
    useEffect(() => {
        if (isFocused) refetchUserFeed();
    }, [isFocused]);

    
    //DYNAMICALLY GENERATE CARDS DATA
    // const sumOfViews = userFeed?.reduce((total: any, item: any) => total + item.views, 0);
    const highestLevel = profile?.levels.reduce((max: number, item: any) => item.level > max ? item.level : max, 0);
    const levelNames = ["noob", "creator", "builder", "architect", "visionary", "god-mode"];
    const levelName = levelNames[highestLevel] || "unknown";
    const balance = (calculateSum(incomingRes.ethereumData) + calculateSum(incomingRes.baseData)).toFixed(3);

    // cardData[0].stat = sumOfViews;
    cardData[0].title = 'Level ' + highestLevel;
    cardData[0].stat = levelName;
    cardData[1].stat = balance;

    /**
     * HANDLE PRESS EVENT
     */
    const handleCta = (id: any) => {
        switch (id) {
            case '1':
                router.push("/create")
                break;
            case '2':
                console.log('View all levels button pressed');
                break;
            case '3':
                Linking.openURL('https://www.wildpay.app');
                break;
            default:
                console.log('Button pressed');
        }
    };


    return (
        <FlatList
            data={cardData}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <Item id={item.id} title={item.title} stat={item.stat} cta={item.cta} icon={item.icon} avatar={item.avatar} profile={profile} onPress={handleCta} />}
            snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
            decelerationRate="fast" // Make the scrolling feel snappier
            contentContainerStyle={styles.container}
            snapToAlignment="start" // Snap to the start of the card
        />
    );
};

type Props = {
    id: any,
    title: any,
    stat: any,
    cta: any,
    icon: any,
    avatar: any,
    profile: any,
    onPress: any,
};

const Item = ({ id, title, stat, cta, icon, avatar, profile, onPress }: Props) => (
    <Pressable style={styles.card} className='flex-row' onPress={() => onPress(id)}>
        <View className=''>
            <Text className='text-lg font-medium mb-1'>{title}</Text>
            <Text className={`text-4xl font-bold ${id == 1 ? 'text-accent' : 'text-secondary'} mb-2`}>{stat}</Text>
            <View className='bg-accent px-5 py-1 rounded-full'>
                <Text className='font-semibold'>{cta}</Text>
            </View>
        </View>
        <View className='grow items-end'>
            {avatar &&
                <View>
                    <View className='absolute z-10 right-1 w-3 h-3 bg-green-400 rounded-full'></View>
                    <Avatar avatar_url={profile?.avatar_url} username={profile?.username} size={'md'} ring={true}></Avatar>
                </View>
            }
            <FontAwesome5 name={icon} size={30} color="black" />
        </View>
    </Pressable>
);

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
