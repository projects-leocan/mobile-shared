import ScrollPicker from 'react-native-wheel-scrollview-picker';
import React from 'react';
import { View, Text } from 'react-native';
import { greyDk, greyLt } from 'rc-mobile-base/lib/styles';


const hourSelect = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
const selectMinute = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59']


function TimeSelectComponent({ handleTImeCOnfirm, selectedTime }) {
    return (
        <View style={{
            width: "100%", flexDirection: "row", borderWidth: 1,
            borderColor: '#cfd4de', justifyContent: "center", alignItems: "center"
        }}>
            <View style={{ backgroundColor: "red", width: "40%" }}>
                <ScrollPicker
                    dataSource={hourSelect}
                    selectedIndex={selectedTime.hr}
                    onValueChange={(data, selectedIndex) => {
                        handleTImeCOnfirm('hour', data)
                    }}
                    wrapperHeight={200}
                    itemHeight={40}
                    wrapperColor='#fff'
                    highlightBorderWidth={2}
                    highlightColor="#4d4f52"
                />
            </View>
            <View style={{ width: "20%" }}>
                <Text style={{ alignSelf: "center" }}>:</Text>
            </View >
            <View style={{ width: "40%", flexDirection: "row" }}>
                <ScrollPicker
                    dataSource={selectMinute}
                    selectedIndex={selectedTime.min}
                    onValueChange={(data, selectedIndex) => {
                        handleTImeCOnfirm('min', data)
                    }}
                    wrapperHeight={200}
                    itemHeight={40}
                    wrapperColor='#fff'
                    highlightBorderWidth={2}
                    highlightColor="#4d4f52"
                />
            </View>
        </View>
    )
}


export default TimeSelectComponent