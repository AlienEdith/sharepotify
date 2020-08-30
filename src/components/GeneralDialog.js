import React from "react";
import { View } from "react-native";

import Dialog from "react-native-dialog";

const GeneralDialog = ({dialogVisible, handleClick, title, description}) => {

    return (
        <View>
          <Dialog.Container visible={dialogVisible}>
            <Dialog.Title>{title}!</Dialog.Title>
            <Dialog.Description>
              {description}
            </Dialog.Description>
            <Dialog.Button label="OK" onPress={handleClick}/>
          </Dialog.Container>
        </View>
    )
};

export default GeneralDialog;
