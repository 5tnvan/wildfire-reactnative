import { Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";
import { Text, View } from "@/src/components/Themed";
import { useEffect, useState } from "react";
import { fetchCountriesMatchingWith } from "@/src/utils/fetch/fetchCountries";
import { Input } from "react-native-elements";

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const [searchValue, setSearchValue] = useState("");
  const [countries, setCountries] = useState<any>([]);

  useEffect(() => {
    const fetch = async () => {
      const countries = await fetchCountriesMatchingWith(searchValue);
      setCountries(countries);
    }
    fetch();
  }, [searchValue]);

  return (
    <ScrollView className="px-2">
      <View className="mt-4">
        <Input
          leftIcon={{ type: 'font-awesome', name: 'location-arrow' }}
          onChangeText={(text) => setSearchValue(text)}
          value={searchValue}
          placeholder="Enter location"
          autoCapitalize={'none'}
          className={`${colorScheme == 'dark' ? 'text-gray-200' : 'text-gray-800'}`}
        />
      </View>
      <View className="flex flex-col gap-2">
        {countries && countries.map((country: any) => (
          <Pressable
            key={country.id}
            onPress={() => console.log(`Pressed: ${country.id}`)}
            className={`${colorScheme == 'dark' ? 'bg-zinc-800' : 'bg-neutral'} rounded-3xl px-5 py-3`}
          >
            <Text className="text-white text-base">{country.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

});
