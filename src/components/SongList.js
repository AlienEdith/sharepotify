import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import SongItem from './SongItem';

const SongList = ({data, isPlaying, setIsPlaying}) => {

    const renderItem = ({ item }) => {
        return (
            <SongItem 
                data={item} 
                otherIsPlaying={isPlaying}
                setOtherIsPlaying={setIsPlaying}
            />
        )
    }

    return (
        <View style={styles.container}>
            <FlatList style={{width: '100%', height: '100%'}}
                data={data}              
                renderItem={renderItem}    
                keyExtractor={item => item.uri}    
            />
         </View>
    ); 

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default SongList;
