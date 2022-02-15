import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import Swipeout from 'react-native-swipeout';
import { globalStyles } from "../../../../01-app/03-constants/global";
import auth, { firebase } from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { constants } from "../../../03-constants/Constants";



const CalendarPage = ({ route, navigation }) => {

    var adminName = route.params.adminName
    let [modalStatus, setModalStatus] = useState(false)
    let [loading, setLoading] = useState(false)
    let [selectedDate, setSelectedDate] = useState('')
    let [currentToken, setCurrentToken] = useState("")
    let [currentEditionRef, setCurrentEditionRef] = useState("")
    let [eventDescription, setEventDescription] = useState("")
    let [eventsList, setEventsList] = useState([])
    let [nextDays, setNextDays] = useState([])
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)
    let currentDate = moment().format('YYYY-MM-DD')


    let mark = {
        [selectedDate]: { selected: true }
    };

    nextDays.forEach(day => {
        mark[day] = { selected: true };
    });




    //Labels
    let [calendar, setCalendar] = useState('Calendar')
    let [addEventLabel, setAddEventLabel] = useState('Add Event')
    let [addEventInLabel, setAddEventInLabel] = useState('Add Event in')
    let [eventDescriptionLabel, setEventDescriptionLabel] = useState('Event Description')
    let [pleaseWriteAdescription, setPleaseWriteAdescription] = useState('Please write a description')
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");


    /**
      * get the tokenID
      */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            user.getIdToken().then(function (idToken) {
                setCurrentToken(idToken)
                getAsyncStorageData();
            });
        });
    }

    /**
    *  get all events to the selected edition from DB
    */
    const getEditionEvents = (editionRef) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/getEditionEvents", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                editionRef: editionRef,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => saveResponseData(responseJson))
    }

    /**
     *  called on response of "getEditionEvents" to save the data into the list
     */
    const saveResponseData = (responseJson) => {
        console.log(responseJson)
        responseJson.forEach(event => {
            nextDays.push(event.eventDate)
        });
        setEventsList(responseJson)
        setLoading(false)
    }


    /**
    *  add event to DB
    */
    const addEventToDB = () => {
        setLoading(true)
        fetch(constants.apiIP + "journal/createEvent", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + currentToken
            },
            body: JSON.stringify({
                editionRef: currentEditionRef,
                eventDate: selectedDate,
                eventDescription: eventDescription
            })
        })
            .then((response) => response.json())
            .then((responseJson) => addingEvent(responseJson))
    }


    /**
     *  delete event from DB
     */
    const deleteEventFromDB = (eventRef) => {
        fetch(constants.apiIP + "journal/deleteEditionEvent", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventRef: eventRef,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => console.log(responseJson))
    }


    /**
     *  function to re-call the getEditionEvents to get all events from db
     */
    const addingEvent = (responseJson) => {
        getEditionEvents(currentEditionRef)
    }


    /**
     *  function to delete event from list
     */
    const deleteItem = (eventRef) => {
        setEventsList(eventsList.filter(item => item.eventRef !== eventRef))
        deleteEventFromDB(eventRef)
    }


    /**
     *  function to open view on a day selected to add en event
     */
    const addEventOnCalendar = (day) => {
        setSelectedDate(day.dateString)
        setModalStatus(true)
    }

    /**
     *  function to add event to the list
     */
    const addEvent = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                if (eventDescription != "") {
                    nextDays.push(selectedDate)
                    addEventToDB()
                    setModalStatus(false)
                } else {
                    this.toast.show(pleaseWriteAdescription, 2000)
                }
            } else {
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        })
    }

    /**
    *  get params from async storage
    */
    const getAsyncStorageDataForNoConnection = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
        } catch (e) {
            console.log(e)
        }
    }

    /**
     *  get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setCalendar(strings.calendar)
            setAddEventLabel(strings.addEvent)
            setAddEventInLabel(strings.addEventIn)
            setEventDescriptionLabel(strings.eventDescription)
            setPleaseWriteAdescription(strings.pleaseWriteAdescription)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)

            getEditionEvents(await AsyncStorage.getItem('editionRef'))
            setCurrentEditionRef(await AsyncStorage.getItem('editionRef'))
        } catch (e) {
            console.log(e)
        }
    }

    /**
     *  render the flatlist items view
     */
    const _renderItem = ({ item }) => {
        var swipeoutBtns = [
            {
                text: 'Delete',
                backgroundColor: '#F25278',
                onPress: () => { deleteItem(item.eventRef) }
            }
        ]
        return (
            <Swipeout right={swipeoutBtns} style={{ backgroundColor: 'white', marginTop: 10 }}>
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, height: 50 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../../../../assets/calendarGlass.png')} style={{ width: 20, height: 20, alignSelf: 'center' }}></Image>
                            <Text style={{ marginLeft: 10, alignSelf: 'center', fontFamily: 'Arial', color: 'grey' }}>{item.eventDescription}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ alignSelf: 'center', color: '#9b56a2', marginRight: 10 }}>{item.eventDate}</Text>
                        </View>
                    </View>
                </View>
            </Swipeout>
        );
    };


    /**
     *  function to check if internet connection is enable or not
     */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log("Is connected?", state);
            if (state.isConnected == true) {
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                setLoading(false)
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        });
    }


    useEffect(() => {
        checkConnection()
        return () => {
        }
    }, [])



    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ fontSize: 12, color: 'white' }}
            />
            <View style={{ flex: 1 }}>
                <ImageBackground style={globalStyles.bottomNav_Img_background} source={require('../../../../assets/purpuleImageBackground.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails', { admin: adminName })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{calendar}</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                            </View>
                        </View>
                    </View>
                    <View style={globalStyles.UploadImage_LinkSharing_Overflow_Div}>
                        <Calendar style={{ marginTop: 30, borderBottomWidth: 1, borderBottomColor: 'grey', marginRight: 20, marginLeft: 20 }}
                            current={currentDate}
                            onDayPress={(day) => { addEventOnCalendar(day) }}
                            markedDates={mark}

                        />

                        <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white', marginLeft: 15, marginRight: 15 }}>
                            <FlatList data={eventsList} renderItem={_renderItem} keyExtractor={item => item.id} showsVerticalScrollIndicator={false} />
                        </SafeAreaView>

                    </View>
                </ImageBackground>
            </View>


            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={{ flex: 1 }} onPress={() => setModalStatus(false)}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '30%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' }}>
                            <Text style={globalStyles.purple_default_text_calendar}>{addEventInLabel} {selectedDate}</Text>
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10, marginTop: 30 }}>
                                <View style={{ alignItems: 'center' }}>
                                    <View style={{ marginTop: 'auto' }}>
                                        <View style={globalStyles.calendarModal_InputView}>
                                            <TextInput style={globalStyles.calendarModal_textInput} underlineColorAndroid="transparent" onChangeText={(text) => setEventDescription(text)} placeholder={eventDescriptionLabel} placeholderTextColor='#A5A5A5' />
                                        </View>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => addEvent()}>
                                        <View style={globalStyles.addevent_button_style}>
                                            <Text style={globalStyles.Wel_Log_buttonLabel}>{addEventLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
                <Toast ref={(toast) => this.toast = toast}
                    style={{ borderRadius: 20 }}
                    fadeInDuration={500}
                    fadeOutDuration={500} />
            </Modal>

            <Modal transparent={true} visible={connectionModalStatus}>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '10%', borderRadius: 10, alignItems: 'center', marginBottom: 50, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../../assets/no-internet.png')} style={{ width: 30, height: 30, marginLeft: 10 }}></Image>
                                        <Text style={globalStyles.noInternetConnectionLabelStyle}>{noInternetConnection}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection()}>
                                        <View style={{ padding: 10 }}>
                                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#5ec6ca', marginRight: 20 }}>{refresh}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>


        </View>

    );
}




const styles = StyleSheet.create({

})

export default CalendarPage;