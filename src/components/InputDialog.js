import React from "react";
import { View } from "react-native";

import Dialog from "react-native-dialog";

const InputDialog = ({dialogVisible, handleCancel, handleSubmit, text, handleTextChange}) => {

    return (
        <View>
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>Create A New PlayList</Dialog.Title>
            <Dialog.Description>
              Please enter the name for the Playlist 
            </Dialog.Description>
            <Dialog.Input onChangeText={handleTextChange} value={text} />
            <Dialog.Button label="Cancel" onPress={handleCancel}/>
            <Dialog.Button label="Submit" onPress={handleSubmit}/>
          </Dialog.Container>
        </View>
    )
};

export default InputDialog;
