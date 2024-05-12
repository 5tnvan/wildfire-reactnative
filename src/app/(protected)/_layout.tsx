import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { Redirect, Tabs, useSegments } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useAuth } from '../../services/providers/AuthProvider';
import AuthUserProvider, { useAuthUser } from '../../services/providers/AuthUserProvider';

/** 
 * TAB BAR ICON
 * Icons: https://icons.expo.fyi/
 * **/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={20} style={{ marginBottom: -3 }} {...props} />;
}

/** 
 * PROTECTED LAYOUT NAVIGATION
 * **/
function ProtectedLayoutNav() {
  const segment = useSegments();
  const colorScheme = useColorScheme();

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
          tabBarStyle: { display: segment[1] === "skort" ? 'none' : 'flex'} //hide tab bar for this screen
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
      {/* <Tabs.Screen name="modals/follows-modal" options={{ href: null }} /> */}
    </Tabs>
  );
}

/** 
 * PROTECTED LAYOUT
 * _layout for /(protected)
 * **/
export default function ProtectedLayout() {
  
  const { isAuthenticated, user } = useAuth();
  console.log("userId", user?.id);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <AuthUserProvider>
      <ProtectedLayoutNav />
    </AuthUserProvider>
  );
}
