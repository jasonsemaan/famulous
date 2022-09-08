import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, BackHandler, TextInput, Alert } from "react-native";
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../Activities/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext, strings } from "../../../App";
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { ListCoverImageBackgroundComponent, ListDefaultImageBackgroundComponent, ContributorsDaysLeftComponent, NoJournalsComponent, ToggleCategoriesComponent, DrawerComponent, ListCoverImageBackgroundComponentArchived, ListDefaultImageBackgroundComponentArchived } from "../02-components/HomePageComponent";
import { NoInternetConnection } from "../02-components/ConnectionComponent";
import { ModalConnection } from "../02-components/ConnectionComponent";
import { getUser } from "../03-providers/UserProvider";
import { CreateJournal, InvitedJournalEditionsCall, JournalContributorsCall, JournalEditionsCall, UserInvitedJournals, UserJournals } from "../03-providers/JournalProvider";
import { ThemeContext } from "react-native-elements";
import { JournalContext } from "../04-context/Context";


const HomePage = ({ navigation }) => {

    const myContext = useContext(JournalContext);

    let [currentAppLanguage, setCurrentAppLanguage] = useState("");

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
    let [addyourownjournal, setAddyourownjournal] = useState("Add your own journal")

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
        try { // 0 if admin, 1 if contributor
            myContext.setAccessStatus(0)
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            myContext.setAppLanguage(await AsyncStorage.getItem('appLanguage'))
            setCurrentAppLanguage(await AsyncStorage.getItem('appLanguage'))

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
            setAddyourownjournal(strings.addyourownjournal)
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
                    myContext.setAccessStatus(0)
                } else {   // Contributor
                    setOtherJournalCategorie_Status(true)
                    setMyJournalCategorie_Status(false)
                    getAllInvitedJournalsbyUserUID()
                    setIsMyJournalOrOthers(1)
                    myContext.setAccessStatus(1)
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
                    myContext.setAccessStatus(0)
                    setModalStatus(false)
                    myJournalsList.push({ journalName: journalName })

                    CreateJournal(currentToken, journalName)
                        .then((response) => response.json())
                        .then((responseJson) => getAllJournalsByUser(currentToken))
                        .catch((error) => { alert("Something went wrong"), setLoading(false) })
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
        getUser(idToken)
            .then((response) => response.json())
            .then((responseJson) => saveUserUid(responseJson))
            .catch((error) => { console.log(error) })
    };

    const saveUserUid = (responseJson) => {
        myContext.setUserUid(responseJson.userUid)
        setSignedUserUid(responseJson.userUid)
    }

    /** call backend api to get all journals for the current user signed in */
    const getAllJournalsByUser = (idToken) => {
        setLoading(true)
        UserJournals(idToken)
            .then((response) => response.json())
            .then((responseJson) => saveDataList(0, responseJson, idToken))
            .catch((error) => { console.log(error) })
    };

    /** call backend api to get all the invitednjournals for the current user signed in */
    const getAllInvitedJournalsbyUserUID = () => {
        setLoading(true)
        UserInvitedJournals(currentToken)
            .then((response) => response.json())
            .then((responseJson) => saveDataList(1, responseJson, currentToken))
            .catch((error) => { console.log(error) })
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

                JournalEditionsCall(idToken, journalName)
                    .then((response) => response.json())
                    .then((responseJson) => storeDataIntoList(responseJson))
                    .catch((error) => { console.log(error) })
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

                InvitedJournalEditionsCall(ownerUID, journalName)
                    .then((response) => response.json())
                    .then((responseJson) => storeDataIntoList(responseJson))
                    .catch((error) => { console.log(error) })
            } else {
                setConnectionModalStatus(true)
            }
        });
    }

    /** insert admin and the key into DB */
    const getAllContributors = (journalRef) => {
        JournalContributorsCall(journalRef)
            .then((response) => response.json())
            .then((responseJson) => setContributorsNb(responseJson.length))
            .catch((error) => { console.log(error) })
    }

    /** store parameters in the AsyncStorage */
    const storeInfosIntoAsyncStorage = (journalName, journalRef, ownerUID) => {
        getAllContributors(journalRef)
        try {
            myContext.setJournalName(journalName);
            myContext.setJournalRef(journalRef + "");
            myContext.setAdmin(ownerUID);
        } catch (e) {
            console.log(e)
        }
    }

    /** function to store the response editions data into a current list */
    const storeDataIntoList = (response) => {
        var list = [];
        // for (let i = 0; i < response.length; i++) {
        //     if (response[i].archived != true) {
        //         list.push({ coverImage: response[i].coverImage, editionRef: response[i].editionRef, journalRef: response[i].journalRef, releaseDateFormated: response[i].releaseDateFormated })
        //     }
        // }
        setJournalsEditionsList(response)
        setLoading(false)
        // setJournalsEditionsList(list);
    }

    /** function called on click of item to navigate to the Journal Details page */
    const navigateToJournalDetails = (releaseDateMonth, editionRef, releaseDateFormated, coverImage, daysLeft) => {
        navigation.navigate('JournalDetails')
        myContext.setCoverImage(coverImage);
        myContext.setPreviewStatus(1);
        myContext.setEditionDaysLeft(daysLeft);
        myContext.setEditionRef(editionRef + "")
        myContext.setDateMonth(releaseDateMonth + " Journal")
        myContext.setEditionReleaseDate(releaseDateFormated)
    }

    const navigateToJournalPreview = (releaseDateMonth, editionRef, releaseDateFormated, coverImage) => {
        navigation.navigate('JournalPreview')
        myContext.setCoverImage(coverImage);
        myContext.setPreviewStatus(0);
        myContext.setEditionRef(editionRef + "")
        myContext.setDateMonth(releaseDateMonth + " Journal")
        myContext.setEditionReleaseDate(releaseDateFormated)
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

    useEffect(() => {
        checkConnection(0)
        // setTimeout(() => this.flatListRef.scrollToIndex({ index: 3 }),2000);
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
        if (currentAppLanguage == "fr") {
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
            // <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalDetails(month, item.editionRef, item.releaseDateFormated, item.coverImage)}>
            <View style={globalStyles.list_item}>
                <SafeAreaView style={globalStyles.safeAreaViewFlexCenterbackgroundWhite}>
                    {item.coverImage == "null" || item.coverImage == "" ? (
                        <View>
                            {item.archived == true ? (
                                <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalPreview(month, item.editionRef, item.releaseDateFormated, item.coverImage)}>
                                    <ListDefaultImageBackgroundComponentArchived month={month} year={year} />
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalDetails(month, item.editionRef, item.releaseDateFormated, item.coverImage, item.daysLeft)}>
                                    <ListDefaultImageBackgroundComponent month={month} year={year} />
                                </TouchableOpacity>
                            }
                        </View>
                    ) :
                        <View>
                            {item.archived == true ? (
                                <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalPreview(month, item.editionRef, item.releaseDateFormated, item.coverImage)}>
                                    <ListCoverImageBackgroundComponentArchived signedUserUid={signedUserUid} coverImage={item.coverImage} month={month} year={year} />
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity activeOpacity={1} onPress={() => navigateToJournalDetails(month, item.editionRef, item.releaseDateFormated, item.coverImage, item.daysLeft)}>
                                    <ListCoverImageBackgroundComponent signedUserUid={signedUserUid} coverImage={item.coverImage} month={month} year={year} />
                                </TouchableOpacity>
                            }
                        </View>
                    }
                </SafeAreaView>
            </View>
            // </TouchableOpacity>
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
                    <DrawerComponent modalTrue={() => setModalStatus(true)} openDrawer={() => navigation.openDrawer()} />
                    <ToggleCategoriesComponent toggleJournalsCategorie0={() => toggleJournalsCategorie(0)} toggleJournalsCategorie1={() => toggleJournalsCategorie(1)} myJournals={myJournals} otherJournals={otherJournals} isVisibleMyJournals={myJournalCategorie_Status} isVisibleOthers={otherJournalCategorie_Status} />

                    <View style={globalStyles.viewHorizontalListJouranal}>
                        {myJournalsList.length != 0 ? (
                            <FlatList showsHorizontalScrollIndicator={false} data={myJournalsList} renderItem={_renderItemCategorieJournals} horizontal={true} />
                        ) : <Text style={globalStyles.home_journalMonth}>{noJournals}</Text>
                        }
                    </View>

                    {myJournalsList.length != 0 ? (
                        <ContributorsDaysLeftComponent contributorsNb={contributorsNb} contributorss={contributorss} />
                    ) :
                        <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
                        </View>
                    }

                    <View style={globalStyles.home_list_div}>
                        <SafeAreaView style={globalStyles.viewFlex1}>
                            {myJournalsList.length != 0 ? (
                                // ref={(ref) => this.flatListRef = ref}
                                <FlatList showsVerticalScrollIndicator={false} data={journalEditionsList} renderItem={_renderItem} />
                            ) :
                                <NoJournalsComponent noJournals={youhavenojournalsatthismoment} addWithBtn={addJournalswiththeplusButton} />
                            }
                        </SafeAreaView>
                    </View>

                </SafeAreaView>
            ) :
                <NoInternetConnection noInternetConnection={noInternetConnection} checkyourconnection={checkyourconnectionthenrefreshthepage} checkConnection={() => checkConnection(0)} refresh={refresh} />
            }

            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '35%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center', }}>
                            <View style={globalStyles.modalViewCenter}>
                                <View style={globalStyles.alignItemsCenter}>
                                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                        <Image source={require('../../assets/paper.png')} style={{ width: 15, height: 15, marginRight: 10 }} />
                                        <Text style={{ color: 'black', fontSize: 12 }}>
                                            {addyourownjournal}
                                        </Text>
                                    </View>
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

            <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={() => checkConnection(1)} refresh={refresh} />
           
        </View>
       
    );


}

const styles = StyleSheet.create({

})

export default HomePage;