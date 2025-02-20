import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { FontAwesome6 } from "@expo/vector-icons";
import '../../global.css';

const StoragePage = () => {
  const [recordings, setRecordings] = useState([]);
  const [sound, setSound] = useState(null);

  useEffect(() => {
    const loadRecordings = async () => {
      try {
        const savedRecordings = await AsyncStorage.getItem("recordings");
        if (savedRecordings) {
          setRecordings(JSON.parse(savedRecordings));
        }
      } catch (err) {
        console.error("Failed to load recordings:", err);
      }
    };
    loadRecordings();
  }, []);

  const playRecording = async (uri) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
    } catch (err) {
      console.error("Failed to play recording:", err);
    }
  };

  const deleteRecording = async (uri) => {
    try {
      const updatedRecordings = recordings.filter((rec) => rec !== uri);
      await AsyncStorage.setItem(
        "recordings",
        JSON.stringify(updatedRecordings)
      );
      setRecordings(updatedRecordings);
    } catch (err) {
      console.error("Failed to delete recording:", err);
    }
  };

  const renderItem = ({ item, index }) => (
    <View className="flex-row relative">
      <TouchableOpacity
        activeOpacity={0.8}
        className="bg-black w-full mt-[0.5rem] h-[2.5rem] rounded-[12px] 
        justify-between pl-[2rem] items-center flex-row"
        onPress={() => playRecording(item)}
      >
        <Text className="text-white text-left">Play Recording {index + 1}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="absolute top-3 right-4"
        onPress={() => deleteRecording(item)}
      >
        <FontAwesome6 name="delete-left" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 p-[0.5rem] bg-[#e0e1dd]">
      {recordings.length === 0 ? (
        <Text className="text-sm text-center">No recordings saved yet.</Text>
      ) : (
        <FlatList
          data={recordings}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default StoragePage;
