import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Alert, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../../App";
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";


const JoinJournalsPage = ({ navigation }) => {

    //Labels
    let [join_a_Journal, setJoinaJournal] = useState("Join a journal");
    let [youWereInvitedBy, setYouWereInvitedBy] = useState("You were invited by Jane doe to join Yasmina journal, you should receive a unique key in a message");
    let [enterkeytoJoin, setEnterKeyToJoin] = useState("Enter key to join");
    let [join, setJoin] = useState("Join");
    let [success, setSuccess] = useState("Success");
    let [keymustbe6digits, setKeymustbe6digits] = useState("Key must be 6 digits");
    let [pleaseselectakey, setPleaseselectakey] = useState("Please select a key");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");

    let [sharedKey, setSharedKey] = useState("")
    let [currentToken, setCurrentToken] = useState("")
    let [loading, setLoading] = useState(false);
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)


    const ref = React.useRef();
    const ref1 = React.useRef();
    const ref2 = React.useRef();
    const ref3 = React.useRef();
    const ref4 = React.useRef();
    const ref5 = React.useRef();
    const ref6 = React.useRef();



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
     *  update admin to a new contributor for the key
     */
    const updateSharedKeyAfterJoin = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                Keyboard.dismiss()
                if (sharedKey.length === 6) {
                    setLoading(true)
                    fetch(constants.apiIP + "journal/updateSharedKeyAfterJoin", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + currentToken
                        },
                        body: JSON.stringify({
                            pinCode: sharedKey
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => console.log(responseJson))
                        .then(whenKeyUpdatedSuccessfully())
                } else if (sharedKey.length != 6 && sharedKey.length >= 1) {
                    this.toast.show(keymustbe6digits, 2000)
                } else {
                    this.toast.show(pleaseselectakey, 2000)
                }
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageData()
            }
        })
    }


    /**
     *  function called after key has successfully updated
     */
    const whenKeyUpdatedSuccessfully = () => {
        this.toast.show(success, 2000)
        setSharedKey("")
        setLoading(false)
    }


    /**
     *  function to move the cursor automatically to the next textInput on typing, and to move back on deleting
     */
    // const onChangeTextInput = (text, index) => {
    //     if (text.length === 1 && index === 0) {
    //         ref1.current.focus();
    //     } else if (text.length === 1 && index === 1) {
    //         ref2.current.focus();
    //     } else if (text.length === 1 && index === 2) {
    //         ref3.current.focus();
    //     } else if (text.length === 1 && index === 3) {
    //         ref4.current.focus();
    //     } else if (text.length === 1 && index === 4) {
    //         ref5.current.focus();
    //     } else if (text.length === 1 && index === 5) {
    //         ref6.current.focus();
    //     }

    //     if (text.length === 0 && index === 6) {
    //         ref5.current.focus();
    //     } else if (text.length === 0 && index === 5) {
    //         ref4.current.focus();
    //     } else if (text.length === 0 && index === 4) {
    //         ref3.current.focus();
    //     } else if (text.length === 0 && index === 3) {
    //         ref2.current.focus();
    //     } else if (text.length === 0 && index === 2) {
    //         ref1.current.focus();
    //     } else if (text.length === 0 && index === 1) {
    //         ref.current.focus();
    //     }

    // }

    /**
     * get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setJoinaJournal(strings.join_a_Journal)
            setYouWereInvitedBy(strings.youWereInvitedBy)
            setEnterKeyToJoin(strings.enterkeytoJoin)
            setJoin(strings.join)
            setSuccess(strings.success)
            setKeymustbe6digits(strings.keymustbe6digits)
            setPleaseselectakey(strings.pleaseselectakey)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
        } catch (e) {
            console.log(e)
        }
    }

    /**
   *  function to check if internet connection is enable or not
   */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageData()
                setLoading(false)
            }
        });
    }


    useEffect(() => {
        getTokenId()
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
            <View style={{ height: '100%', backgroundColor: '#febf2e' }}>

                <View style={{ height: '100%' }}>
                    <View style={{ height: '15%', alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                        <View style={{ padding: 10 }}>
                                            <Image style={globalStyles.backArrow} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{join_a_Journal}</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.menuDrawer_Overflow_Div}>
                        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ marginTop: 5 }}>
                                <Text style={globalStyles.main_Welcome_smallText}>
                                    {youWereInvitedBy}
                                </Text>
                            </View>

                            <View style={{ marginTop: 50 }}>
                                <Text style={globalStyles.purple_default_text}>{enterkeytoJoin}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                {/* <TextInput ref={ref} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 0)} />
                                <TextInput ref={ref1} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 1)} />
                                <TextInput ref={ref2} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 2)} />
                                <TextInput ref={ref3} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 3)} />
                                <TextInput ref={ref4} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 4)} />
                                <TextInput ref={ref5} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 5)} />
                                <TextInput ref={ref6} style={globalStyles.joinJournal_square_textInput} maxLength={1} autoCapitalize="characters" secureTextEntry={false} underlineColorAndroid="transparent" onChangeText={(text) => onChangeTextInput(text, 6)} /> */}
                                <View style={globalStyles.login_InputwithImage}>
                                    <TextInput style={{ width: 300, alignSelf: 'center', height: 35, padding: 0, color: 'black', textAlign: 'center' }} underlineColorAndroid="transparent" onChangeText={(text) => setSharedKey(text)} value={sharedKey}/>
                                </View>
                            </View>
                            <View style={{ marginTop: 40 }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => updateSharedKeyAfterJoin()}>
                                    <View style={globalStyles.drawerMenu_button}>
                                        <Text style={globalStyles.Wel_Log_buttonLabel}>{join}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

            </View>

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

            <Toast ref={(toast) => this.toast = toast}
                style={{ borderRadius: 20 }}
                fadeInDuration={500}
                fadeOutDuration={500} />
        </View>
    );
}




const styles = StyleSheet.create({

})

export default JoinJournalsPage;