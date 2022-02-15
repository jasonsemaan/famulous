import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { globalStyles } from "../../../../01-app/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { firebase } from '@react-native-firebase/auth';
import { strings } from "../../../../App";
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import Toast, { DURATION } from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";



const Contributors = ({ route, navigation }) => {
    var admin = route.params.admin
    let [modalStatus, setModalStatus] = useState(false)
    let [journalName, setJournalName] = useState(false)
    let [key, setKey] = useState("")
    let [currentToken, setCurrentToken] = useState("")
    let [journalRef, setJournalRef] = useState("")
    let [loading, setLoading] = useState(false)
    let [contributorsList, setContributorsList] = useState([])
    let [accessStatus, setAccessStatus] = useState('')
    let [journalAdmin, setJournalAdmin] = useState('')
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)


    //Labels
    let [contributor, setContributor] = useState('Contributors')
    let [youCanInviteUpto10contributors, setYouCanInviteUpto10contributors] = useState('You can invite up to 10 contributors')
    let [invite, setInvite] = useState('Invite')
    let [invite_a_contributor, setInviteContributor] = useState('Invite a contributor')
    let [this_is_a_uniqueKey, setThisIsaUniqueKey] = useState("This is a unique key to join")
    let [shareItWiththePeopleYouWould, setShareItWiththePeopleYouWould] = useState("journal. Share it with the people you would like to invite as contributors")
    let [shareKey, setShareKey] = useState("Share Key")
    let [yourkeyhasbeencopiedPleaseshareitwithsomeone, setYourkeyhasbeencopiedPleaseshareitwithsomeone] = useState("Your key has been copied, Please share it with someone")
    let [somethingWrongPleasetryagain, setSomethingWrongPleasetryagain] = useState("Something Wrong! Please try again")
    let [pleasesharethiskey, setPleasesharethiskey] = useState("Please share this key with someone then back to the app")
    let [warning, setWarning] = useState("Warning")
    let [cancel, setCancel] = useState("Cancel")
    let [remove, setRemove] = useState("Remove")
    let [areyousureyouwanttoremovethisContributor, setAreyousureyouwanttoremovethisContributor] = useState("Are you sure you want to remove this contributor?")
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
     *  function to open sharing apps dialog
     */
    const shareKeyOpenDialog = () => {
        Alert.alert(
            "Note",
            pleasesharethiskey,
            [
                { text: "OK", onPress: () => openSharingDialog() }
            ]
        );
    }

    const openSharingDialog = async () => {
        const shareOptions = {
            message: key,
        }
        try {
            const shareResponse = await Share.open(shareOptions);
            console.log(shareResponse)
            if (shareResponse.success == true) {
                setLoading(true)
                insertAdminSharedKey(currentToken)
                setModalStatus(false)
            }
        } catch (error) {
            console.log('Error => ', error)
        }
    }


    /**
     *  open the share key modal
     */
    const openShareKeyModal = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setModalStatus(true)
                getKeyFromDB()
            } else {
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        })
    }


    /**
     *  insert admin and the key into DB
     */
    const getAllContributors = (journalRef) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/getAllJournalContributors", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                journalRef: journalRef,
            })
        })
            .then((response) => response.json())
            .then((responseJson) => saveResponseIntoList(responseJson))
    }

    const saveResponseIntoList = (response) => {
        setContributorsList(response)
        setLoading(false)
    }


    /**
     *  get the random key from DB
     */
    const getKeyFromDB = () => {
        fetch(constants.apiIP + "journal/generateKey", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        })
            .then((response) => response.json())
            .then((responseJson) => setKey(responseJson.key))
    };


    /**
     *  insert admin and the key into DB
     */
    const insertAdminSharedKey = (idToken) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/insertAdminSharedKey", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                journalRef: journalRef,
                pinCode: key
            })
        })
            .then((response) => response.json())
            .then((responseJson) => whenSuccessInsert(responseJson))
    }


    /**
     *  function called when key has successfully inserted
     */
    const whenSuccessInsert = (responseJson) => {
        console.log(responseJson)
        if (responseJson.pinCode != "") {
            setLoading(false)
            this.toast.show(yourkeyhasbeencopiedPleaseshareitwithsomeone, 3000)
        } else {
            this.toast.show(somethingWrongPleasetryagain, 2000)
        }
    }


    const removeDialog = (contributorUid) => {
        Alert.alert(
            '',
            areyousureyouwanttoremovethisContributor,
            [
                {
                    text: cancel,
                    onPress: () => console.log('Canceled'),
                    style: 'cancel'
                },
                {
                    text: remove,
                    onPress: () => removeContributorFromInvites(contributorUid)
                },
            ]
        )
    }


    /**
   *  delete Image from DB
   */
    const removeContributorFromInvites = (contributorUid) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                fetch(constants.apiIP + "journal/removeContributorFromInvites", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        journalRef: journalRef,
                        contributorUid: contributorUid
                    })
                })
                    .then((response) => response.json())
                    .then(getAllContributors(journalRef))
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageDataForNoConnection()
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
            setAccessStatus(await AsyncStorage.getItem('accessStatus'))
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setContributor(strings.contributors)
            setYouCanInviteUpto10contributors(strings.youCanInviteUpto10contributors)
            setInvite(strings.invite)
            setInviteContributor(strings.invite_a_contributor)
            setThisIsaUniqueKey(strings.this_is_a_uniqueKey)
            setShareKey(strings.shareKey)
            setShareItWiththePeopleYouWould(strings.shareItWiththePeopleYouWould)
            setYourkeyhasbeencopiedPleaseshareitwithsomeone(strings.yourkeyhasbeencopiedPleaseshareitwithsomeone)
            setSomethingWrongPleasetryagain(strings.somethingWrongPleasetryagain)
            setPleasesharethiskey(strings.pleasesharethiskey)
            setWarning(strings.warning)
            setCancel(strings.cancel)
            setRemove(strings.remove)
            setAreyousureyouwanttoremovethisContributor(strings.areyousureyouwanttoremovethisContributor)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)

            setJournalName(await AsyncStorage.getItem('JournalName'))
            setJournalRef(await AsyncStorage.getItem('JournalRef'))
            getAllContributors(await AsyncStorage.getItem('JournalRef'))
            setJournalAdmin(await AsyncStorage.getItem('Admin'))
        } catch (e) {
            console.log(e)
        }
    }

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
                setConnectionModalStatus(true)
                getAsyncStorageDataForNoConnection()
                setLoading(false)
            }
        });
    }


    useEffect(() => {
        checkConnection()
        return () => {
        }
    }, [])


    let _renderItem = ({ item }) => {
        const admin = "Admin";
        const notAdmin = "X"
        // let  isAdmin = item.OWNER_UID == journalAdmin ? admin : notAdmin

        return (
            <View style={{ flex: 1, flexDirection: 'row', padding: 20, alignItems: 'center' }}>
                <FastImage
                    style={{ width: 60, height: 60, borderRadius: 60 / 2 }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.OWNER_UID + "/profile.jpg",
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <Text style={{ marginLeft: 20, color: 'grey', fontSize: 12 }}>{item.USER_NAME}</Text>
                {item.OWNER_UID == journalAdmin ? (
                    <Text style={{ color: '#F25278', marginLeft: 'auto', marginRight: 10, fontSize: 12 }}>{admin}</Text>
                ) :
                    <View style={{ marginLeft: 'auto' }}>
                        {accessStatus == 0 ? (
                            <TouchableOpacity onPress={() => removeDialog(item.OWNER_UID)}>
                                <View style={{ width: 60, height: 30 }}>
                                    <Text style={{ color: '#F25278', marginLeft: 'auto', marginRight: 10, fontSize: 12, marginTop: 10 }}>{notAdmin}</Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                }
            </View>
        );
    };

    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ fontSize: 12, color: 'white' }}
            />
            <View style={{ flex: 1 }}>
                <ImageBackground style={globalStyles.contributors_Img_background} source={require('../../../../assets/journal_background_header.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings', { adminName: admin })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity></View>

                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{contributor}</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>


            <View style={{ flex: 3 }}>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
                    <FlatList data={contributorsList} renderItem={_renderItem} />
                </SafeAreaView>
            </View>

            {accessStatus == 0 ? (
                <View style={globalStyles.contributors_footer_tabs}>
                    <Text style={{ color: '#9b56a2' }}>{youCanInviteUpto10contributors}</Text>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => openShareKeyModal()}>
                        <View style={globalStyles.contributors_button}>
                            <Text style={globalStyles.Wel_Log_buttonLabel}>{invite}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ) : null
            }
            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={{ flex: 1 }} onPress={() => setModalStatus(false)}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '40%', borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'grey', fontSize: 16 }}>{invite_a_contributor}{'\n'}</Text>
                            <Text style={{ textAlign: 'center', color: 'grey', fontSize: 14 }}>{this_is_a_uniqueKey}{journalName}'s {shareItWiththePeopleYouWould}{'\n'} {'\n'} </Text>
                            <Text style={{ color: '#9b56a2', fontSize: 24 }}>{key} {'\n'}</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => shareKeyOpenDialog()}>
                                <View style={globalStyles.contributors_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{shareKey}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableOpacity>
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

            <Toast ref={(toast) => this.toast = toast}
                style={{ borderRadius: 20 }}
                fadeInDuration={500}
                fadeOutDuration={500} />
        </View>

    );
}






const styles = StyleSheet.create({

})

export default Contributors;