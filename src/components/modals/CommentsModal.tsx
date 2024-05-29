import { KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { useEffect, useState } from 'react';
import { Entypo, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/src/lib/supabase';
import { Avatar } from '../avatars/avatar';
import { useIsFocused } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Image } from 'react-native';
import FormatNumber from '../FormatNumber';
import { useAuthUser } from '@/src/services/providers/AuthUserProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TimeAgo } from '../TimeAgo';

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
    const [comments, setComments] = useState<any>();
    const [comment, setComment] = useState('');

    const fetchComments = async () => {
        console.log("fetch comments")
        const { data: res } = await supabase
            .from("3sec_comments")
            .select("id, comment, created_at, profile:user_id(id, username, avatar_url)")
            .eq("video_id", data.id)
            .order('created_at', { ascending: false })
        setComments(res);
    }

    // HANDLE WHEN IN FOCUSED
    useEffect(() => {
        if (isFocused) fetchComments();
    }, [isFocused]);

    const handleReset = () => {
        onClose();
    }

    const handleCommentSubmit = async () => {
        if (comment.trim()) {
            // Insert the comment to supabase
            const { data: res, error } = await supabase
                .from('3sec_comments')
                .insert({ video_id: data.id, user_id: profile.id, comment: comment })

            if (error) {
                console.error("Error submitting comment:", error);
            } else {
                setComment(''); // Clear the input after submission
                fetchComments();
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
            <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} className={colorScheme == 'dark' ? 'bg-zinc-900' : 'bg-white'}>
                <View className="flex-1 ">
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
                            <MaterialCommunityIcons name="message-reply-text-outline" size={28} color={`${colorScheme == 'dark' ? "white" : '#333'}`} />
                            {comments?.length > 0 && 
                                <Text className="ml-1 font-medium text-base"><FormatNumber number={comments.length} /></Text>
                            }
                            {comments?.length == 0 && 
                                <Text className="ml-1 font-medium text-base">Be first to comment</Text>
                            }
                        </Pressable>
                    </View>

                    <ScrollView className="px-2">
                        {comments?.map((item: any, index: any) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => {
                                    handleReset();
                                    router.push("/(profile)/" + item.profile.username)
                                }}
                                className={`flex-row justify-between rounded-lg w-full px-2 py-2 mb-2`}
                            >
                                {/* AVATAR */}
                                <Avatar avatar_url={item.profile.avatar_url} username={item.profile.username} size={'sm'} ring={true} />
                                {/* TIME, COMMENTS */}
                                <Pressable className={`flex-col grow ml-2`}>
                                    <View className='flex-row justify-between'>
                                        <Text className="text-base font-semibold">{item.profile.username}</Text>
                                        <Text className=''><TimeAgo timestamp={item.created_at}></TimeAgo></Text>
                                    </View>
                                    <Text className='mt-2 text-base'>{item.comment}</Text>
                                </Pressable>
                                {/* ARROW */}
                                {/* <Pressable className='flex-row items-top'><Entypo name="chevron-right" size={18} color={colorScheme == 'dark' ? 'white' : 'grey'} /></Pressable> */}

                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    
                </View>
                {/* COMMENT INPUT */}
                <SafeAreaView className='fixed bottom-5 w-full px-4'>
                        <View className='flex-row items-center bg-zinc-100 dark:bg-zinc-800 rounded-full px-4 py-2'>
                            <Avatar avatar_url={profile.avatar_url} username={profile.username} size={'sm'} ring={true} />
                            <TextInput
                                style={{
                                    flex: 1,
                                    marginLeft: 10,
                                    color: colorScheme === 'dark' ? 'white' : 'black',
                                    maxHeight: 60,
                                }}
                                placeholder="Add a comment..."
                                placeholderTextColor={colorScheme === 'dark' ? '#ccc' : '#999'}
                                value={comment}
                                onChangeText={setComment}
                                multiline
                                returnKeyType="default"
                            />
                            <Pressable onPress={handleCommentSubmit}>
                                <MaterialCommunityIcons name="send-circle" size={32} color="grey" />
                            </Pressable>
                        </View>
                    </SafeAreaView>
            </KeyboardAvoidingView>
        </Modal>
    );
}
