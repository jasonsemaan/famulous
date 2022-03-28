import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Modal, Keyboard } from "react-native";
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../03-constants/global";
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../../App";
import NetInfo from "@react-native-community/netinfo";
import { ModalConnection } from "../../02-components/ConnectionComponent";
import { UpdateSharedKey } from "../../03-providers/JournalProvider";

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

    /** update admin to a new contributor for the key */
    const updateSharedKeyAfterJoin = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                Keyboard.dismiss()
                if (sharedKey.length === 6) {
                    setLoading(true)
                    UpdateSharedKey(currentToken, sharedKey)
                        .then((response) => response.json())
                        .then((responseJson) => console.log(responseJson))
                        .then(whenKeyUpdatedSuccessfully())
                        .catch((error)=>{console.log(error)})
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

    /** function called after key has successfully updated */
    const whenKeyUpdatedSuccessfully = () => {
        this.toast.show(success, 2000)
        setSharedKey("")
        setLoading(false)
        navigation.navigate("Root")
    }

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(global.appLanguage)
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

    /** function to check if internet connection is enable or not */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                getAsyncStorageData()
                setConnectionModalStatus(true)
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
                textStyle={globalStyles.spinnerTextStyle}
            />
            <View style={{ flex:1, backgroundColor: '#febf2e' }}>
                <View style={{ height: '100%' }}>
                    <View style={globalStyles.viewHeight15AlignCenter}>
                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={globalStyles.subHeaderViewbackgroundYellow}>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                        <View style={{ padding: 10 }}>
                                            <Image style={globalStyles.backArrow} source={require('../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={globalStyles.headerGlobalMiddleView}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{join_a_Journal}</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}></View>
                            </View>
                        </View>
                    </View>
                    <View style={globalStyles.menuDrawer_Overflow_Div}>
                        <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={globalStyles.viewMarginTop5}>
                                <Text style={globalStyles.main_Welcome_smallText}>
                                    {youWereInvitedBy}
                                </Text>
                            </View>

                            <View style={{ marginTop: 50 }}>
                                <Text style={globalStyles.purple_default_text}>{enterkeytoJoin}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 10, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
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
            <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh}/>

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