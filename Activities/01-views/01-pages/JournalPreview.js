import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Modal } from "react-native";
import { globalStyles } from "../../../Activities/03-constants/global";
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import { constants } from "../../03-constants/Constants";
import auth, { firebase } from '@react-native-firebase/auth';
import Toast, { DURATION } from 'react-native-easy-toast';
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";
import {
    PortraitDescComponentTop, LandscapeDescComponentTop, LandscapeNoDescComponentTop, PortraitDescComponentBottom, LandscapeDescComponentBottom, LandscapeNoDescComponentBottom,
    PortraitFullNoDescComponent, PortraitFullDescComponent, ImageBackgroundDefault, ImageBackgroundCover, SinglePageFooterComponent, PreviewFooterListItem, DescriptionViewOnlyComponent, DescriptionFullViewOnlyComponent
} from "../02-components/JournalPreviewComponent";
import { ModalConnection } from "../02-components/ConnectionComponent";
import { EditionImagesCall } from "../03-providers/ImagesProvider";
import { GeneratePDF, GetAllJournalContributors } from "../03-providers/JournalProvider";
import { GetEditionEvents } from "../03-providers/EventsProvider";
import { JournalContext } from "../04-context/Context";

const JournalPreview = ({ route, navigation }) => {
    const myContext = useContext(JournalContext);
    let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
    let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
    let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)
    let [contextPreviewStatus, setContextPreviewStatus] = useState(myContext.previewStatus)

    let [loading, setLoading] = useState(false);
    let [editionImagesList, setEditionImagesList] = useState([])
    let [currentToken, setCurrentToken] = useState("")
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)
    let [currentLanguage, setCurrentLanguage] = useState("")

    //Labels
    let [youhaveNoPhotosatThisMoment, setYouhaveNoPhotosatThisMoment] = useState("You have no photos at this moment!!")
    let [addphotostopreviewthejournal, setAddphotostopreviewthejournal] = useState("Add photos to preview the journal.")
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");

    /** get the tokenID */
    let getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                return;
            }
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData(idToken)
                setCurrentToken(idToken)
            });
        });
    }

    /** call backend api to get all journal edition images from db */
    let getAllJournalEditionImages = (token, editionRef) => {
        setLoading(true)
        EditionImagesCall(token, editionRef)
            .then((response) => response.json())
            .then((responseJson) => storeImagesList(responseJson))
            .catch((error) => { console.log(error) })
    }

    /** function to store response of the backend api into a current list */
    let storeImagesList = (response) => {
        console.log(response)
        setEditionImagesList(response)
        setLoading(false)
    }

    /** function to generate the PDF */
    let generatePDF = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                GeneratePDF(currentToken, contextEditionRef, contextJournalName, contextAppLanguage)
                    .then((response) => response.json())
                    .then((responseJson) => pdfCreated(responseJson))
                    .catch((error) => { console.log(error) })
            } else {
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        })
    }

    /** function called after pdf generate */
    const pdfCreated = (responseJson) => {
        if (responseJson.fileName.length != 0) {
            setLoading(false)
            this.toast.show("Success! Pdf has been successfully created", 2000)
        } else {
            setLoading(false)
            this.toast.show("Something wrong!", 2000)
        }
    }

    /** get params from async storage */
    const getAsyncStorageDataForNoConnection = async () => {
        try {
            strings.setLanguage(contextAppLanguage)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
        } catch (e) {
            console.log(e)
        }
    }

    /** get params from async storage */
    let getAsyncStorageData = async (idToken) => {
        try {
            getAllJournalEditionImages(idToken, contextEditionRef)
            setCurrentLanguage(contextAppLanguage)
            setYouhaveNoPhotosatThisMoment(strings.youhaveNoPhotosatThisMoment)
            setAddphotostopreviewthejournal(strings.addphotostopreviewthejournal)
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
                getTokenId()
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

    /** render the journal flatlist items view */
    let _renderItem = ({ item, index }) => {
        let frameId = item.frameId + "";

        let year1 = item.famImgStoreEntity1.UPLOAD_TIME[0]
        let month1 = item.famImgStoreEntity1.UPLOAD_TIME[1]
        let day1 = item.famImgStoreEntity1.UPLOAD_TIME[2]
        let formattedDate1 = day1 + "-" + month1 + "-" + year1

        let formattedDate2 = item.famImgStoreEntity2 != null ? item.famImgStoreEntity2.UPLOAD_TIME[2] + "-" + item.famImgStoreEntity2.UPLOAD_TIME[1] + "-" + item.famImgStoreEntity2.UPLOAD_TIME[0] : ""

        return (
            <View style={globalStyles.JournalPreview_pageStyle}>
                <PortraitFullDescComponent contributorUID={item.famImgStoreEntity1.CONTRIBUTER_UID} ImgPath={item.famImgStoreEntity1.IMG_PATH} profilePhotoPath={item.famImgStoreEntity1.PROFILE_PHOTO_PATH} UserName={item.famImgStoreEntity1.USER_NAME} formattedDate={formattedDate1} imgDescription={item.famImgStoreEntity1.IMG_DESCRIPTION} fontWeight={item.famImgStoreEntity1.FONT_WEIGHT} fontStyle={item.famImgStoreEntity1.FONT_STYLE} textDecoration={item.famImgStoreEntity1.TEXT_DECORATION} textDescColor={item.famImgStoreEntity1.TEXT_DESC} />
                <SinglePageFooterComponent pageNb={index + 1} journalName={contextJournalName} />
            </View>
        )
    };



    return (
        <View style={globalStyles.JournalPreview_main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={globalStyles.spinnerTextStyle}
            />

            <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                {editionImagesList.length != 0 ? (
                    <View>
                        <View style={globalStyles.JournalDetails_header}>
                            <View style={globalStyles.viewWidth100FlexRow}>
                                <View style={globalStyles.detailsHeaderLeftView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                        <View style={globalStyles.detailsLeftArrowIcon}>
                                            <Image style={globalStyles.backArrow} source={require('../../assets/left-arrow.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={globalStyles.detailsHeaderMiddleView}>
                                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo_MainPage} />
                                </View>
                                <View style={globalStyles.detailsHeaderRightView}>

                                </View>
                            </View>
                        </View>
                        <FlatList
                            data={editionImagesList}
                            renderItem={_renderItem}
                            ListHeaderComponent={<JournalMainPage />}
                            ListFooterComponent={<JournalFooterPage />}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
                ) :
                    <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
                        <Image source={require('../../assets/search_emptyList.png')} style={globalStyles.noInternetIconwidth60} />
                        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold', color: 'black' }}>{youhaveNoPhotosatThisMoment}</Text>
                        <Text style={globalStyles.textColorGrey}>{addphotostopreviewthejournal}</Text>

                        {contextPreviewStatus == 1 ? (
                            <TouchableOpacity onPress={() => navigation.navigate('JournalDetails')}>
                                <View style={{ marginTop: 50, width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: "grey", borderWidth: 1 }}>
                                    <Text style={{ color: 'black' }}>Back</Text>
                                </View>
                            </TouchableOpacity>
                        ) :
                            <TouchableOpacity onPress={() => navigation.navigate('Root')}>
                                <View style={{ marginTop: 50, width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: "grey", borderWidth: 1 }}>
                                    <Text style={{ color: 'black' }}>Back</Text>
                                </View>
                            </TouchableOpacity>
                        }
                    </View>
                }
            </SafeAreaView>
            {editionImagesList.length != 0 ? (
                <View style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 40, right: 25 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => generatePDF()}>
                        <Image style={{ width: 55, height: 55 }} source={require('../../assets/pdf.png')} />
                    </TouchableOpacity>
                </View>
            ) : null}
            <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh} />
            <Toast ref={(toast) => this.toast = toast} />
        </View>
    );
}

/** the first page view of the journal flatlist*/
const JournalMainPage = () => {
    const myContext = useContext(JournalContext);
    let [contextEditionReleaseDate, setContextEditionReleaseDate] = useState(myContext.EditionReleaseDate)
    let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
    let [contextCoverImage, setContextCoverImage] = useState(myContext.CoverImage)
    let [contextAdmin, setContextAdmin] = useState(myContext.Admin)

    useEffect(() => {
        return () => {
        }
    }, [])

    return (
        <View style={globalStyles.JournalPreview_pageStyle_MainPage}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, fontFamily: 'Didot Italic', color: '#9b56a2' }}>{contextJournalName}</Text>
            </View>
            <View style={{ width: '100%', borderColor: 'lightgrey', borderWidth: 3, marginBottom: 50 }}>
                {contextCoverImage == "null" ? (
                    <ImageBackgroundDefault selectedMonthYear={contextEditionReleaseDate} />
                ) :
                    <ImageBackgroundCover selectedMonthYear={contextEditionReleaseDate} admin={contextAdmin} coverImage={contextCoverImage} />
                }
            </View>
            <View style={{ width: 250, justifyContent: 'center', alignItems: 'center', height: 50 }}>
                <View>
                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo_MainPage} />
                </View>
            </View>
        </View>
    )
}

/** the last page view of the journal flatlist */
const JournalFooterPage = () => {

    const myContext = useContext(JournalContext);
    let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
    let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
    let [contextJournalRef, setContextJournalRef] = useState(myContext.JournalRef)

    let [contributorsList, setContributorsList] = useState([])
    let [holidaysEventsList, setHolidaysEventsList] = useState([])

    //Lables
    let [holidaysandEventsofthemonth, setHolidaysandEventsofthemonth] = useState("Holidays and Events of the month")
    let [contributorsofthejournal, setContributorsofthejournal] = useState("Contributors of the journal")
    let [noHolidaysandEventsatthismoment, setNoHolidaysandEventsatthismoment] = useState("No Holidays and Events at this moment")

    /** get all contributors for a specific journal */
    const getAllContributors = (journalRef) => {
        GetAllJournalContributors(journalRef)
            .then((response) => response.json())
            .then((responseJson) => saveContributorsIntoList(responseJson))
    }

    /** save response data into current list */
    const saveContributorsIntoList = (response) => {
        setContributorsList(response)
    }

    /** get data from asyncStorage */
    const getJournalInfos = async () => {
        setHolidaysandEventsofthemonth(strings.holidaysandEventsofthemonth)
        setContributorsofthejournal(strings.contributorsofthejournal)
        getAllContributors(contextJournalRef)
        getEditionEvents(contextEditionRef)
    }

    /** get all events to the selected edition from DB */
    const getEditionEvents = (editionRef) => {
        GetEditionEvents(editionRef)
            .then((response) => response.json())
            .then((responseJson) => saveResponseData(responseJson))
    }


    /** called on response of "getEditionEvents" to save the data into the list */
    const saveResponseData = (responseJson) => {
        setHolidaysEventsList(responseJson)
    }


    useEffect(() => {
        getJournalInfos()
        return () => {
        }
    }, [])

    /** function that return view of contributors list in the last page  */
    const renderItem_Contributors_footer = ({ item }) => {
        return (
            <PreviewFooterListItem ownerUid={item.OWNER_UID} UserName={item.USER_NAME} />
        )
    }

    return (
        <View style={globalStyles.JournalPreview_pageStyle_FooterPage}>
            <View style={{ height: 10, backgroundColor: '#5ec6ca', width: '100%' }}>
            </View>
            <View style={{ flex: 1, width: '100%', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: '#9b56a2', marginTop: 30 }}>{holidaysandEventsofthemonth}</Text>
                {holidaysEventsList.length != 0 ? (
                    <View style={{ marginTop: 10 }}>
                        {holidaysEventsList.map((item) => {
                            return (
                                <View style={{ marginTop: 10, alignItems: 'center' }}>
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ fontSize: 11, color: 'black', width: '30%' }}>{item.userName}</Text>
                                        <Text style={{ fontSize: 11, color: '#5ec6ca', width: '30%', textAlign: 'center' }}>{item.eventDate}</Text>
                                        <Text style={{ fontSize: 11, color: '#F25278', width: '30%' }}>{item.eventDescription}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                ) :
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ color: "lightgrey", fontSize: 11 }}>{noHolidaysandEventsatthismoment}</Text>
                    </View>
                }
                <Text style={{ fontSize: 14, color: '#9b56a2', marginTop: 40 }}>{contributorsofthejournal}</Text>
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={contributorsList}
                        renderItem={renderItem_Contributors_footer}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.id}
                        numColumns={2}
                    />
                </View>
            </View>

            <View style={globalStyles.previewFooterPageItemListView}>
                <Text style={globalStyles.purpleBoldLable}>{contextJournalName}</Text>
                <Text style={globalStyles.purpleBoldLable}></Text>
                <View>
                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo} />
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    listContainer: {
        width: 380
    }
})

export default JournalPreview;

