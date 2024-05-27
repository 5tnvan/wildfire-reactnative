import { Modal, Pressable, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { fetchCountriesMatchingWith } from '@/src/utils/fetch/fetchCountries';
import { Entypo, Ionicons, SimpleLineIcons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { supabase } from '@/src/lib/supabase';
import { Avatar } from '../avatars/avatar';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import FormatNumber from '../FormatNumber';
import { useAuth } from '@/src/services/providers/AuthProvider';
import { useUser } from '@/src/hooks/useUser';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
    visible: any,
    data: any
    onClose: any,
};

export function CommentsModal({ visible, data, onClose }: Props) {
    const colorScheme = useColorScheme();
    const isFocused = useIsFocused(); // Get focused state
    const router = useRouter();
    const { profile } = useAuthUser();
    const [fires, setFires] = useState<any>();
    const [comment, setComment] = useState('');

    console.log("mothehrhr", JSON.stringify(data, null, 2))
    console.log("fires", fires)



    const handleReset = () => {
        onClose();
    }

    // HANDLE WHEN IN FOCUSED
    useEffect(() => {
        const fetch = async () => {

            // const { data: res } = await supabase
            //     .from("3sec_fires")
            //     .select("id, profile:user_id(id, username, avatar_url)")
            //     .eq("video_id", data.id)
            // setFires(res);
        }

        if (isFocused) fetch();
    }, [isFocused]);

    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            // Insert the comment to supabase
            const { data: res, error } = await supabase
                .from('comments')
                .insert([{ video_id: data.id, user_id: profile.id, content: comment }])
            
            if (error) {
                console.error("Error submitting comment:", error);
            } else {
                // Clear the input after submission
                setComment('');
                // Optionally, refetch the comments to update the list
                // fetchComments();
            }
        }
    };

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={visible}
            onRequestClose={handleReset}
        >
            <View className="h-full">
                <View className='flex-row justify-between items-center px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color={colorScheme == 'dark' ? 'white' : 'black'}
                    />
                    <Text className='text-lg font-medium self-center'>Comments</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                {/* VIDEO THUMBNAIL */}
                <View className='justify-center items-center'>
                    <Image
                        source={{ uri: data.thumbnail }}
                        resizeMode="cover"
                        style={{ width: 120, height: 200 }}
                        className='rounded-2xl mb-5'
                    />
                    <Pressable className="flex-row items-center mb-5">
                        <SimpleLineIcons name="fire" size={24} color="red" />
                        <Text className="ml-1 font-medium text-base"><FormatNumber number={fires?.length} /></Text>
                    </Pressable>
                </View>

                <ScrollView className="px-2">

                    {/* {fires?.map((item: any, index: any) => (
                        <TouchableOpacity
                            key={item.id}
                            onPress={() => {
                                handleReset();
                                router.push("/(profile)/" + item.profile.username)
                            }}
                            className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full w-full px-4 py-2 mb-2`}
                        >
                            <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                <Avatar avatar_url={item.profile.avatar_url} username={item.profile.username} size={'sm'} ring={true} />
                                <Text className="text-base ml-4">{item.profile.username}</Text>
                            </View>

                            <Entypo name="chevron-right" size={24} color={colorScheme == 'dark' ? 'white' : 'grey'} />
                        </TouchableOpacity>
                    ))} */}
                </ScrollView>

                {/* COMMENT INPUT */}
                <SafeAreaView className='absolute bottom-0 w-full px-4 pb-4'>
                        <View className='flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2'>
                            <Avatar avatar_url={profile.avatar_url} username={profile.username} size={'sm'} ring={true} />
                            <TextInput
                                style={{ flex: 1, marginLeft: 10 }}
                                placeholder="Add a comment..."
                                placeholderTextColor={colorScheme == 'dark' ? '#ccc' : '#999'}
                                value={comment}
                                onChangeText={setComment}
                                onSubmitEditing={handleCommentSubmit}
                                returnKeyType="send"
                            />
                            <Pressable onPress={handleCommentSubmit}>
                                <Ionicons name="send" size={24} color={colorScheme == 'dark' ? 'white' : 'black'} />
                            </Pressable>
                        </View>
                    </SafeAreaView>

            </View>
        </Modal>

    );
}