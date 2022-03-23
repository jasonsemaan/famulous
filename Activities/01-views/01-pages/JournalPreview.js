import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Modal } from "react-native";
import { globalStyles } from "../../../Activities/03-constants/global";
import FastImage from 'react-native-fast-image'
import Spinner from 'react-native-loading-spinner-overlay';
import { constants } from "../../03-constants/Constants";
import auth, { firebase } from '@react-native-firebase/auth';
import Toast, { DURATION } from 'react-native-easy-toast';
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";
import { PortraitDescComponent } from "../02-components/JournalPreviewComponent";

const JournalPreview = ({ route, navigation }) => {
    var admin = route.params.adminName;
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
        fetch(constants.apiIP + "journal/selectEditionImages", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                editionRef: editionRef
            })
        })
            .then((response) => response.json())
            .then((responseJson) => storeImagesList(responseJson))
            .catch((error)=>{console.log(error)})
    }

    /** function to store response of the backend api into a current list */
    let storeImagesList = (response) => {
        setEditionImagesList(response)
        setLoading(false)
    }

    /** function to generate the PDF */
    let generatePDF = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                fetch(constants.apiIP + "pdfGenerator/generate", {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + currentToken
                    },
                    body: JSON.stringify({
                        editionRef: global.EditionRef,
                        journalName: global.JournalName,
                        lang: currentLanguage
                    })
                })
                    .then((response) => response.json())
                    .then((responseJson) => pdfCreated(responseJson))
                    .catch((error)=>{console.log(error)})
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
            strings.setLanguage(global.appLanguage)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
        } catch (e) {
            console.log(e)
        }
    }

    /** get params from async storage */
    let getAsyncStorageData = async (idToken) => {
        try {
            getAllJournalEditionImages(idToken, global.EditionRef)
            setCurrentLanguage(global.appLanguage)
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
                {frameId.substring(0, 1) === "S" ? (
                    <View>
                        {item.famImgStoreEntity1.IMG_ORIENTATION === "PORTRAIT" ? (
                            <PortraitDescComponent contributorUID={item.famImgStoreEntity1.CONTRIBUTER_UID} ImgPath={item.famImgStoreEntity1.IMG_PATH} profilePhotoPath={item.famImgStoreEntity1.PROFILE_PHOTO_PATH} UserName={item.famImgStoreEntity1.USER_NAME} formattedDate1={formattedDate1} imgDescription={item.famImgStoreEntity1.IMG_DESCRIPTION}/>
                        ) : item.famImgStoreEntity1.IMG_ORIENTATION === "LANDSCAPE" && item.famImgStoreEntity1.IMG_DESCRIPTION_VISIBLE === 1 ? (
                            <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
                                <View style={globalStyles.landscape_width50}>
                                    <View style={globalStyles.landscape_width100_preview}>
                                        <FastImage
                                            style={{ width: '100%', height: '70%' }}
                                            source={{
                                                uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.IMG_PATH,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </View>
                                    <View style={globalStyles.landscape_rightView}>
                                        <View style={globalStyles.landscape_closeView}>
                                        </View>
                                        <View style={{ marginTop: 40 }}>
                                            <FastImage
                                                style={globalStyles.imageRounded40}
                                                source={{
                                                    uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.PROFILE_PHOTO_PATH,
                                                }}
                                                resizeMode={FastImage.resizeMode.cover}
                                            />
                                        </View>
                                        <View style={{ marginTop: 15, alignSelf: 'center' }}>
                                            <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity1.USER_NAME}</Text>
                                            <Text style={globalStyles.journal_text_styles_date_preview}>{formattedDate1}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={globalStyles.landscape_description_preview}>
                                    <Text style={globalStyles.journal_text_styles_description_grey}>{item.famImgStoreEntity1.IMG_DESCRIPTION}</Text>
                                </View>
                            </View>
                        ) : item.famImgStoreEntity1.IMG_ORIENTATION === "LANDSCAPE" && item.famImgStoreEntity1.IMG_DESCRIPTION_VISIBLE === 0 ? (
                            <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
                                <View style={globalStyles.landscape_width50_column_withoutDesc}>
                                    <View style={globalStyles.landscape_width100_preview_withoutDesc}>
                                        <FastImage
                                            style={{ width: '100%', height: '85%' }}
                                            source={{
                                                uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.IMG_PATH,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </View>

                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', bottom: 45 }}>
                                    <View>
                                        <FastImage
                                            style={globalStyles.imageRounded40}
                                            source={{
                                                uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.PROFILE_PHOTO_PATH,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </View>
                                    <View style={globalStyles.titlesMarginLeft10}>
                                        <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity1.USER_NAME}</Text>
                                    </View>
                                    <View style={globalStyles.titlesMarginLeft15}>
                                        <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{formattedDate1}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : null
                        }



                        {item.famImgStoreEntity2 != null ? (
                            <View>
                                {item.famImgStoreEntity2.IMG_ORIENTATION === "PORTRAIT" ? (
                                    <View style={globalStyles.journal_upload_item_view_portrait_50pourcent_withoutborder}>
                                        <View style={globalStyles.portrait_width50}>
                                            <View style={globalStyles.portrait_width100_preview}>
                                                <FastImage
                                                    style={{ width: '100%', height: 230, top: 70 }}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.IMG_PATH,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                        </View>
                                        <View style={globalStyles.portrait_2ndView50}>
                                            <View style={globalStyles.portrait_closeView}>
                                            </View>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.imageRounded40}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.PROFILE_PHOTO_PATH,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={{ marginTop: 15 }}>
                                                <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity2.USER_NAME}</Text>
                                                <Text style={globalStyles.journal_text_styles_date_preview}>{formattedDate2}</Text>
                                            </View>
                                            <View style={globalStyles.portrait_description}>
                                                <Text style={globalStyles.journal_text_styles_description_grey}>{item.famImgStoreEntity2.IMG_DESCRIPTION}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : item.famImgStoreEntity2.IMG_ORIENTATION === "LANDSCAPE" && item.famImgStoreEntity2.IMG_DESCRIPTION_VISIBLE === 1 ? (
                                    <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
                                        <View style={globalStyles.landscape_width50}>
                                            <View style={globalStyles.landscape_width100_preview}>
                                                <FastImage
                                                    style={{ width: '100%', height: '70%', marginTop: 10 }}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.IMG_PATH,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={globalStyles.landscape_rightView}>
                                                <View style={globalStyles.landscape_closeView}>
                                                </View>
                                                <View style={{ marginTop: 40 }}>
                                                    <FastImage
                                                        style={globalStyles.imageRounded40}
                                                        source={{
                                                            uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.PROFILE_PHOTO_PATH,
                                                        }}
                                                        resizeMode={FastImage.resizeMode.cover}
                                                    />
                                                </View>
                                                <View style={{ marginTop: 15, alignSelf: 'center' }}>
                                                    <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity2.USER_NAME}</Text>
                                                    <Text style={globalStyles.journal_text_styles_date_preview}>{formattedDate2}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <View style={globalStyles.landscape_description_preview}>
                                            <Text style={globalStyles.journal_text_styles_description_grey}>{item.famImgStoreEntity2.IMG_DESCRIPTION}</Text>
                                        </View>
                                    </View>
                                ) : item.famImgStoreEntity2.IMG_ORIENTATION === "LANDSCAPE" && item.famImgStoreEntity2.IMG_DESCRIPTION_VISIBLE === 0 ? (
                                    <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
                                        <View style={globalStyles.landscape_width50_column_withoutDesc}>
                                            <View style={globalStyles.landscape_width100_preview_withoutDesc}>
                                                <FastImage
                                                    style={{ width: '100%', height: '85%' }}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.IMG_PATH,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>

                                        </View>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', bottom: 45 }}>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.imageRounded40}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity2.CONTRIBUTER_UID + "/" + item.famImgStoreEntity2.PROFILE_PHOTO_PATH,
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={globalStyles.titlesMarginLeft10}>
                                                <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity2.USER_NAME}</Text>
                                            </View>
                                            <View style={globalStyles.titlesMarginLeft15}>
                                                <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{formattedDate1}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ) : null
                                }
                            </View>
                        ) : null
                        }

                    </View>

                ) : frameId.substring(0, 1) === "F" && item.famImgStoreEntity1.IMG_DESCRIPTION_VISIBLE === 0 ? (
                    <View style={{ width: '100%', height: '97%' }}>
                        <View style={globalStyles.journal_Preview_portraitFullScreen}>
                            <View style={{ height: 500 }}>
                                <FastImage
                                    style={{ width: '100%', height: '82%' }}
                                    source={{
                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.IMG_PATH,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 75 }}>
                                <View >
                                    <FastImage
                                        style={globalStyles.imageRounded40}
                                        source={{
                                            uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.PROFILE_PHOTO_PATH,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={globalStyles.titlesMarginLeft10}>
                                    <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity1.USER_NAME}</Text>
                                </View>
                                <View style={globalStyles.titlesMarginLeft10}>
                                    <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{formattedDate1}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                ) :
                    <View style={{ width: '100%', height: '97%' }}>
                        <View style={globalStyles.journal_Preview_portraitFullScreen}>
                            <View style={{ height: 500 }}>
                                <FastImage
                                    style={{ width: '100%', height: '75%' }}
                                    source={{
                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.IMG_PATH,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 110 }}>
                                <Text style={globalStyles.journal_text_styles_description_grey}>{item.famImgStoreEntity1.IMG_DESCRIPTION}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 85 }}>
                                <View>
                                    <FastImage
                                        style={globalStyles.imageRounded40}
                                        source={{
                                            uri: constants.apiIP + "download/byuser/bypath?path=" + item.famImgStoreEntity1.CONTRIBUTER_UID + "/" + item.famImgStoreEntity1.PROFILE_PHOTO_PATH,
                                        }}
                                        resizeMode={FastImage.resizeMode.cover}
                                    />
                                </View>
                                <View style={globalStyles.titlesMarginLeft10}>
                                    <Text style={globalStyles.journal_text_styles}>{item.famImgStoreEntity1.USER_NAME}</Text>
                                </View>
                                <View style={globalStyles.titlesMarginLeft10}>
                                    <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{formattedDate1}</Text>
                                </View>
                            </View>

                        </View>
                    </View>
                }

                <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30, position: 'absolute', bottom: 15 }}>
                    <Text style={globalStyles.purpleBoldLable}>{global.JournalName}</Text>
                    <Text style={globalStyles.purpleBoldLable}>{index + 1}</Text>
                    <View>
                        <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo}/>
                    </View>
                </View>
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

            <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center' }}>
                {editionImagesList.length != 0 ? (
                    <FlatList
                        data={editionImagesList}
                        renderItem={_renderItem}
                        ListHeaderComponent={<JournalMainPage />}
                        ListFooterComponent={<JournalFooterPage />}
                        showsVerticalScrollIndicator={false}
                    />
                ) :
                    <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
                        <Image source={require('../../assets/search_emptyList.png')} style={globalStyles.noInternetIconwidth60}/>
                        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold', color: 'black' }}>{youhaveNoPhotosatThisMoment}</Text>
                        <Text style={globalStyles.textColorGrey}>{addphotostopreviewthejournal}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('JournalDetails', { admin: admin })}>
                            <View style={{ marginTop: 50, width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: "grey", borderWidth: 1 }}>
                                <Text style={{ color: 'black' }}>Back</Text>
                            </View>
                        </TouchableOpacity>
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

            <Modal transparent={true} visible={connectionModalStatus}>
                <TouchableOpacity activeOpacity={1} style={globalStyles.viewFlex1}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={globalStyles.modalSubDivstyle}>
                            <View style={globalStyles.modalSubDivstyle2}>
                                <View style={globalStyles.modalSubDivstyle3}>
                                    <View style={globalStyles.viewRowAlignCenter}>
                                        <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIcon}/>
                                        <Text style={globalStyles.noInternetConnectionLabelStyle}>{noInternetConnection}</Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection()}>
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

            <Toast ref={(toast) => this.toast = toast} />
        </View>

    );

}


/** the first page view of the journal flatlist*/
const JournalMainPage = () => {

    useEffect(() => {
        console.log("Cover: ", global.CoverImage)
        return () => {
        }
    }, [])

    return (
        <View style={globalStyles.JournalPreview_pageStyle_MainPage}>
            <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 40, fontFamily: 'Didot Italic', color: '#9b56a2' }}>{global.JournalName}</Text>
            </View>
            <View style={{ width: '100%', borderColor: 'lightgrey', borderWidth: 3, marginBottom: 50 }}>
                {global.CoverImage == "null" ? (
                    <ImageBackground style={globalStyles.journalPreview_MainPage_ImgBackground} source={require('../../assets/defaultCover.jpg')}>
                        <View style={{ backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '60%', marginTop: 'auto', top: 15, borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{global.EditionReleaseDate}</Text>
                        </View>
                    </ImageBackground>
                ) :
                    <ImageBackground style={globalStyles.journalPreview_MainPage_ImgBackground} source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + global.Admin + "/" + global.CoverImage }}>
                        <View style={{ backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '60%', marginTop: 'auto', top: 15, borderRadius: 5 }}>
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>{global.EditionReleaseDate}</Text>
                        </View>
                    </ImageBackground>
                }
            </View>

            <View style={{ width: 250, justifyContent: 'center', alignItems: 'center', height: 50 }}>
                <View>
                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo_MainPage}/>
                </View>
            </View>
        </View>
    )
}


/** the last page view of the journal flatlist */
const JournalFooterPage = () => {
    let [contributorsList, setContributorsList] = useState([])
    let [holidaysEventsList, setHolidaysEventsList] = useState([])


    //Lables
    let [holidaysandEventsofthemonth, setHolidaysandEventsofthemonth] = useState("Holidays and Events of the month")
    let [contributorsofthejournal, setContributorsofthejournal] = useState("Contributors of the journal")
    let [noHolidaysandEventsatthismoment, setNoHolidaysandEventsatthismoment] = useState("No Holidays and Events at this moment")

    /** get all contributors for a specific journal */
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
        getAllContributors(global.JournalRef)
        getEditionEvents(global.EditionRef)
    }

    /** get all events to the selected edition from DB */
    const getEditionEvents = (editionRef) => {
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


    /** called on response of "getEditionEvents" to save the data into the list */
    const saveResponseData = (responseJson) => {
        setHolidaysEventsList(responseJson)
    }


    useEffect(() => {
        getJournalInfos()
        return () => {
        }
    }, [])


    /** function that return view of events list in the last page */
    const renderItem_footer = ({ item }) => {
        return (
            <View style={{ marginTop: 10 }}>
                <View style={globalStyles.flexRow}>
                    <Text style={{ fontSize: 12, color: 'black', marginRight: 20 }}>{item.name}</Text>
                    <Text style={{ fontSize: 12, color: '#5ec6ca', marginLeft: 10, marginRight: 10 }}>{item.date}</Text>
                    <Text style={{ fontSize: 12, color: '#F25278', marginLeft: 20 }}>{item.desc}</Text>
                </View>
            </View>
        )
    }


    /** function that return view of contributors list in the last page  */
    const renderItem_Contributors_footer = ({ item }) => {
        return (
            <View style={{ marginTop: 10, width: '50%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                    <FastImage
                        style={globalStyles.imageRounded40}
                        source={{
                            uri: constants.apiIP + "download/byuser/bypath?path=" + item.OWNER_UID + "/profile.jpg",
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    <Text style={{ fontSize: 10, color: 'black', marginRight: 20, marginLeft: 10 }}>{item.USER_NAME}</Text>
                </View>
            </View>
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
                                        <Text style={{ fontSize: 11, color: '#5ec6ca', width: '30%' }}>{item.eventDate}</Text>
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

            <View style={{ width: 250, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30, position: 'absolute', bottom: 15 }}>
                <Text style={globalStyles.purpleBoldLable}>{global.JournalName}</Text>
                <Text style={globalStyles.purpleBoldLable}></Text>
                <View>
                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo}/>
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

