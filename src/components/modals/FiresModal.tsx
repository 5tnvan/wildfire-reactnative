import { Modal, Pressable, ScrollView, TouchableOpacity, useColorScheme } from 'react-native';
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

type Props = {
    visible: any,
    data: any
    onClose: any,
};

export function FiresModal({ visible, data, onClose }: Props) {
    const colorScheme = useColorScheme();
    const isFocused = useIsFocused(); // Get focused state
    const router = useRouter();
    const [fires, setFires] = useState<any>();

    const handleReset = () => {
        onClose();
    }

    // HANDLE WHEN IN FOCUSED
    useEffect(() => {
        const fetchProfiles = async () => {
            const { data: res } = await supabase
                .from("3sec_fires")
                .select("id, profile:user_id(id, username, avatar_url)")
                .eq("video_id", data.id)
            setFires(res);
        }
        if (isFocused) {
            fetchProfiles();
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
                        color={colorScheme == 'dark' ? 'white' : 'black'}
                    />
                    <Text className='text-lg font-medium self-center'>Fires</Text>
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
                    
                    {fires?.map((item: any, index: any) => (
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
                    ))}
                </ScrollView>

            </View>
        </Modal>

    );
}