import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Audio } from 'expo-av';
import { FAB } from 'react-native-paper';

const SongList = ({data, otherIsPlaying, setOtherIsPlaying}) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackInstance, setPlaybackInstance] = useState(null);

    useEffect(() => {
        async function setAudioMode(){
            try {
                await Audio.setAudioModeAsync({
                  allowsRecordingIOS: false,
                  interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
                  playsInSilentModeIOS: true,
                  interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
                  shouldDuckAndroid: true,
                  staysActiveInBackground: true,
                  playThroughEarpieceAndroid: true
                })
                loadAudio()
            } catch (e) {
                console.log(e)
            }
        }

        if(data.previewUrl) setAudioMode()
        
        return async () => {
            if(playbackInstance) await playbackInstance.unloadAsync()
        }
    },[])
    
    const loadAudio = async () => {
        try {
          const playbackInstance = new Audio.Sound()
          const source = { uri: data.previewUrl }
          const status = { shouldPlay: isPlaying }
          await playbackInstance.loadAsync(source, status, false)
          playbackInstance.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
          setPlaybackInstance(playbackInstance)
        } catch (e) {
            console.log(e)
        }
    }

    const onPlaybackStatusUpdate = status => {
        if(status.didJustFinish){
            setIsPlaying(false);
            setOtherIsPlaying(false);
            loadAudio()
        }
    }

    const handlePlayPause = async () => {
        isPlaying ? await playbackInstance.pauseAsync() : await playbackInstance.playAsync()
        setIsPlaying(!isPlaying);
        setOtherIsPlaying(!isPlaying);
    }

    return (
        <View style={styles.container}>
            
            <Text style={styles.text}>{data.name.split('-')[0]} </Text>
            
            <FAB
                style={styles.fab}
                small
                disabled={!data.previewUrl || (otherIsPlaying && !isPlaying)}
                icon={isPlaying? "pause-circle-outline" : "play-circle-outline"}
                onPress={handlePlayPause}
            />

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 15,
    },
    fab: {
        // flex: 2
    },
});

export default SongList;
