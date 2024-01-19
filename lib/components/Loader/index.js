import React from "react";
import { Modal, ActivityIndicator, View } from "react-native";
import styles from "./styles";
import { primaryBlue } from "../../styles/Colors";

const Loader = ({loading}) => {

    return (
        <Modal
            transparent
            animationType="fade"
            visible={loading}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <ActivityIndicator size="large" color={"#EF7373"} />
                </View>
            </View>
        </Modal>
    )
}

export default Loader
