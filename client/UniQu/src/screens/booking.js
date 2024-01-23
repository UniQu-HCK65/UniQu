import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { BOOKING_TALENT } from '../queries/query';
import { useMutation } from '@apollo/client';
import { SelectList } from "react-native-dropdown-select-list";

const session = [
    "10.00 - 15.00",
    "16.00 - 21.00"
];

const location = [
    "Jakarta Pusat",
    "Jakarta Barat",
    "Jakarta Timur",
    "Jakarta Selatan",
]

export default function Booking({ route, navigation }) {
    const talentId = route.params

    const [book, { loading, error, data }] = useMutation(BOOKING_TALENT);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    console.log(error)

    const handleBooking = async () => {
        const response = await book({
            variables: {
                newBooking: {
                    TalentId: talentId,
                    bookDate: selectedDate,
                    bookSession: selectedSlot,
                    bookLocation: selectedLocation
                }
            },
            onCompleted: (data) => {
                console.log(data.book._id, '<<< woiiiii id')
                 setSelectedDate('')
                 setSelectedSlot('')
                 setSelectedLocation('')
                navigation.navigate('Status Booking', {bookingId : data.book._id})
            },
            onError: (error) => {
                console.log(error)
            }
        })
        const error = JSON.stringify(response.errors.networkError.result.errors[0].message, null, 2)
        console.log(JSON.stringify(response, null, 2))
        if (error) {
            setErrorMessage(error.slice(1, -1))
        }
    };

    const handleDateSelect = (day) => {
        setSelectedDate(day.dateString);
        setSelectedSlot('');
    };


    return (
        <View style={styles.container}>
            <Text style={{fontWeight: 'bold', fontSize: 20, marginLeft: 30, marginTop: 70}}>Select Schedule </Text>
            <View style={{ marginLeft: 90, position: 'absolute', marginTop: 130 }}>
                <Image
                    source={require('../../assets/bookingAnimation.png')}
                    style={styles.bookingAnimation}
                />
            </View>
            <Calendar
                onDayPress={(day) => handleDateSelect(day)}
                markedDates={{
                    [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' },
                }}
                style={{ margin: 20 }}
            />
            <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 30 }}>
                <View style={{ height: 3, width: '100%', borderWidth: 1, backgroundColor: 'grey', }}></View>
            </View>

            {errorMessage ? (
                <Text style={{ color: 'red', marginLeft: 35, fontSize: 10, marginTop: 10 }}>*{errorMessage}</Text>
            ) : null}
            <View style={{ marginLeft: 40, marginBottom: 10, marginTop: 20 }}>
                <Text style={{ fontSize: 15, fontWeight: '400' }}>Select session : </Text>
            </View>
            <View style={{marginHorizontal: 30, backgroundColor: 'white'}}>
                <SelectList
                    setSelected={(val) => setSelectedSlot(val)}
                    data={session}
                    save="value"
                    defaultValue={selectedSlot}
                    inputStyles={{ fontSize: 12 }}
                    placeholder="Select your location"
                />
            </View>


            <View style={{ marginLeft: 40, marginBottom: 10, marginTop: 15 }}>
                <Text style={{ fontSize: 15, fontWeight: '400' }}>Select Location : </Text>
            </View>

            <View style={{marginHorizontal: 30, backgroundColor: 'white'}}>
                <SelectList
                    setSelected={(val) => setSelectedLocation(val)}
                    data={location}
                    save="value"
                    defaultValue={selectedLocation}
                    inputStyles={{ fontSize: 12 }}
                    placeholder="Select your location"

                />
            </View>



            <View style={{ flexDirection: 'row', gap: 10, marginHorizontal: 20, justifyContent: 'center', marginTop: 20 }}>
                <TouchableOpacity onPress={handleBooking} style={styles.submitButton}>
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
        width: 100,
        height: 40,
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
    },
    dropDownSession: {
        height: 40,
        borderRadius: 15,
        marginTop: 2,
        marginHorizontal: 30,
        marginBottom: 4,
    },
    bookingAnimation: {
        width: 200,
        height: 250,
        // position: 'absolute',
        marginTop: 240,
        opacity: 0.1,
    },
});
