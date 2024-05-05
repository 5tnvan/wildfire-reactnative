import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Link, Tabs, useSegments } from 'expo-router';
import { Pressable } from 'react-native';
import { BlurView } from 'expo-blur';

import Colors from '@/src/app/constants/Colors';
import { useColorScheme } from '@/src/app/components/useColorScheme';
import { useClientOnlyValue } from '@/src/app/components/useClientOnlyValue';

/** 
 * TAB LAYOUT
 * Icons: https://icons.expo.fyi/
 * **/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

/** 
 * TAB LAYOUT
 * Entry Point to the app
 * **/
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const segment = useSegments();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, false),
      }}
      >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="skort"
        options={{
          title: 'Skort',
          tabBarIcon: ({ color }) => <MaterialIcons name="app-shortcut" size={24} color={color} />,
          tabBarStyle: { display: segment[1] === "skort" ? 'none' : 'flex'}
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Fontisto name="world-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="face-woman-profile" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
