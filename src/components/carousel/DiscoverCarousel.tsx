// import React from 'react';
// import { StyleSheet, FlatList, Dimensions, Pressable, View, TouchableHighlight, TouchableOpacity, useColorScheme } from 'react-native';
// import { FontAwesome6 } from '@expo/vector-icons';
// import { PressableAnimated } from '../pressables/PressableAnimated';
// import { Text } from '../../components/Themed'

// const CARD_WIDTH = Dimensions.get('window').width * 0.6;
// const MARGIN_LEFT = 3;
// const MARGIN_RIGHT = 3;

// const cardData = [
//     { id: '1', title: 'A time to remember', stat: '24hrs', icon: 'clock' },
//     // { id: '2', title: 'A person to follow', stat: 'Rising Star', icon: 'person' },
//     { id: '2', title: 'A country to visit', stat: '249', icon: 'location-arrow'}
// ];

// type ComponentProps = {
//     handlePress: (id: string) => void;
// };

// /**
// * COMPONENT
// */
// export default function DiscoverCarousel({ handlePress } : ComponentProps) {

//     const colorScheme = useColorScheme();
//     return (
//         <FlatList
//             data={cardData}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => <Item id={item.id} title={item.title} stat={item.stat} icon={item.icon} onPress={handlePress} colorScheme={colorScheme} />}
//             snapToInterval={CARD_WIDTH + MARGIN_LEFT + MARGIN_RIGHT} // Calculate the size for a card including marginLeft and marginRight
//             decelerationRate="fast" // Make the scrolling feel snappier
//             contentContainerStyle={styles.container}
//             snapToAlignment="start" // Snap to the start of the card
//         />
//     );
// };

// type ItemProps = {
//     id: any,
//     title: any,
//     stat: any,
//     icon: any,
//     onPress: (id: string) => void,
//     colorScheme: any,
// };

// /**
// * FLATLIST ITEM
// */
// const Item = ({ id, title, stat, icon, colorScheme, onPress }: ItemProps) => (
//     <PressableAnimated style={styles.card} className={`rounded-2xl pt-6 pb-5 ${colorScheme == 'dark' ? 'bg-zinc-900' : 'bg-white'}`} onPress={() => onPress(id)}>
//         <View className='flex-row justify-between items-center w-full'>
//             <Text className='text-lg font-medium'>{title}</Text>
//             <View><FontAwesome6 name={icon} size={22} color={colorScheme == 'dark' ? 'white' : 'black'} /></View>
//         </View>
//         <Text className={`text-4xl font-bold text-accent`}>{stat}</Text>
//     </PressableAnimated>
// );

// /**
// * STYLES
// */
// const styles = StyleSheet.create({
//     container: {

//     },
//     card: {
//         width: CARD_WIDTH,
//         marginLeft: MARGIN_LEFT,
//         marginRight: MARGIN_RIGHT,
//     },
// });
