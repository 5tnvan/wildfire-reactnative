import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Entypo, Ionicons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';
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
import { fetchFiresReadNotifications } from '@/src/utils/fetch/fetchFiresNotifications';
import { fetchCommentsReadNotifications } from '@/src/utils/fetch/fetchCommentsNotifications';

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
    const { isLoading, followersNotifications, firesNotifications, commentsNotifications, refetch } = useAuthUserNotifications();

    console.log("followersNotifications", followersNotifications);
    console.log("firesNotifications", firesNotifications);
    console.log("commentsNotifications", commentsNotifications);

    //STATES
    const [readNotifications, setReadNotifications] = useState<any>(null);

    const handleReset = () => {
        setReadNotifications(null);
        onClose();
    }
    const handleLoadPrevious = async () => {
        const followersRead = await fetchFollowersReadNotifications(user?.id) || [];
        const firesRead = await fetchFiresReadNotifications(user?.id) || [];
        const commentsRead = await fetchCommentsReadNotifications(user?.id) || [];

        const mergedReadNotifications = mergeAndSortNotifications(
            commentsRead.map((notification: any) => ({ ...notification, type: 'comment' })),
            firesRead.map((notification: any) => ({ ...notification, type: 'like' })),
            followersRead.map((notification: any) => ({ ...notification, type: 'follow' }))
        );

        setReadNotifications(mergedReadNotifications);
    };

    //REFETCH DATA WHEN SCREEN IS FOCUSED 
    useEffect(() => {
        if (isFocused) {
            console.log("FOCUSED: notification modal")
            setReadNotifications(null);
        }
    }, [isFocused]);

    // Merge and sort notifications by created_at
    const mergeAndSortNotifications = (comments: any[], fires: any[], followers: any[]) => {
        const allNotifications = [
            ...comments,
            ...fires,
            ...followers,
        ];
        return allNotifications.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    };

    const allUnreadNotifications = mergeAndSortNotifications(
        commentsNotifications.map((notification: any) => ({ ...notification, type: 'comment' })),
        firesNotifications.map((notification: any) => ({ ...notification, type: 'like' })),
        followersNotifications.map((notification: any) => ({ ...notification, type: 'follow' }))
    );

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
                    {allUnreadNotifications.map((notification: any) => (
                        <Pressable
                            key={notification.id}
                            onPress={() => {
                                markAsRead(notification.id)
                                handleReset();
                                router.push("/(profile)/" + notification.user.username)
                            }}
                            className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2 my-1`}
                        >
                            <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                <Avatar avatar_url={notification.user.avatar_url} username={notification.user.username} size={'sm'} ring={true} />
                                <Text className="text-base ml-2 text-accent ont-medium">{notification.user.username}</Text>
                                <Text className='ml-1 text-base'>
                                    {notification.type === 'comment' && 'commented on your post'}
                                    {notification.type === 'like' && 'liked your post'}
                                    {notification.type === 'follow' && 'is following you'}
                                </Text>
                            </View>

                            {notification.read == false && <View className='py-1 px-2 rounded-full' ><Text className='text-sm'>Check</Text></View>}
                        </Pressable>
                    ))}
                    {/* READ NOTIFICATIONS */}
                    {readNotifications && readNotifications.length > 0 &&
                        readNotifications.map((notif: any) => (
                            <Pressable
                                key={notif.id}
                                onPress={() => {
                                    handleReset();
                                    router.push("/(profile)/" + notif.user.username);
                                }}
                                className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2 my-1`}
                            >
                                <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                    <Avatar avatar_url={notif.user.avatar_url} username={notif.user.username} size={'sm'} ring={true} />
                                    <Text className="text-base ml-2 text-accent ont-medium">{notif.user.username}</Text>
                                    <Text className='ml-1 text-base'>
                                        {notif.type === 'comment' && 'commented on your post'}
                                        {notif.type === 'like' && 'liked your post'}
                                        {notif.type === 'follow' && 'is following you'}
                                    </Text>
                                </View>
                                <Text className=''><TimeAgo timestamp={notif.created_at}></TimeAgo></Text>
                            </Pressable>
                        ))
                    }
                    {/* BUTTON: Load Previous */}
                    <PressableAnimated className="items-center self-center text-center my-1" onPress={handleLoadPrevious}><Text className=''>Load Read</Text></PressableAnimated>
                </ScrollView>
            </View>
        </Modal>

    );
}