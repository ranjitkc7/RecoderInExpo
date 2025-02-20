import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'


const LayoutPage = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#8338ec",
          borderBottomWidth: 2,
          borderBottomColor: "#000000",
        },
        headerTintColor: "#fff",
        tabBarStyle: {
          backgroundColor: "#ff006e",
          borderTopWidth: 0,
          shadowColor: "rgba(0, 0, 0, 0.05)",
          shadowOffset: { width: 0, height: 1 },
          shadowRadius: 4,
          elevation: 2,
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#d5bdaf",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Recorder",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="microphone" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="storage"
        options={{
          title: "Storage",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="storage" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

export default LayoutPage