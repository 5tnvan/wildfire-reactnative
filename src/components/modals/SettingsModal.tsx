import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Ionicons } from '@expo/vector-icons';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { supabase } from '@/src/lib/supabase';

type Props = {
    visible: any,
    data?: any
    onClose: any,
};

export function SettingsModal({ visible, data, onClose }: Props) {
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
            <View className="">
                <View className='flex-row justify-between items-center px-2 py-4'>
                    <Ionicons
                        onPress={handleReset}
                        name="chevron-back"
                        size={22}
                        color={colorScheme == 'dark' ? 'white' : 'grey'}
                    />
                    <Text className='text-lg font-medium self-center'>Settings</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                <View className="justify-start h-full p-5">
                    <PressableAnimated className='items-center' onPress={() => supabase.auth.signOut()}><Text>Log out</Text></PressableAnimated>
                </View>
            </View>
        </Modal>

    );
}