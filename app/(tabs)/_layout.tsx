import { Tabs } from 'expo-router';
import React from 'react';
import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#0F6E56',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          borderTopWidth: 0.5,
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="chat" options={{ title: 'Chat' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}