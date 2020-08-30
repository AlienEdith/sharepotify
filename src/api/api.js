import axios from 'axios';

const getUserProfileInfo = async (accessToken) => {
    let userInfo = await axios.get(`https://api.spotify.com/v1/me`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });
    return userInfo.data;
}

const getUserTopArtistOrTracks = async (accessToken, type, limit) => {
    let userInfo = await axios.get(`https://api.spotify.com/v1/me/top/${type}?limit=${limit}`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });
    return userInfo.data.items;
}

const getUserTopTaste = async (accessToken) => {
    const topTracks = [], topArtists = []
    const topTracksResult = await getUserTopArtistOrTracks(accessToken, 'tracks', 20);
    topTracksResult.forEach((item) => topTracks.push(item.id))
    const topArtistResult = await getUserTopArtistOrTracks(accessToken, 'artists', 5);
    topArtistResult.forEach((item) => topArtists.push(item.id))
    return {
        topTracks, topArtists
    }
}

const getRecommendationsByTracks = async (accessToken, seedTracksArr) => {
    const seed_tracks = seedTracksArr.join(',')
    const response = await axios.get("https://api.spotify.com/v1/recommendations", {
        params: {
            limit: 20,
            seed_tracks
        },
        headers: { "Authorization": `Bearer ${accessToken}` }
    })

    const recommendationsTracks = [];
    response.data.tracks.forEach((track) => 
        recommendationsTracks.push({
            uri: track.uri, 
            name: track.name,
            artist: track.artists[0].name,
            previewUrl: track.preview_url,
            isPlayable: track.is_playable

    }));
    
    return recommendationsTracks;
}

const createPlayListToUser = async (userId, accessToken, name) => {
    const response = await axios.post(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        name
    }, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    })
    return response.data.id
}

const addTracksToPlayLists = async (playListId, accessToken, tracks) => {
    let response = await axios.post(`https://api.spotify.com/v1/playlists/${playListId}/tracks`, {
        uris: tracks
    }, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    })
    return response.data
}


export {
    getUserProfileInfo,
    getUserTopTaste,
    createPlayListToUser,
    addTracksToPlayLists,
    getRecommendationsByTracks
}