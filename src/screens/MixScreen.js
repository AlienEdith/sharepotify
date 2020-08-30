import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { FAB } from 'react-native-paper';

import { getRecommendationsByTracks, createPlayListToUser, addTracksToPlayLists } from '../api/api'

import SongList from '../components/SongList'
import InputDialog from '../components/InputDialog'
import GeneralDialog from '../components/GeneralDialog'

const { width, height } = Dimensions.get("window");

export default function MixScreen({ route }) {
    const userInfo = route.params.userInfo;
    const mainUserInfo = route.params.mainUserInfo

    const [regenerateFlag, setRegenerateFlag] = useState(false);

    const [inputDialogVisible, setInputDialogVisible] = useState(false);
    const [infoDialog, setInfoDialog] = useState(false);

    const [playlistName, setPlaylistName] = useState(`MixTape feat. ${userInfo.username}, ${mainUserInfo.username}`)
    const [recommendationsTracks, setRecommendationsTracks] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);

    const createPlayList = async () => {
        const recommendationsUris = []
        recommendationsTracks.forEach((track) => recommendationsUris.push(track.uri));
       
        try {
            const playListId = await createPlayListToUser(mainUserInfo.userId, mainUserInfo.accessToken, playlistName)
            const response = await addTracksToPlayLists(playListId, mainUserInfo.accessToken, recommendationsUris)
            return response
        } catch (error) {
            console.log(error)
        }
    } 

    const handleSubmit = async () => {
        await setInputDialogVisible(false);
        const response = await createPlayList();
        if(response && response.snapshot_id){
            setInfoDialog({
                dialogVisible: true, 
                title: 'Congratulations!', description: 'The Playlist has been created, please check your Spotify!'
            })
        }else{
            setInfoDialog({
                dialogVisible: true, 
                title: 'Sorry!', description: 'Error occurs during create the playlist, please try again.'
            })
        }
    }

    const getRecommendations = async () => {
        const userTracks = userInfo.topTracks;
        const mainUserTracks = mainUserInfo.topTracks;
        const seedTrackArr = []

        // TODOs:
        seedTrackArr.push(userTracks[Math.floor(Math.random() * userTracks.length)])
        seedTrackArr.push(userTracks[Math.floor(Math.random() * userTracks.length)])
        seedTrackArr.push(mainUserTracks[Math.floor(Math.random() * mainUserTracks.length)])
        seedTrackArr.push(mainUserTracks[Math.floor(Math.random() * mainUserTracks.length)])
        seedTrackArr.push(mainUserTracks[Math.floor(Math.random() * mainUserTracks.length)])
        // console.log(seedTrackArr)

        const result = await getRecommendationsByTracks(mainUserInfo.accessToken, seedTrackArr);
        setRecommendationsTracks(result);
    }

    const regenerate = () => {
        setRegenerateFlag(!regenerateFlag)
    }

    useEffect(() => {
        getRecommendations()
    }, [regenerateFlag])

    return (  
        <View style={styles.container}>
            <SongList data={recommendationsTracks} isPlaying={isPlaying} setIsPlaying={setIsPlaying}/>
            <View style={styles.buttonContainer}>
                <FAB
                    style={styles.fab} icon="reload"
                    disabled={isPlaying}
                    onPress={regenerate}
                />
                <FAB
                    style={styles.fab} icon="playlist-play"
                    onPress={() => setInputDialogVisible(true)}
                />
            </View>

            <InputDialog 
                dialogVisible={inputDialogVisible} 
                handleTextChange={(name) => setPlaylistName(name)}
                text={playlistName}
                handleCancel={() => setInputDialogVisible(false)}
                handleSubmit={handleSubmit}
            />
            <GeneralDialog
                dialogVisible={infoDialog.dialogVisible}
                handleClick={() => setInfoDialog({...setInfoDialog, dialogVisible: false})}
                title={infoDialog.title? infoDialog.title : ""}
                description={infoDialog.description? infoDialog.description : ""}
            />

        </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-around',
  },
  fab: {
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
