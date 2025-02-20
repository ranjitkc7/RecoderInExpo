import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  PermissionsAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import '../../global.css';
const ProfilePage = () => {

  const router = useRouter();

  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert("Permission to access microphone is required.");
        }
      } else {
        const { status } = await Audio.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access microphone is required.");
        }
      }
    };
    requestPermissions();
  }, []);

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });

      const recordingObject = new Audio.Recording();
      await recordingObject.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recordingObject.startAsync();
      setRecording(recordingObject);
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  const playRecording = async () => {
    try {
      if (!recordingUri) return;

      const { sound } = await Audio.Sound.createAsync({ uri: recordingUri });
      setSound(sound);
      await sound.playAsync();
    } catch (err) {
      console.error("Failed to play recording:", err);
    }
  };

  const saveRecording = async () => {
    try{
     if(!recordingUri) return;

     const existingRecordings = await AsyncStorage.getItem("recordings");
     const recordings = existingRecordings ? JSON.parse(existingRecordings) : [];

     recordings.push(recordingUri);
     await AsyncStorage.setItem("recordings", JSON.stringify(recordings));
     Alert.alert("Success!","Recording saved successfully!");
    }catch(err){
      console.error("Failed to save recording:", err);
    }
    saveRecording(uri);
  }
  return (
    <View className="flex-1 items-center p-[1rem] justify-center relative bg-[#e0e1dd]">
      <TouchableOpacity
        activeOpacity={0.7}
        className="h-[15rem] w-[15rem] bg-white justify-center
        items-center rounded-full"
      >
        <FontAwesome name="microphone" size={100} color={"black"} />
      </TouchableOpacity>
      <View
        className="flex-row h-[8rem] w-full mt-[3rem] justify-between"
      >
        <TouchableOpacity
          activeOpacity={0.7}
          className={`h-[4rem] w-[4rem] rounded-full bg-white
         items-center justify-center`}
          onPress={saveRecording}
        >
          <Fontisto name="favorite" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 h-[4rem]  bg-black rounded-md items-center justify-center"
          onPress={recording ? stopRecording : startRecording}
        >
          <Text className="text-white text-[1.3rem]">
            {recording ? "Stop Recording" : "Start Recording"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          className={`h-[4rem] w-[4rem] rounded-full bg-white
            items-center justify-center `}
        >
          <FontAwesome name="stop-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>
      {recordingUri && (
        <TouchableOpacity
          className="py-3 mt-[0.1rem] w-full bg-black rounded-md items-center justify-center"
          onPress={playRecording}
        >
          <Text className="text-white text-[1.3rem]">Play Recording</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        activeOpacity={0.7}
        className="h-[4rem] w-[4rem] bg-black
       rounded-full flex items-center justify-center absolute bottom-3 right-5"
        onPress={() => router.push("/storage")}
      >
        <FontAwesome name="bars" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePage;
