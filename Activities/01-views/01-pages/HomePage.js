import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, BackHandler, TextInput, ImageBackground } from "react-native";
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../Activities/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../App";
import { constants } from "../../03-constants/Constants";
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { Greeting } from "../../03-constants/Interceptor";

const HomePage = ({ navigation }) => {

    let [myJournalCategorie_Status, setMyJournalCategorie_Status] = useState(true);
    let [otherJournalCategorie_Status, setOtherJournalCategorie_Status] = useState(false);
    let [journalIndex_selected, setJournalIndexSelected] = useState(0);
    let [modalStatus, setModalStatus] = useState(false);
    let [journalName, setJournalName] = useState("");
    let [currentToken, setCurrentToken] = useState("")
    let [signedUserUid, setSignedUserUid] = useState("")
    let [myJournalsList, setMyJournalsList] = useState([])
    let [journalEditionsList, setJournalsEditionsList] = useState([])
    let [loading, setLoading] = useState(false);
    let [isMyJournalOrOthers, setIsMyJournalOrOthers] = useState(0);
    let [contributorsNb, setContributorsNb] = useState(0);
    let [daysLeftFromDB, setDaysLeftFromDB] = useState(0);
    let [isConnectedToInternet, setIsConnectedToInternet] = useState(true);
    let [connectionModalStatus, setConnectionModalStatus] = useState(false);

    const isFocused = useIsFocused();

    //Labels
    let [daysLeft, setDaysLeft] = useState("Days Left");
    let [contributors, setContributors] = useState("Contributors");
    let [contributor, setContributor] = useState("Contributor");
    let [myJournals, setMyJournals] = useState("My Journals");
    let [otherJournals, setOtherJournals] = useState("Invited Journals");
    let [youhavenojournalsatthismoment, setYouhavenojournalsatthismoment] = useState("You have no journals at this moment!!");
    let [addJournalswiththeplusButton, setAddJournalswiththeplusButton] = useState("Add journals with the + button.");
    let [journalNameLabel, setJournalNameLabel] = useState("Journal Name");
    let [addJournalLabel, setAddJournalLabel] = useState("Add Journal");
    let [noJournals, setNoJournals] = useState("No Journals");
    let [pleasetypeavalidjournalname, setPleasetypeavalidjournalname] = useState("Please type a valid journal name");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");
    let [checkyourconnectionthenrefreshthepage, setCheckyourconnectionthenrefreshthepage] = useState("Check your connection, then refresh the page");

    let contributorss = contributorsNb == 1 ? contributor : contributors

    useFocusEffect(
        React.useCallback(() => {
            checkConnection(0)
            toggleJournalsCategorie(0)
            return () => console.log("return function");
        }, [])
    );

    /** get the tokenID */
    const getTokenId = () => {
        setLoading(true)
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                setLoading(false)
                return;
            }
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData()
                setCurrentToken(idToken)
                getAllJournalsByUser(idToken)
                getUserProfile(idToken)
                console.log(idToken)
            });
        });
    }

    /**  get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            global.accessStatus = 0  // 0 if admin, 1 if contributor
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            global.appLanguage = await AsyncStorage.getItem('appLanguage')
            setDaysLeft(strings.daysLeft)
            setContributor(strings.contributor)
            setContributors(strings.contributors)
            setMyJournals(strings.myJournals)
            setOtherJournals(strings.otherJournals)
            setYouhavenojournalsatthismoment(strings.youhavenojournalsatthismoment)
            setAddJournalswiththeplusButton(strings.addJournalswiththeplusButton)
            setJournalNameLabel(strings.journalName)
            setAddJournalLabel(strings.addJournal)
            setNoJournals(strings.noJournals)
            setPleasetypeavalidjournalname(strings.pleasetypeavalidjournalname)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setCheckyourconnectionthenrefreshthepage(strings.checkyourconnectionthenrefreshthepage)
        } catch (e) {
            console.log(e)
        }
    }

    /** function to disable the mobile back button action */
    const backAction = () => {
        // BackHandler.exitApp()
        navigation.goBack(null);
        return true;
    }

    /** function to toggle view between MyJournals btn and OtherJournals btn */
    const toggleJournalsCategorie = (status) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                if (status === 0) {   // Admin
                    setMyJournalCategorie_Status(true)
                    setOtherJournalCategorie_Status(false)
                    getAllJournalsByUser(currentToken)
                    setIsMyJournalOrOthers(0)
                    global.accessStatus = 0
                } else {   // Contributor
                    setOtherJournalCategorie_Status(true)
                    setMyJournalCategorie_Status(false)
                    getAllInvitedJournalsbyUserUID()
                    setIsMyJournalOrOthers(1)
                    global.accessStatus = 1
                }
            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /** call backend api and add journal to the db */
    const addJournal = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                if (journalName != "") {
                    getTokenId()
                    setMyJournalCategorie_Status(true)
                    setOtherJournalCategorie_Status(false)
                    global.accessStatus = 0
                    setModalStatus(false)
                    myJournalsList.push({ journalName: journalName })

                    fetch(constants.apiIP + "journal/create", {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + currentToken
                        },
                        body: JSON.stringify({
                            name: journalName
                        })
                    })
                        .then((response) => response.json())
                        .then((responseJson) => getAllJournalsByUser(currentToken))
                        .catch((error) => { console.log("7 ", error) })
                } else {
                    this.toast.show(pleasetypeavalidjournalname, 2000)
                }

            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /** call backend api to get the user signed profile */
    const getUserProfile = (idToken) => {
        fetch(constants.apiIP + "userProfile/getUserProfile", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": "Bearer " + idToken
            },
        })
            .then((response) => response.json())
            .then((responseJson) => saveUserUid(responseJson))
            .catch((error) => { console.log("6 ", error) })
    };

    const saveUserUid = (responseJson) => {
        global.UserUid = responseJson.userUid;
        setSignedUserUid(responseJson.userUid)
    }

    /** call backend api to get all journals for the current user signed in */
    const getAllJournalsByUser = (idToken) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/getAllJournals", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                name: ""
            })
        })
            .then((response) => response.json())
            .then((responseJson) => saveDataList(0, responseJson, idToken))
            .catch((error) => { console.log(error) })
    };

    /** call backend api to get all the invitednjournals for the current user signed in */
    const getAllInvitedJournalsbyUserUID = () => {
        setLoading(true)
        fetch(constants.apiIP + "journal/getInvitedJournalsByUserUid", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": "Bearer " + currentToken
            },
        })
            .then((response) => response.json())
            .then((responseJson) => saveDataList(1, responseJson, currentToken))
            .catch((error) => { console.log("4 ", error) })
    };

    /** function to store data from db into a current list */
    const saveDataList = (categorieStatus, response, idToken) => {
        setMyJournalsList(response)
        if (categorieStatus == 0) {  // categorie status (0 if MyJournals  , 1 if InvitedJournals)
            if (response.length === 0) { //No Journals
                setLoading(false)
            } else {
                getJournalsEditionsbyJournalNameAndUserUID(0, idToken, response[0].journalName, response[0].journalRef, response[0].ownerUid, response[0].daysLeft)
            }
        } else {
            if (response[0].journalName === 0) { //No Journals
                setLoading(false)
                setMyJournalsList([])
                setJournalsEditionsList([])
            } else {
                getInvitedJournalsEditionsbyJournalNameAndUserUID(0, response[0].journalName, response[0].journalRef, response[0].ownerUID, response[0].daysLeft)
            }
        }
    }

    /** call backend api to get all journal editions to the selected journal */
    const getJournalsEditionsbyJournalNameAndUserUID = (index, idToken, journalName, journalRef, ownerUID, daysLeft) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                if (daysLeft > 0) {
                    setDaysLeftFromDB(daysLeft)
                } else {
                    setDaysLeftFromDB(0)
                }
                storeInfosIntoAsyncStorage(journalName, journalRef, ownerUID)
                setLoading(true)
                setJournalIndexSelected(index)
                getUserProfile(currentToken)
                fetch(constants.apiIP + "journal/getJournalEditions", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + idToken
                    },
                    body: JSON.stringify({
                        name: journalName
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => storeDataIntoList(responseJson))
                    .catch((error) => { console.log("1 ", error) })
            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /** call backend api to get all journal editions to the selected invited journal */
    const getInvitedJournalsEditionsbyJournalNameAndUserUID = (index, journalName, journalRef, ownerUID) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                storeInfosIntoAsyncStorage(journalName, journalRef, ownerUID)
                setLoading(true)
                setJournalIndexSelected(index)
                setSignedUserUid(ownerUID)
                fetch(constants.apiIP + "journal/getJournalEditionsToInvitedJournal", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userUid: ownerUID,
                        journalName: journalName
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => storeDataIntoList(responseJson))
                    .catch((error) => { console.log("2 ", error) })
            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /** insert admin and the key into DB */
    const getAllContributors = (journalRef) => {
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
            .then((responseJson) => setContributorsNb(responseJson.length))
            .catch((error) => { console.log("3 ", error) })
    }

    /** store parameters in the AsyncStorage */
    const storeInfosIntoAsyncStorage = (journalName, journalRef, ownerUID) => {
        getAllContributors(journalRef)
        try {
            global.JournalName = journalName;
            global.JournalRef = journalRef + "";
            global.Admin = ownerUID;
        } catch (e) {
            console.log(e)
        }
    }

    /** function to store the response editions data into a current list */
    const storeDataIntoList = (response) => {
        var list = [];
        for (let i = 0; i < response.length; i++) {
            if (response[i].archived != true) {
                list.push({ coverImage: response[i].coverImage, editionRef: response[i].editionRef, journalRef: response[i].journalRef, releaseDateFormated: response[i].releaseDateFormated })
            }
        }
        setLoading(false)
        setJournalsEditionsList(list);
    }

    /** function called on click of item to navigate to the Journal Details page */
    const navigateToJournalDetails = (releaseDateMonth, editionRef, releaseDateFormated, coverImage) => {
        navigation.navigate('JournalDetails', { admin: releaseDateMonth + " Journal" })
        global.EditionReleaseDate = releaseDateFormated;
        global.CoverImage = coverImage;
        global.EditionRef = editionRef + "";
    }

    /** function to check if internet connection is enable or not */
    const checkConnection = (param) => {
        if (param === 0) {
            NetInfo.fetch().then(state => {
                if (state.isConnected == true) {
                    getTokenId();
                    setIsConnectedToInternet(true)
                    setConnectionModalStatus(false)
                } else {
                    getAsyncStorageData()
                    setIsConnectedToInternet(false)
                    setConnectionModalStatus(false)
                    setLoading(false)
                }
            });
        } else {
            NetInfo.fetch().then(state => {
                if (state.isConnected == true) {
                    getTokenId();
                    setIsConnectedToInternet(true)
                    setConnectionModalStatus(false)
                } else {
                    getAsyncStorageData()
                    setConnectionModalStatus(true)
                    setLoading(false)
                }
            });
        }
    }

    const consoleAlert = () => {
        console.log("ping")
    }

    useEffect(() => {
        checkConnection(0)
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);


    /** render for the subJournals horizontal flatlist Items */
    const _renderItemCategorieJournals = ({ item, index }) => {
        return (
            <View style={{ alignSelf: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { isMyJournalOrOthers == 0 ? getJournalsEditionsbyJournalNameAndUserUID(index, currentToken, item.journalName, item.journalRef, item.ownerUid, item.daysLeft) : getInvitedJournalsEditionsbyJournalNameAndUserUID(index, item.journalName, item.journalRef, item.ownerUID) }}>
                    <Text style={journalIndex_selected === index ? globalStyles.home_journalMonth_selected : globalStyles.home_journalMonth}>{item.journalName}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    /** render to main flatfist Items  */
    const _renderItem = ({ item }) => {
        var releaseDate = item.releaseDateFormated.split(" ");
        var year = releaseDate[1]
        var month = ""
        if (global.appLanguage == "fr") {
            if (releaseDate[0] == "January") {
                month = "Janvier"
            } else if (releaseDate[0] == "February") {
                month = "Février"
            } else if (releaseDate[0] == "March") {
                month = "Mars"
            } else if (releaseDate[0] == "April") {
                month = "Avril"
            } else if (releaseDate[0] == "May") {
                month = "Mai"
            } else if (releaseDate[0] == "June") {
                month = "Juin"
            } else if (releaseDate[0] == "July") {
                month = "Juillet"
            } else if (releaseDate[0] == "August") {
                month = "Août"
            } else if (releaseDate[0] == "September") {
                month = "Septembre"
            } else if (releaseDate[0] == "October") {
                month = "Octobre"
            } else if (releaseDate[0] == "November") {
                month = "Novembre"
            } else if (releaseDate[0] == "December") {
                month = "Décembre"
            }

        } else {
            month = releaseDate[0]
        }

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalDetails(month, item.editionRef, item.releaseDateFormated, item.coverImage)}>
                <View style={globalStyles.list_item}>
                    <SafeAreaView style={globalStyles.safeAreaViewFlexCenterbackgroundWhite}>
                        {item.coverImage == "null" || item.coverImage == "" ? (
                            <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground} source={require('../../assets/defaultCover.jpg')} >
                                <View style={globalStyles.monthYearView}>
                                    <Text style={globalStyles.monthYearLabel}>{month} {year}</Text>
                                </View>
                            </ImageBackground>
                        ) :
                            <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground}
                                source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/" + item.coverImage }} >
                                <View style={globalStyles.monthYearView}>
                                    <Text style={globalStyles.monthYearLabel}>{month} {year}</Text>
                                </View>
                            </ImageBackground>
                        }
                    </SafeAreaView>
                </View>
            </TouchableOpacity>
        );
    };


    return (
        <View style={globalStyles.main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={globalStyles.spinnerTextStyle}
            />
            {isConnectedToInternet == true ? (
                <SafeAreaView style={globalStyles.flexWithBackgroundWhite}>

                    <View style={globalStyles.home_header_div}>
                        <View style={globalStyles.home_header_row_div}>
                            <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                                <View style={{ padding: 7, width: 45 }}>
                                    <Image source={require('../../assets/home_menu_icon.png')} style={globalStyles.home_menu_logo} />
                                </View>
                            </TouchableWithoutFeedback>
                            <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo} />
                            <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10 }} onPress={() => setModalStatus(true)}>
                                <Image source={require('../../assets/home_plus_icon.png')} style={globalStyles.home_plus_logo} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={globalStyles.viewFlexRowSpaceBetweenfullWidth}>
                        <TouchableOpacity activeOpacity={1} onPress={() => toggleJournalsCategorie(0)}>
                            <View style={globalStyles.homepage_categoriesButton}>
                                <Text style={myJournalCategorie_Status ? globalStyles.homePage_categoriesLabelBtn : globalStyles.homePage_categoriesLabelBtnDisable}>{myJournals}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={() => toggleJournalsCategorie(1)}>
                            <View style={globalStyles.homepage_categoriesButton}>
                                <Text style={otherJournalCategorie_Status ? globalStyles.homePage_categoriesLabelBtn : globalStyles.homePage_categoriesLabelBtnDisable}>{otherJournals}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={globalStyles.viewHorizontalListJouranal}>
                        {myJournalsList.length != 0 ? (
                            <FlatList showsHorizontalScrollIndicator={false} data={myJournalsList} renderItem={_renderItemCategorieJournals} horizontal={true} />
                        ) : <Text style={globalStyles.home_journalMonth}>{noJournals}</Text>
                        }
                    </View>

                    {myJournalsList.length != 0 ? (

                        <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
                            <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                                <Image source={require('../../assets/group.png')} style={{ width: 18, height: 18, marginRight: 5, marginLeft: 5 }} />
                                <Text style={globalStyles.home_listItem_Contributors_Days}>{contributorsNb} {contributorss}</Text>
                            </View>
                            {accessStatus === 0 ? (
                                <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                                    <Text style={globalStyles.home_listitem_bulletpoint}>•</Text>
                                    <Image source={require('../../assets/clock.png')} style={{ width: 18, height: 18, marginRight: 5 }} />
                                    <Text style={globalStyles.home_listItem_Contributors_Days}>{daysLeftFromDB} {daysLeft}</Text>
                                </View>
                            ) : null}
                        </View>
                    ) :
                        <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
                        </View>
                    }
                    <View style={globalStyles.home_list_div}>
                        <SafeAreaView style={globalStyles.viewFlex1}>
                            {myJournalsList.length != 0 ? (
                                <FlatList showsVerticalScrollIndicator={false} data={journalEditionsList} renderItem={_renderItem} />
                            ) :
                                <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
                                    <Image source={require('../../assets/emptyJournal.png')} style={globalStyles.noInternetIconwidth60} />
                                    <Text style={globalStyles.blackBoldLabel}>{youhavenojournalsatthismoment}</Text>
                                    <Text style={globalStyles.textColorGrey}>{addJournalswiththeplusButton}</Text>
                                </View>
                            }
                        </SafeAreaView>
                    </View>
                </SafeAreaView>
            ) :
                <SafeAreaView style={globalStyles.flexWithBackgroundWhite}>
                    <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
                        <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIconwidth60} />
                        <Text style={globalStyles.blackBoldLabel}>{noInternetConnection}</Text>
                        <Text style={globalStyles.textColorGrey}>{checkyourconnectionthenrefreshthepage}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection(0)}>
                            <View style={globalStyles.resetPassword_button}>
                                <Text style={globalStyles.Wel_Log_buttonLabel}>{refresh}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }

            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '25%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center', }}>
                            <View style={globalStyles.modalViewfullWidthPadding10}>
                                <View style={globalStyles.alignItemsCenter}>
                                    <View style={globalStyles.calendarModal_InputView}>
                                        <TextInput style={globalStyles.calendarModal_textInput} underlineColorAndroid="transparent" onChangeText={(text) => setJournalName(text)} placeholder={journalNameLabel} placeholderTextColor='#A5A5A5' />
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => addJournal()}>
                                        <View style={globalStyles.addJournal_button_style}>
                                            <Text style={globalStyles.Wel_Log_buttonLabel}>{addJournalLabel}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Toast ref={(toast) => this.toast = toast} />
            </Modal>

            <Modal transparent={true} visible={connectionModalStatus}>
                <TouchableOpacity activeOpacity={1} style={globalStyles.viewFlex1}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={globalStyles.modalSubDivstyle}>
                            <View style={globalStyles.modalSubDivstyle2}>
                                <View style={globalStyles.modalSubDivstyle3}>
                                    <View style={globalStyles.viewRowAlignCenter}>
                                        <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIcon} />
                                        <Text style={globalStyles.noInternetConnectionLabelStyle}>{noInternetConnection}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection(1)}>
                                        <View style={{ padding: 10 }}>
                                            <Text style={globalStyles.refreshLabelStyle}>{refresh}</Text>
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

export default HomePage;