import { Modal, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Avatar } from '../avatars/avatar';

type Props = {
    visible: any,
    data: any
    onClose: any,
};

export function FollowingModal({ visible, data, onClose }: Props) {
    const router = useRouter();
    const colorScheme = useColorScheme();

    const handleReset = () => {
        onClose();
    }

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={visible}
            onRequestClose={handleReset}
        >
            <View className="flex-1">
                {/* HEADER */}
                <View className='flex-row justify-between items-center px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color={colorScheme == 'dark' ? 'white' : 'black'}
                        style = {{paddingHorizontal: 10}}
                    />
                    <Text className='text-lg font-medium'>@{data.user?.username}</Text>
                    <Text>{`            `}</Text>
                </View>
                {/* SCROLLVIEW */}
                <ScrollView className="flex-col gap-2 px-2 h-full">
                        <Text className='text-lg self-center'><Text className='text-accent'>{data.following?.length}</Text> following</Text>
                        {data.following && data.following.map((following: any) => (
                            <TouchableOpacity
                                key={following.following.id}
                                onPress={() =>{ 
                                    handleReset();
                                    router.push("/(profile)/" + following.following.username)
                                }}
                                className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2`}
                            >
                                <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                    <Avatar avatar_url={following.following.avatar_url} username={following.following.username} size={'md'} ring={true} />
                                    <Text className="text-base ml-4">{following.following.username}</Text>
                                </View>
                                
                                <Entypo name="chevron-right" size={24} color={colorScheme == 'dark' ? 'white' : 'grey'} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
            </View>
        </Modal>

    );
}