import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, BackHandler, TextInput, ImageBackground } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import auth, { firebase } from '@react-native-firebase/auth';
import { unregister, callIntercept } from "../../03-constants/Interceptor";
import { globalStyles } from "../../../01-app/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { strings } from "../../../App";
import { constants } from "../../03-constants/Constants";
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { useIsFocused } from '@react-navigation/native';


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
    let [appLanguage, setAppLanguage] = useState(false);
    let [isMyJournalOrOthers, setIsMyJournalOrOthers] = useState(0);
    let [contributorsNb, setContributorsNb] = useState(0);
    let [daysLeftFromDB, setDaysLeftFromDB] = useState(0);
    let [accessStatus, setAccessStatus] = useState(0);
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


    /**
     * get the tokenID
     */
    const getTokenId = () => {
        setLoading(true)
        auth().onAuthStateChanged(function (user) {
            user.getIdToken().then(function (idToken) {
                console.log("idToken", idToken);
                setCurrentToken(idToken)
                getAllJournalsByUser(idToken)
                getUserProfile(idToken)
                getAsyncStorageData()
            });
        });
    }


    /**
     *  get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            await AsyncStorage.setItem('accessStatus', '0') // 0 if admin, 1 if contributor
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setAppLanguage(await AsyncStorage.getItem('appLanguage'))
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


    /**
     *  function to disable the mobile back button action
     */
    const backAction = () => {
        // BackHandler.exitApp()
        navigation.goBack(null);
        return true;
    }


    /**
     *  function to toggle view between MyJournals btn and OtherJournals btn
     */
    const toggleJournalsCategorie = (status) => {
        NetInfo.fetch().then(state => {
            console.log(state)
            if (state.isConnected == true) {
                if (status === 0) {   // Admin
                    setMyJournalCategorie_Status(true)
                    setOtherJournalCategorie_Status(false)
                    getAllJournalsByUser(currentToken)
                    setIsMyJournalOrOthers(0)
                    AsyncStorage.setItem('accessStatus', '0')
                    setAccessStatus(0)
                } else {   // Contributor
                    setOtherJournalCategorie_Status(true)
                    setMyJournalCategorie_Status(false)
                    getAllInvitedJournalsbyUserUID()
                    setIsMyJournalOrOthers(1)
                    AsyncStorage.setItem('accessStatus', '1')
                    setAccessStatus(1)
                }
            } else {
                setConnectionModalStatus(true)
            }
        });

    }


    /**
     * call backend api and add journal to the db
     */
    const addJournal = () => {
        NetInfo.fetch().then(state => {
            console.log(state)
            if (state.isConnected == true) {
                if(journalName != ""){
                    getTokenId()
                    setMyJournalCategorie_Status(true)
                    setOtherJournalCategorie_Status(false)
                    AsyncStorage.setItem('accessStatus', '0')
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
                }else{
                    this.toast.show(pleasetypeavalidjournalname, 2000)
                }
              
            } else {
                setConnectionModalStatus(true)
            }
        });

    }


    /**
     * call backend api to get the user signed profile
     * @param {*} idToken getted automatically at the start of the app
     */
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
    };

    const saveUserUid = (responseJson) => {
        AsyncStorage.setItem('UserUid', responseJson.userUid)
        setSignedUserUid(responseJson.userUid)
    }


    /**
     * call backend api to get all journals for the current user signed in
     * @param {*} idToken getted automatically at the start of the app
     */
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
    };


    /**
     * call backend api to get all the invitednjournals for the current user signed in
     */
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
    };


    /**
     *  function to store data from db into a current list & load journalEditions
     * @param {*} response from the response of backend getAllJournals api
     * @param {*} idToken 
     */
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


    /**
     *  call backend api to get all journal editions to the selected journal
     */
    const getJournalsEditionsbyJournalNameAndUserUID = (index, idToken, journalName, journalRef, ownerUID, daysLeft) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                storeInfosIntoAsyncStorage(journalName, journalRef, ownerUID)
                setLoading(true)
                setJournalIndexSelected(index)
                setDaysLeftFromDB(daysLeft)
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
            } else {
                setConnectionModalStatus(true)
            }
        });


    }

    /**
     *  call backend api to get all journal editions to the selected invited journal
     */
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
            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /**
     *  insert admin and the key into DB
     */
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
            .then((responseJson) => saveResponseIntoList(responseJson))
    }

    /**
     *  save the response Length of contributors list 
     */
    const saveResponseIntoList = (response) => {
        setContributorsNb(response.length)
    }

    /**
     *  store parameters in the AsyncStorage
     */
    const storeInfosIntoAsyncStorage = async (journalName, journalRef, ownerUID) => {
        getAllContributors(journalRef)
        try {
            await AsyncStorage.setItem('JournalName', journalName)
            await AsyncStorage.setItem('JournalRef', journalRef + "")
            await AsyncStorage.setItem('Admin', ownerUID)
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * function to store the response editions data into a current list
     * @param {*} response from the backend api
     */
    const storeDataIntoList = (response) => {
        setJournalsEditionsList(response)
        setLoading(false)
    }


    /**
      *  function called on click of item to navigate to the Journal Details page
      */
    const navigateToJournalDetails = (releaseDateMonth, editionRef, releaseDateFormated, coverImage) => {
        navigation.navigate('JournalDetails', { admin: releaseDateMonth + " Journal" })
        storeEditionRef(editionRef)
        AsyncStorage.setItem('EditionReleaseDate', releaseDateFormated)
        AsyncStorage.setItem('CoverImage', coverImage)
    }


    /**
      *  function to store in the asyncStorage the edition ref selected 
      */
    const storeEditionRef = async (editionRef) => {
        try {
            await AsyncStorage.setItem('editionRef', editionRef + "")
        } catch (e) {
            console.log(e)
        }
    }


    /**
     *  function to check if internet connection is enable or not
     */
    const checkConnectionIntern = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getTokenId();
                setIsConnectedToInternet(true)
                setConnectionModalStatus(false)
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageData()
                setLoading(false)
            }
        });
    }

    /**
      *  function to check if internet connection is enable or not
      */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log("Is connected?", state);
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
    }

    useEffect(() => {
        checkConnection()
        BackHandler.addEventListener("hardwareBackPress", backAction);
        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);


    /**
     *  render for the subJournals horizontal flatlist Items
     */
    const _renderItemCategorieJournals = ({ item, index }) => {
        return (
            <View style={{ alignSelf: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => { isMyJournalOrOthers == 0 ? getJournalsEditionsbyJournalNameAndUserUID(index, currentToken, item.journalName, item.journalRef, item.ownerUid, item.daysLeft) : getInvitedJournalsEditionsbyJournalNameAndUserUID(index, item.journalName, item.journalRef, item.ownerUID) }}>
                    <Text style={journalIndex_selected === index ? globalStyles.home_journalMonth_selected : globalStyles.home_journalMonth}>{item.journalName}</Text>
                </TouchableOpacity>
            </View>
        )
    }


    /**
     *  render to main flatfist Items
     */
    const _renderItem = ({ item }) => {
        var releaseDate = item.releaseDateFormated.split(" ");
        var year = releaseDate[1]
        var month = ""
        if (appLanguage == "fr") {
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
                    {/* <View style={globalStyles.row_div}>
                        <View style={{ width: '50%' }}>
                            <Text style={globalStyles.home_listitem_name}>{month}</Text>
                            <View style={globalStyles.row_div}>
                                <Text style={globalStyles.home_listItem_Contributors_Days}>{contributorsNb} {contributorss}</Text>
                                <Text style={globalStyles.home_listitem_bulletpoint}>•</Text>
                                <Text style={globalStyles.home_listItem_Contributors_Days}>8 {daysLeft}</Text>
                            </View>
                        </View>
                        <View style={{ width: '50%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                            <Image source={require('../../../assets/list_yellow_icon.png')} style={globalStyles.list_yellow_logo}></Image>
                        </View>
                    </View> */}
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: 'white' }}>
                        {item.coverImage == "null" || item.coverImage == "" ? (
                            <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground} source={require('../../../assets/defaultCover.jpg')} >
                                <View style={{ backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '40%', marginTop: 'auto', top: 12, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{month} {year}</Text>
                                </View>
                            </ImageBackground>
                        ) :
                            <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground}
                                source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/" + item.coverImage }} >
                                <View style={{ backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '40%', marginTop: 'auto', top: 12, borderRadius: 5 }}>
                                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 12 }}>{month} {year}</Text>
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
                textStyle={{ fontSize: 12, color: 'white' }}
            />
            {isConnectedToInternet == true ? (
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={globalStyles.home_header_div}>
                        <View style={globalStyles.home_header_row_div}>
                            <TouchableWithoutFeedback onPress={() => navigation.openDrawer()}>
                                <View style={{ padding: 7, width: 45 }}>
                                    <Image source={require('../../../assets/home_menu_icon.png')} style={globalStyles.home_menu_logo} />
                                </View>
                            </TouchableWithoutFeedback>
                            <Image source={require('../../../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo}></Image>
                            <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10 }} onPress={() => setModalStatus(true)}>
                                <Image source={require('../../../assets/home_plus_icon.png')} style={globalStyles.home_plus_logo}></Image>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
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

                    <View style={{ justifyContent: 'center', height: 50, backgroundColor: '#F5F5F5', marginTop: 10, borderRadius: 5 }}>
                        {myJournalsList.length != 0 ? (
                            <FlatList showsHorizontalScrollIndicator={false} data={myJournalsList} renderItem={_renderItemCategorieJournals} horizontal={true} />
                        ) : <Text style={globalStyles.home_journalMonth}>{noJournals}</Text>
                        }
                    </View>

                    {myJournalsList.length != 0 ? (

                        <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
                            <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                                <Image source={require('../../../assets/group.png')} style={{ width: 18, height: 18, marginRight: 5, marginLeft: 5 }}></Image>
                                <Text style={globalStyles.home_listItem_Contributors_Days}>{contributorsNb} {contributorss}</Text>
                            </View>
                            {accessStatus === 0 ? (
                                <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                                    <Text style={globalStyles.home_listitem_bulletpoint}>•</Text>
                                    <Image source={require('../../../assets/clock.png')} style={{ width: 18, height: 18, marginRight: 5 }}></Image>
                                    <Text style={globalStyles.home_listItem_Contributors_Days}>{daysLeftFromDB} {daysLeft}</Text>
                                </View>
                            ) : null}
                        </View>
                    ) :
                        <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
                        </View>
                    }
                    <View style={globalStyles.home_list_div}>
                        <SafeAreaView style={{ flex: 1 }}>
                            {myJournalsList.length != 0 ? (
                                <FlatList showsVerticalScrollIndicator={false} data={journalEditionsList} renderItem={_renderItem} />
                            ) :
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                                    <Image source={require('../../../assets/emptyJournal.png')} style={{ width: 60, height: 60, marginBottom: 30 }}></Image>
                                    <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold',color: 'black' }}>{youhavenojournalsatthismoment}</Text>
                                    <Text style={{ color: 'grey' }}>{addJournalswiththeplusButton}</Text>
                                </View>
                            }
                        </SafeAreaView>
                    </View>
                </SafeAreaView>
            ) :
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                        <Image source={require('../../../assets/no-internet.png')} style={{ width: 60, height: 60, marginBottom: 30 }}></Image>
                        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold',color: 'black' }}>{noInternetConnection}</Text>
                        <Text style={{ color: 'grey' }}>{checkyourconnectionthenrefreshthepage}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection()}>
                            <View style={globalStyles.resetPassword_button}>
                                <Text style={globalStyles.Wel_Log_buttonLabel}>{refresh}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }

            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={{ flex: 1 }} onPress={() => setModalStatus(false)}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '25%', borderTopLeftRadius:30,borderTopRightRadius:30, alignItems: 'center',}}>
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10 }}>

                                <View style={{ alignItems: 'center' }}>
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
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '10%', borderRadius: 10, alignItems: 'center', marginBottom: 50, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../assets/no-internet.png')} style={{ width: 30, height: 30, marginLeft: 10 }}></Image>
                                        <Text style={globalStyles.noInternetConnectionLabelStyle}>{noInternetConnection}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnectionIntern()}>
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

export default HomePage;