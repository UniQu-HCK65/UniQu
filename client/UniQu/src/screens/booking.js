import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';

export default function Booking() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        setSelectedSlot('');
    };

    const handleSlotSelect = (slot) => {
        setSelectedSlot(selectedSlot === slot ? '' : slot);
    };

    const handleDropdownToggle = () => {
        setIsDropdownVisible(!isDropdownVisible);
    };

    return (
        <View style={styles.container}>
            <Calendar
                onDayPress={(day) => handleDateSelect(day)}
                markedDates={{
                    [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                }}
                style={{ margin: 20 }}
            />

            <View style={{ marginLeft: 40, marginBottom: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: '300' }}>Select session : </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => handleSlotSelect('09.00 - 10.00')}
                    style={[
                        styles.slotButton,
                        selectedSlot === '09.00 - 10.00' && styles.selectedSlotButton,
                    ]}
                >
                    <Text style={{ color: 'white' }}>09.00 - 10.00</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleSlotSelect('10.00 - 11.00')}
                    style={[
                        styles.slotButton,
                        selectedSlot === '10.00 - 11.00' && styles.selectedSlotButton,
                    ]}
                >
                    <Text style={{ color: 'white' }}>10.00 - 11.00</Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginLeft: 40, marginBottom: 10, marginTop: 30 }}>
                <Text style={{ fontSize: 20, fontWeight: '300' }}>Select Mall : </Text>
            </View>

            <View style={{ borderWidth: 0.5, marginBottom: 10, marginHorizontal: 40, borderRadius: 10 }}>
                <TouchableOpacity onPress={handleDropdownToggle} style={{ padding: 10 }}>
                    <Text style={styles.dropdownToggleText}>
                        {selectedLocation ? selectedLocation : 'Select Location'}
                    </Text>
                </TouchableOpacity>

                {isDropdownVisible && (
                    <Picker
                        selectedValue={selectedLocation}
                        onValueChange={(itemValue) => {
                            setSelectedLocation(itemValue);
                            setIsDropdownVisible(false); // Hide the dropdown after selection
                        }}
                        style={styles.picker}
                        itemStyle={styles.pickerItem}
                    >
                        <Picker.Item label="Select Location" value="" />
                        <Picker.Item label="Jakarta Barat" value="Jakarta Barat" />
                        <Picker.Item label="Jakarta Utara" value="Jakarta Utara" />
                        <Picker.Item label="Jakarta Selatan" value="Jakarta Selatan" />
                    </Picker>
                )}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, justifyContent: 'center' }}>
                <TouchableOpacity style={styles.submitButton}>
                    <Text style={{ color: 'white' }}>Submit</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    slotButton: {
        width: 150,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSlotButton: {
        backgroundColor: 'lightgrey',
    },
    dropdownToggle: {
        height: 50,
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginLeft: 10,
    },
    dropdownToggleText: {
        fontSize: 13,
        color: 'black',
    },
    picker: {
        height: 50,
        width: 200,
        borderRadius: 20,
        position: 'absolute',
        top: 60,
        left: 50,
    },
    pickerItem: {
        fontSize: 13,
        color: 'black',
    },
    submitButton: {
        width: 150,
        height: 50,
        backgroundColor: 'black',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    }
});
