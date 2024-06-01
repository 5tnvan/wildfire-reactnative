import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { supabase } from '@/src/lib/supabase';
import { useFollowerNotifications } from '@/src/hooks/useFollowersNotification';
import { useAuthUserNotifications } from '@/src/services/providers/AuthUserNotificationProvider';
import { useRouter } from 'expo-router';
import { Avatar } from '../avatars/avatar';
import { markAsRead } from '@/src/utils/markAsRead';
import { markAllAsRead } from '@/src/utils/markAllAsRead';
import { useAuth } from '@/src/services/providers/AuthProvider';
import { fetchFollowersReadNotifications } from '@/src/utils/fetch/fetchFollowersNotifications';
import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { TimeAgo } from '../TimeAgo';

type Props = {
    visible: any,
    data?: any
    onClose: any,
};

export function NotificationModal({ visible, data, onClose }: Props) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const isFocused = useIsFocused(); // Get focused state

    //CONSUME PROVIDERS
    const { user } = useAuth();
    const { isLoading, followersNotifications, refetch } = useAuthUserNotifications();

    //STATES
    const [readNotifications, setReadNotifications] = useState<any>(null);

    const handleReset = () => {
        setReadNotifications(null);
        onClose();
    }
    const handleLoadPrevious = async () => {
        const res = await fetchFollowersReadNotifications(user?.id);
        setReadNotifications(res);
    }

    //REFETCH DATA WHEN SCREEN IS FOCUSED 
    useEffect(() => {
        if (isFocused) {
            console.log("FOCUS: notification modal")
            setReadNotifications(null);
        }
    }, [isFocused]);

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={visible}
            onRequestClose={handleReset}
        >
            <View className="flex-1">
                <View className='flex-row justify-between items-center px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color={colorScheme == 'dark' ? 'white' : 'grey'}
                    />
                    <Text className='text-lg font-medium self-center'>Notifications</Text>
                    <Pressable
                        onPress={() => {
                            markAllAsRead(user?.id);
                            handleReset()
                        }}>
                        <Text className='text-sm font-medium self-center'>Clear all</Text>
                    </Pressable>
                </View>
                <ScrollView className="flex-1 flex-col h-full px-2">
                    {/* UNREAD NOTIFICATIONS */}
                    {followersNotifications && followersNotifications.map((notification: any) => (
                        <Pressable
                            key={notification.id}
                            onPress={() => {
                                markAsRead(notification.id)
                                handleReset();
                                router.push("/(profile)/" + notification.follower.username)
                            }}
                            className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2 my-1`}
                        >
                            <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                <Avatar avatar_url={notification.follower.avatar_url} username={notification.follower.username} size={'sm'} ring={true} />
                                <Text className="text-base ml-2 text-accent ont-medium">{notification.follower.username}</Text>
                                <Text className='ml-1 text-base'>is following you</Text>
                            </View>

                            {notification.follower_read == false && <View className='py-1 px-2 rounded-full' ><Text className='text-sm'>Check</Text></View>}
                        </Pressable>
                    ))}
                    {/* READ NOTIFICATIONS */}
                    {readNotifications && readNotifications.length > 0 &&
                        readNotifications.map((notif: any) => (
                            <Pressable
                                key={notif.id}
                                onPress={() => {
                                    handleReset();
                                    router.push("/(profile)/" + notif.follower.username)
                                }}
                                className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2 my-1`}
                            >
                                <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                    <Avatar avatar_url={notif.follower.avatar_url} username={notif.follower.username} size={'sm'} ring={true} />
                                    <Text className="text-base ml-2 text-accent ont-medium">{notif.follower.username}</Text>
                                    <Text className='ml-2 text-base'>is following you</Text>
                                </View>
                                <Text className=''><TimeAgo timestamp={notif.follower_created_at}></TimeAgo></Text>
                            </Pressable>
                        ))

                    }
                    {/* BUTTON: Load Previous */}
                    <PressableAnimated className="items-center self-center text-center my-1" onPress={handleLoadPrevious}><Text className=''>Load Previous</Text></PressableAnimated>
                </ScrollView>
            </View>
        </Modal>

    );
}