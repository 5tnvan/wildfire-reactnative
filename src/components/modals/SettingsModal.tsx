import { Alert, Linking, Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Entypo, Ionicons } from '@expo/vector-icons';
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
                <View className="justify-start h-full p-5 gap-2">
                    <PressableAnimated className='items-center' onPress={() => supabase.auth.signOut()}><Text className='font-semibold'>Log out </Text><Entypo name="log-out" size={14} color={colorScheme == 'dark' ? 'white' : 'grey'} /></PressableAnimated>
                    <PressableAnimated className='items-center' onPress={() => 
                    {                       
                        Alert.alert("Visit https://www.3seconds.me/account/delete-account to delete account");
                        (Linking.openURL('https://www.3seconds.me/account/delete-account'))
                    }                        
                    }><Text>Delete account</Text></PressableAnimated>
                    <PressableAnimated className='items-center' onPress={() => 
                    {                       
                        Alert.alert("Visit https://www.3seconds.me/account/delete-data to delete data");
                        (Linking.openURL('https://www.3seconds.me/account/delete-data'))
                    }                        
                    }><Text>Delete data, keep account</Text></PressableAnimated>
                </View>
            </View>
        </Modal>

    );
}