import { KeyboardAvoidingView, Modal, Pressable, ScrollView, TextInput, TouchableOpacity, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { useEffect, useState } from 'react';
import { Entypo, Ionicons, SimpleLineIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { supabase } from '@/src/lib/supabase';
import { PressableAnimated } from '../pressables/PressableAnimated';
import { useAuth } from '@/src/services/providers/AuthProvider';

export function ThreeDotsModal({ visible, data, report, block, onClose }: any) {
    const { user } = useAuth();
    const colorScheme = useColorScheme();
    console.log("profile.id", user?.id);
    const handleReset = () => {
        onClose();
    }
    const handleReportSubmit = async () => {
        // Insert the comment to supabase
        console.log("profile.id", user?.id);
        const { error } = await supabase
            .from('user_reports')
            .insert({ "3sec_id": data.content_id, user_id: user?.id })
        if (error) {
            console.error("Error submitting report:", error);
        } else {
            alert("Thank you for reporting objectionable content. We will review this shortly.");
            handleReset();
        }
    };
    const handleBlock = async () => {
        console.log("profile.id", user?.id);
        console.log("blocked_id", data.blocking_id);
        // Insert the comment to supabase
        const { error } = await supabase
            .from('user_block')
            .insert({ user_id: user?.id, blocked_id: data.blocking_id })

        if (error) {
            console.error("Error blocking:", error);
        } else {
            alert("User has been blocked. They will not be able to contact you nor comment on your content.");
            handleReset();
        }
    };
    const handleUnblock = async () => {
        // Insert the comment to supabase
        const { error } = await supabase
            .from('user_block')
            .delete()
            .eq("user_id", user?.id)
            .eq("blocked_id", data.blocking_id)

        if (error) {
            console.error("Error unblocking:", error);
        } else {
            alert("User has been unblocked. They will be able contact you and comment on your content.");
            handleReset();
        }
    };
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
                    <Text className='text-lg font-medium self-center'>Actions</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                <View className='px-2'>
                    {report && (
                        <PressableAnimated className='flex-row justify-evenly py-3' onPress={handleReportSubmit}>
                            <Text className=''>Report objectionable content 🚩</Text>
                        </PressableAnimated>
                    )}
                    {block && data.isBlocked && (
                        <PressableAnimated className='flex-row justify-evenly py-3' onPress={handleUnblock}>
                            <Text className=''>Unblock user ↻</Text>
                        </PressableAnimated>
                    )}
                    {block && !data.isBlocked && (
                        <PressableAnimated className='flex-row justify-evenly py-3' onPress={handleBlock}>
                            <Text className=''>Block user ⊘</Text>
                        </PressableAnimated>
                    )}

                </View>
            </View>

        </Modal>
    );
}
