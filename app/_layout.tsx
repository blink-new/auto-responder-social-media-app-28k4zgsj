import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { MessageCircle, Zap, Users, Settings } from 'lucide-react-native';
import { View } from 'react-native';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Tabs 
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            height: 85,
            paddingBottom: 20,
            paddingTop: 15,
          },
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#9CA3AF',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 5,
          },
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Zap size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="responses" 
          options={{
            title: 'Réponses',
            tabBarIcon: ({ color, size }) => (
              <MessageCircle size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="social" 
          options={{
            title: 'Réseaux',
            tabBarIcon: ({ color, size }) => (
              <Users size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen 
          name="settings" 
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ color, size }) => (
              <Settings size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen name="+not-found" options={{ href: null }} />
      </Tabs>
      <StatusBar style="auto" />
    </>
  );
}