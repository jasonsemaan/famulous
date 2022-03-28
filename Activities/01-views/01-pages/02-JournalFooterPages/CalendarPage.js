import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import Swipeout from 'react-native-swipeout';
import { globalStyles } from "../../../../Activities/03-constants/global";
import auth, { firebase } from '@react-native-firebase/auth';
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../../App";
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { ModalConnection } from "../../02-components/ConnectionComponent";
import { CreateEvent, DeleteEvent, GetEditionEvents } from "../../03-providers/EventsProvider";

const CalendarPage = ({ route, navigation }) => {

    var adminName = route.params.adminName
    let [modalStatus, setModalStatus] = useState(false)
    let [loading, setLoading] = useState(false)
    let [selectedDate, setSelectedDate] = useState('')
    let [currentToken, setCurrentToken] = useState("")
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


    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if(!user){
                return;
            }
            user.getIdToken().then(function (idToken) {
                setCurrentToken(idToken)
                getAsyncStorageData();
            });
        });
    }

    /** get all events to the selected edition from DB */
    const getEditionEvents = (editionRef) => {
        setLoading(true)
        GetEditionEvents(editionRef)
            .then((response) => response.json())
            .then((responseJson) => saveResponseData(responseJson))
            .catch((error)=>{console.log(error)})
    }

    /** called on response of "getEditionEvents" to save the data into the list */
    const saveResponseData = (responseJson) => {
        responseJson.forEach(event => {
            nextDays.push(event.eventDate)
        });
        setEventsList(responseJson)
        setLoading(false)
    }

    /** add event to DB */
    const addEventToDB = () => {
        setLoading(true)
        CreateEvent(currentToken, global.EditionRef, selectedDate, eventDescription)
            .then((response) => response.json())
            .then((responseJson) => addingEvent(responseJson))
            .catch((error)=>{console.log(error)})
    }

    /** delete event from DB */
    const deleteEventFromDB = (eventRef) => {
        DeleteEvent(eventRef)
            .then((response) => response.json())
            .then((responseJson) => console.log(responseJson))
            .catch((error)=>{console.log(error)})
    }

    /** function to re-call the getEditionEvents to get all events from db */
    const addingEvent = (responseJson) => {
        getEditionEvents(global.EditionRef)
    }

    /** function to delete event from list */
    const deleteItem = (eventRef) => {
        setEventsList(eventsList.filter(item => item.eventRef !== eventRef))
        deleteEventFromDB(eventRef)
    }

    /** function to open view on a day selected to add en event */
    const addEventOnCalendar = (day) => {
        setSelectedDate(day.dateString)
        setModalStatus(true)
    }

    /** function to add event to the list */
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

    /** get params from async storage */
    const getAsyncStorageDataForNoConnection = async () => {
        try {
            strings.setLanguage(global.appLanguage)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
        } catch (e) {
            console.log(e)
        }
    }

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(global.appLanguage)
            setCalendar(strings.calendar)
            setAddEventLabel(strings.addEvent)
            setAddEventInLabel(strings.addEventIn)
            setEventDescriptionLabel(strings.eventDescription)
            setPleaseWriteAdescription(strings.pleaseWriteAdescription)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            getEditionEvents(global.EditionRef)
        } catch (e) {
            console.log(e)
        }
    }

    /** render the flatlist items view */
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
                        <View style={globalStyles.flexRow}>
                            <Image source={require('../../../assets/calendarGlass.png')} style={{ width: 20, height: 20, alignSelf: 'center' }}/>
                            <Text style={{ marginLeft: 10, alignSelf: 'center', fontFamily: 'Arial', color: 'grey' }}>{item.eventDescription}</Text>
                        </View>
                        <View style={globalStyles.flexRow}>
                            <Text style={{ alignSelf: 'center', color: '#9b56a2', marginRight: 10 }}>{item.eventDate}</Text>
                        </View>
                    </View>
                </View>
            </Swipeout>
        );
    };

    /** function to check if internet connection is enable or not */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
                setLoading(false)
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
                textStyle={globalStyles.spinnerTextStyle}
            />
            <View style={globalStyles.viewFlex1}>
                <ImageBackground style={globalStyles.bottomNav_Img_background} source={require('../../../assets/purpuleImageBackground.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={globalStyles.subHeaderViewbackgroundYellow}>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails', { admin: adminName })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={globalStyles.headerGlobalMiddleView}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{calendar}</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}></View>
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
                <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={globalStyles.calendarMainModalView}>
                            <Text style={globalStyles.purple_default_text_calendar}>{addEventInLabel} {selectedDate}</Text>
                            <View style={globalStyles.calendarMainModalView2}>
                                <View style={globalStyles.alignItemsCenter}>
                                    <View style={globalStyles.marginTopAuto}>
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
            <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh}/>

        </View>
    );
}

const styles = StyleSheet.create({

})

export default CalendarPage;