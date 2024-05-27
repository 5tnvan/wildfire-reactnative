import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { fetchCountriesMatchingWith } from '@/src/utils/fetch/fetchCountries';
import { Ionicons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';

type Props = {
    visible: any,
    data: any
    onClose: any,
};

export function FollowsModal({ visible, data, onClose }: Props) {
    const colorScheme = useColorScheme();

    const handleReset = () => {
        onClose();
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
            <View className="">
                <View className='flex-row justify-between items-center px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color={colorScheme == 'dark' ? 'white' : 'black'}
                    />
                    <Text className='text-lg font-medium self-center'>@{data.username}</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                <View className="justify-center items-center h-full">
                    <PressableAnimated onPress={() => alert()}><Text>Unfollow</Text></PressableAnimated>
                </View>

            </View>
        </Modal>

    );
}