import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Modal, Alert } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";
import auth from '@react-native-firebase/auth';
import { strings } from "../../../../App";
import FastImage from 'react-native-fast-image';
import Share from 'react-native-share';
import Toast from 'react-native-easy-toast';
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";
import { ModalConnection } from "../../02-components/ConnectionComponent";
import { GetAllJournalContributors, GetKey, InsertAdminSharedkey, RemoveContributorFromInvites } from "../../03-providers/JournalProvider";

const Contributors = ({ route, navigation }) => {
    var admin = route.params.admin
    let [modalStatus, setModalStatus] = useState(false)
    let [key, setKey] = useState("")
    let [currentToken, setCurrentToken] = useState("")
    let [loading, setLoading] = useState(false)
    let [contributorsList, setContributorsList] = useState([])
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
    let [cancel, setCancel] = useState("Cancel")
    let [remove, setRemove] = useState("Remove")
    let [areyousureyouwanttoremovethisContributor, setAreyousureyouwanttoremovethisContributor] = useState("Are you sure you want to remove this contributor?")
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");

    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if(!user){
                return;
            }
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData();
                setCurrentToken(idToken)
            });
        });
    }

    /** function to open sharing apps dialog */
    const shareKeyOpenDialog = () => {
        Alert.alert(
            "Note",
            pleasesharethiskey,
            [
                { text: "OK", onPress: () => openSharingDialog() }
            ]
        );
    }

     /**  open the sharing dialog */
    const openSharingDialog = async () => {
        const shareOptions = {
            message: key,
        }
        try {
            const shareResponse = await Share.open(shareOptions);
            if (shareResponse.success == true) {
                setLoading(true)
                insertAdminSharedKey(currentToken)
                setModalStatus(false)
            }
        } catch (error) {
            console.log('Error => ', error)
        }
    }

    /**  open the share key modal */
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

    /** insert admin and the key into DB */
    const getAllContributors = (journalRef) => {
        setLoading(true)
        GetAllJournalContributors(journalRef)
            .then((response) => response.json())
            .then((responseJson) => saveResponseIntoList(responseJson))
            .catch((error)=>{console.log(error)})
    }

    const saveResponseIntoList = (response) => {
        setContributorsList(response)
        setLoading(false)
    }


    /** get the random key from DB */
    const getKeyFromDB = () => {
        GetKey()
            .then((response) => response.json())
            .then((responseJson) => setKey(responseJson.key))
            .catch((error)=>{console.log(error)})
    };

    /** insert admin and the key into DB */
    const insertAdminSharedKey = (idToken) => {
        setLoading(true)
        InsertAdminSharedkey(idToken, global.JournalRef, key)
            .then((response) => response.json())
            .then((responseJson) => whenSuccessInsert(responseJson))
            .catch((error)=>{console.log(error)})
    }

    /** function called when key has successfully inserted */
    const whenSuccessInsert = (responseJson) => {
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

    /** delete Image from DB */
    const removeContributorFromInvites = (contributorUid) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                RemoveContributorFromInvites(global.JournalRef, contributorUid)
                    .then((response) => response.json())
                    .then(getAllContributors(global.JournalRef))
                    .catch((error)=>{console.log(error)})
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
            setCancel(strings.cancel)
            setRemove(strings.remove)
            setAreyousureyouwanttoremovethisContributor(strings.areyousureyouwanttoremovethisContributor)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            getAllContributors(global.JournalRef)
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


    let _renderItem = ({ item }) => {
        const admin = "Admin";
        const notAdmin = "X"

        return (
            <View style={globalStyles.contributorListItemMainView}>
                <FastImage
                    style={globalStyles.contributorListImageRounded}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.OWNER_UID + "/profile.jpg",
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
                <Text style={globalStyles.contributorListUserName}>{item.USER_NAME}</Text>
                {item.OWNER_UID == global.Admin ? (
                    <Text style={globalStyles.contributorListIsAdminLabel}>{admin}</Text>
                ) :
                    <View style={{ marginLeft: 'auto' }}>
                        {global.accessStatus == 0 ? (
                            <TouchableOpacity onPress={() => removeDialog(item.OWNER_UID)}>
                                <View style={{ width: 60, height: 30 }}>
                                    <Text style={globalStyles.contributorListIsnotAdmin}>{notAdmin}</Text>
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
                textStyle={globalStyles.spinnerTextStyle}
            />
            <View style={globalStyles.viewFlex1}>
                <ImageBackground style={globalStyles.contributors_Img_background} source={require('../../../assets/journal_background_header.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={globalStyles.subHeaderViewbackgroundYellow}>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings', { adminName: admin })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity></View>
                                <View style={globalStyles.headerGlobalMiddleView}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{contributor}</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                </View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>

            <View style={{ flex: 3 }}>
                <SafeAreaView style={globalStyles.safeAreaViewFlexCenterbackgroundWhite}>
                    <FlatList data={contributorsList} renderItem={_renderItem} />
                </SafeAreaView>
            </View>

            {global.accessStatus == 0 ? (
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
                <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={globalStyles.shareKeyModalMainView}>
                            <Text style={globalStyles.greyTextFont16}>{invite_a_contributor}{'\n'}</Text>
                            <Text style={globalStyles.greyTextFont14}>{this_is_a_uniqueKey}{global.JournalName}'s {shareItWiththePeopleYouWould}{'\n'} {'\n'} </Text>
                            <Text style={globalStyles.purpleKeyTextFont24}>{key} {'\n'}</Text>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => shareKeyOpenDialog()}>
                                <View style={globalStyles.contributors_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{shareKey}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>
                </TouchableOpacity>
            </Modal>

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

export default Contributors;