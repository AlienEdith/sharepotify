import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';

import { Button } from 'react-native-paper';

import { getUserProfileInfo, getUserTopTaste } from '../api/api'

const { width, height } = Dimensions.get("window");

export default function App({ navigation }) {

    const [userInfo, setUserInfo] = useState({})
    const [mainUserInfo, setMainUserInfo] = useState({})

    const CLIENT_ID = "7d63d46e483a43e582df7b3a846bc055"

    const AuthRequestConfig = {
      responseType: "token",
      clientId: CLIENT_ID,
      redirectUri: AuthSession.getRedirectUrl(),
      prompt: "Login",
      scopes: [
        'user-top-read', 
        'playlist-modify-public'
      ]
    }

    const DiscoveryDocument = {
      authorizationEndpoint: 'https://accounts.spotify.com/authorize'
    }

    const handleSpotifyLogin = async (userNumber) => {

      const request = new AuthSession.AuthRequest(AuthRequestConfig);
      const results = await request.promptAsync(DiscoveryDocument, { useProxy: true });

      if (results.type !== 'success') {
        console.log(results.type);
      } else {
        let userProfileInfo = await getUserProfileInfo(results.params.access_token) 
        let userTopTaste = await getUserTopTaste(results.params.access_token)
        if(userNumber === Number(1)){
          setUserInfo({
            profileImage: (userProfileInfo.images.length>0)? userProfileInfo.images[0].url : "No Image",
            username: userProfileInfo.display_name,
            topTracks: userTopTaste.topTracks,
            topArtists: userTopTaste.topArtists
          }) 
        }else if(userNumber === Number(2)){
          setMainUserInfo({
            accessToken: results.params.access_token,
            userId: userProfileInfo.id,
            username: userProfileInfo.display_name,
            profileImage: (userProfileInfo.images.length>0)? userProfileInfo.images[0].url : "No Image",
            topTracks: userTopTaste.topTracks,
            topArtists: userTopTaste.topArtists
          })
        }
       
      }
    }
    
    const renderUserButton = (profileImage) => {
      if(!profileImage){
        return <Text>Login</Text>
      }else if(profileImage === "No Image"){
        return <Image style={styles.image} resizeMode='cover' source={require('../../assets/profile.jpg')} />
      }else return <Image style={styles.image} resizeMode='cover' source={{uri: profileImage}} /> 
    }

    // TODOs: styling
    return (  
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.mainUserButton} onPress={() => handleSpotifyLogin(Number(2))}
        >
          {renderUserButton(mainUserInfo.profileImage)}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.userButton} onPress={() => handleSpotifyLogin(Number(1))}
        >
          {renderUserButton(userInfo.profileImage)}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} 
          onPress={() => (mainUserInfo.username && userInfo.username)?navigation.navigate("Mix", {userInfo, mainUserInfo}) : Alert.alert("Please Login Two Users First")}
        >
          <Text>Mix</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mainUserButton: {
    backgroundColor: '#F4F1BB',
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width*0.4/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userButton: {
    backgroundColor: '#F4F1BB',
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width*0.3/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: "100%",
    height: "100%",
    // borderRadius: /2,
  }
});
