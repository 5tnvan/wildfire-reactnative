import { Modal, Pressable, ScrollView, useColorScheme } from 'react-native';
import { Text, View } from "@/src/components/Themed";
import { Input } from 'react-native-elements';
import { useEffect, useState } from 'react';
import { fetchCountriesMatchingWith } from '@/src/utils/fetch/fetchCountries';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    visible: any,
    onClose: any,
    passBack: (countryId: string, countryName: string) => void;
};

export function SetCountryModal({ visible, onClose, passBack }: Props) {
    const colorScheme = useColorScheme();
    const [searchValue, setSearchValue] = useState("");
    const [countries, setCountries] = useState<any>([]);

    const handleReset = () => {
        setSearchValue("");
        onClose();
    }

    useEffect(() => {
        const fetch = async () => {
            const countries = await fetchCountriesMatchingWith(searchValue);
            setCountries(countries);
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
                    <Text className='text-lg font-medium self-center'>Search country</Text>
                    <Text className='text-lg font-medium self-center'>{`     `} </Text>
                </View>
                <View className="pt-3">
                    <Input
                        leftIcon={{ type: 'font-awesome', name: 'location-arrow' }}
                        onChangeText={(text) => setSearchValue(text)}
                        value={searchValue}
                        placeholder="Enter location"
                        autoCapitalize={'none'}
                        className={`${colorScheme == 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
                    />
                </View>
                <ScrollView className="flex flex-col gap-2 h-full">
                    {countries && countries.map((country: any) => (
                        <Pressable
                            key={country.id}
                            onPress={() =>{ 
                                passBack(country.id, country.name); 
                                handleReset()
                            }}
                            className={`${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-3xl px-5 py-3`}
                        >
                            <Text className="text-white text-base">{country.name}</Text>
                        </Pressable>
                    ))}
                </ScrollView>
            </View>
        </Modal>

    );
}