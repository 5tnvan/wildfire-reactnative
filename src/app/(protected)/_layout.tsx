import React from 'react';
import Colors from '@/src/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Avatar } from '@/src/components/avatars/avatar';
import { Redirect, Stack, Tabs, useSegments } from 'expo-router';
import { useColorScheme } from '@/src/components/useColorScheme';
import { useClientOnlyValue } from '@/src/components/useClientOnlyValue';
import { useAuth } from '../../services/providers/AuthProvider';
import AuthUserProvider, { useAuthUser } from '../../services/providers/AuthUserProvider';
import AuthUserFollowsProvider from '@/src/services/providers/AuthUserFollowsProvider';
import AuthUserNotificationProvider, { useAuthUserNotifications } from '@/src/services/providers/AuthUserNotificationProvider';
import { View, Text } from 'react-native';
import Push from '@/src/components/Push';

/** 
 * TAB BAR ICON
 * Icons: https://icons.expo.fyi/
 * **/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) {
  return <AntDesign size={28} style={{ marginBottom: -3 }} {...props} />;
}

/** 
 * PROTECTED LAYOUT NAVIGATION
 * **/
function ProtectedLayoutNav() {
  const segment = useSegments();
  const colorScheme = useColorScheme();

  //CONSUME PROVIDERS
  const { profile } = useAuthUser();
  const { isLoading, followersNotifications, firesNotifications, commentsNotifications, refetch } = useAuthUserNotifications();

  // Check each notification array before spreading and filtering
const unreadNotifications = [
  ...(followersNotifications || []),
  ...(firesNotifications || []),
  ...(commentsNotifications || []),
].filter((notification) => notification && !notification.read);

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
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color}
           />
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <TabBarIcon name="pluscircleo" color={color} />,
        }}
      />
      <Tabs.Screen
        name="threesecs"
        options={{
          title: '3 sec',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <MaterialIcons name="123" style={{ marginBottom: -3 }} size={40} color={color} />,
          tabBarStyle: { display: segment[1] === "threesecs" ? 'none' : 'flex' } //hide tab bar for this screen
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => <MaterialIcons name="app-shortcut" style={{ marginBottom: -3 }} size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: () => null,
          tabBarIcon: ({ color }) => 
            <View>
              <Avatar avatar_url={profile?.avatar_url} username={profile?.username} size={'sm'} ring={true} />
              {unreadNotifications && unreadNotifications.length > 0 && <View className="absolute right-0 top-0 w-6 h-6 rounded-full bg-red-600 items-center justify-center" style={{ right: -10, top: -2}}>
                <Text className='text-xs text-white font-bold'>{unreadNotifications.length}</Text>
              </View>}
            </View>
          ,
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

  if (!isAuthenticated) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <>
    <AuthUserProvider>
      <AuthUserNotificationProvider>
        <AuthUserFollowsProvider>
            <ProtectedLayoutNav />
            <Push />
        </AuthUserFollowsProvider>
      </AuthUserNotificationProvider>
    </AuthUserProvider>
    </>
    
  );
}
