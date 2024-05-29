import { Modal, Pressable, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { fetchCountriesMatchingWith } from '@/src/utils/fetch/fetchCountries';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { useRouter } from 'expo-router';
import { Avatar } from '../avatars/avatar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { useAuth } from '@/src/services/providers/AuthProvider';

type Props = {
    visible: any,
    data: any
    onClose: any,
};

export function FollowersModal({ visible, data, onClose }: Props) {
    const router = useRouter();
    const colorScheme = useColorScheme();
    const { user: authUser } = useAuth();

    const handleReset = () => {
        onClose();
    }

    const handleUnfollow = async () => {
        const { error } = await supabase
            .from("followers")
            .delete()
            .eq("follower_id", authUser?.id)
            .eq("following_id", data.user.id);
        if (!error) {
            handleReset();
        }
    }

    useEffect(() => {
        const fetch = async () => {
            
        }
        fetch();
    }, []);

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
                        <Text className='text-lg self-center'><Text className='text-accent'>{data.followers?.length}</Text> followers</Text>
                        {data.followers && data.followers.map((follower: any) => (
                            <TouchableOpacity
                                key={follower.follower.id}
                                onPress={() =>{ 
                                    handleReset();
                                    router.push("/(profile)/" + follower.follower.username)
                                }}
                                className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2`}
                            >
                                <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                    <Avatar avatar_url={follower.follower.avatar_url} username={follower.follower.username} size={'md'} ring={true} />
                                    <Text className="text-base ml-4">{follower.follower.username}</Text>
                                </View>
                                
                                <Entypo name="chevron-right" size={24} color={colorScheme == 'dark' ? 'white' : 'grey'} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
            </View>
        </Modal>

    );
}