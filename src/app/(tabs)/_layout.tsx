import { Tabs } from 'expo-router/js-tabs';

import {
  BicycleIcon,
  CartIcon,
  DocumentIcon,
  MapIcon,
  PersonIcon,
} from '@/components/icons';
import { TabBar } from '@/components/tab-bar/tab-bar';

/** Bottom tabs with the custom Figma tab bar; switching tabs shifts screens horizontally. */
export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      backBehavior="history"
      screenOptions={{ headerShown: false, animation: 'shift' }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Discover', tabBarIcon: ({ color }) => <BicycleIcon color={color} /> }}
      />
      <Tabs.Screen
        name="map"
        options={{ title: 'Map', tabBarIcon: ({ color }) => <MapIcon color={color} /> }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <CartIcon color={color} />,
          // The Figma cart (1:210) has the tab bar layer hidden and a back button instead.
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ color }) => <PersonIcon color={color} /> }}
      />
      <Tabs.Screen
        name="docs"
        options={{ title: 'Docs', tabBarIcon: ({ color }) => <DocumentIcon color={color} /> }}
      />
    </Tabs>
  );
}
