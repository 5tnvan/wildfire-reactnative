import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { fetchProfileMatchingWith } from '@/src/utils/fetch/fetchProfile';
import { Avatar } from '../avatars/avatar';
import { useRouter } from 'expo-router';

type Props = {
    visible: any,
    onClose: any,
};

export function SearchUserModal({ visible, onClose }: Props) {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const [searchValue, setSearchValue] = useState("");
    const [profiles, setProfiles] = useState<any>([]);

    const handleReset = () => {
        setSearchValue("");
        onClose();
    }

    useEffect(() => {
        const fetch = async () => {
            const profiles = await fetchProfileMatchingWith(searchValue);
            setProfiles(profiles);
        }
        fetch();
    }, [searchValue]);

    return (
        <Modal
            animationType="slide"
            presentationStyle="formSheet"
            visible={visible}
            onRequestClose={handleReset}
        >
            <View className="">
                <View className='flex-row justify-between items-center bg-zinc-900 px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color="white"
                    />
                    <Text className='text-lg font-medium self-center'>Search a user</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                <View className="pt-3">
                    <Input
                        leftIcon={{ type: 'font-awesome-6', name: 'person' }}
                        onChangeText={(text) => setSearchValue(text)}
                        value={searchValue}
                        placeholder="Enter name"
                        autoCapitalize={'none'}
                        className={`${colorScheme == 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                    />
                </View>
                <ScrollView className="flex flex-col gap-2 h-full">
                    {profiles && profiles.map((profile: any) => (
                        <Pressable
                            key={profile.id}
                            onPress={() =>{ 
                                handleReset();
                                router.push("/(profile)/" + profile.username)
                            }}
                            className={`flex-row items-center justify-between ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-full px-4 py-2`}
                        >
                            <View className={`flex-row items-center pl-1 ${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'}`}>
                                <Avatar avatar_url={profile.avatar_url} username={profile.username} size={'md'} ring={true} />
                                <Text className="text-white text-base ml-4">{profile.username}</Text>
                            </View>
                            
                            <Entypo name="chevron-right" size={24} color="white" />
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </Modal>

    );
}