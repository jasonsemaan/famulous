import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, Modal, Switch, FlatList } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { launchImageLibrary } from 'react-native-image-picker';
import { globalStyles } from "../../../Activities/03-constants/global";
import auth, { firebase } from '@react-native-firebase/auth';
import { strings } from "../../../App";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { ModalDetailsComponent } from "../02-components/JournalDetailsComponents";
import { getUser } from "../03-providers/UserProvider";
import { StoreImage } from "../03-providers/ImagesProvider";
import { JournalContext } from "../04-context/Context";
import ImageResizer from "react-native-image-resizer";
import { ColorPicker } from 'react-native-color-picker';
import {
    PortraitFullDescComponent, ImageBackgroundDefault, ImageBackgroundCover, SinglePageFooterComponent, PreviewFooterListItem, DescriptionViewOnlyComponent, DescriptionFullViewOnlyComponent
} from "../02-components/JournalPreviewComponent";
import { EditionImagesCall } from "../03-providers/ImagesProvider";
import { GeneratePDF, GetAllJournalContributors } from "../03-providers/JournalProvider";
import { GetEditionEvents } from "../03-providers/EventsProvider";
import DraggableFlatList from "react-native-draggable-flatlist";


const JournalDetails = ({ route, navigation }) => {
    const myContext = useContext(JournalContext);

    let [contextAccessStatus, setContextAccessStatus] = useState(myContext.accessStatus)
    let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
    let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
    let [contextEditionDaysLeft, setContextEditionDaysLeft] = useState(myContext.editionDaysLeft)
    let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)

    let [currentToken, setCurrentToken] = useState('')
    let [loading, setLoading] = useState(false)
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)

    let [colorPickerModal, setColorPickerModal] = useState(false)


    let [mode, setMode] = useState('contain')
    let [onlyScaleDown, setOnlyScaleDown] = useState(false)

    let [editionImagesList, setEditionImagesList] = useState([])



    //Labels
    let [preview, setPreview] = useState('Preview')
    let [daysLeft, setDaysLeft] = useState("Days Left");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");





    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                return;
            }
            user.getIdToken().then(function (idToken) {
                myContext.setToken(idToken);
                getAllJournalEditionImages(idToken, contextEditionRef)
                setCurrentToken(idToken)
            });
        });
    }

    /**  get params from async storage  */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(contextAppLanguage)
            setPreview(strings.preview)
            setDaysLeft(strings.daysLeft)
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
                getAsyncStorageData();
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                getAsyncStorageData()
                setConnectionModalStatus(true)
                setLoading(false)
            }
        });
    }

    

    let _renderItem = ({ item, index, drag }) => {
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


    let getAllJournalEditionImages = (token, editionRef) => {
        setLoading(true)
        EditionImagesCall(token, editionRef)
            .then((response) => response.json())
            .then((responseJson) => storeImagesList(responseJson))
            .catch((error) => { console.log(error) })
    }

    /** function to store response of the backend api into a current list */
    let storeImagesList = (response) => {
        console.log(response.length)
        setEditionImagesList(response)
        myContext.setPreviewListSize(response.length)
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

    useEffect(() => {
        checkConnection();
        return () => {
        }
    }, [])




    return (
        <SafeAreaView style={globalStyles.JournalDetails_main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={globalStyles.spinnerTextStyle}
            />
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
                        {/* <Text style={globalStyles.detailsSelectedJournalNameTitle}>{contextJournalName}</Text>
                        <Text style={globalStyles.detailsSelectedmonthTitle}>{dateMonthSelected}</Text> */}
                        <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo_MainPage} />
                    </View>
                    <View style={globalStyles.detailsHeaderRightView}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings')}>
                            <Image style={globalStyles.detailsSettingsIcon} source={require('../../assets/settingIcon.png')} /></TouchableOpacity>
                    </View>
                </View>
            </View>

            <View style={{ flex: 1, marginTop: 10 }}>
                <View style={{ padding: 5, marginBottom: 10, borderBottomColor: '#F5F5F5', borderBottomWidth: 1 }}>
                    {/* <View style={{ width: '100%' }}>
                        <Text style={{ fontSize: 11, color: '#5ec6ca', fontWeight: 'bold', marginLeft: 25 }}>{contextEditionDaysLeft} {daysLeft}</Text>
                    </View> */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1, alignItems: 'center' }}>
                        <View style={globalStyles.viewWidth100FlexRow}>
                            {contextAccessStatus == 0 ? (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSorting')}>
                                    <View style={{flexDirection:'row',padding:5}}>
                                    <Image style={{marginLeft: 20,width:18,height:18}} source={require('../../assets/editpurple.png')} />
                                    <Text style={{marginLeft: 5, color: '#9b56a2',fontWeight: 'bold',}}>Edit</Text>
                                    </View>
                                </TouchableOpacity>
                            ) : null
                            }
                            <View style={{ justifyContent: 'center' }}>
                            <View style={{flexDirection:'row'}}>
                            <Image style={{marginLeft: 20,width:18,height:18}} source={require('../../assets/timedays.png')} />
                                <Text style={{ color: '#5ec6ca', fontWeight: 'bold', marginLeft: 5 }}>{contextEditionDaysLeft} {daysLeft}</Text>
                            </View>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CalendarPage')} style={{ marginLeft: 'auto', marginRight: 20 }}>
                                <Image style={globalStyles.detailsCalendarIcon} source={require('../../assets/desktop-calendar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <FlatList
                    data={editionImagesList}
                    onDragEnd={({ data }) => setEditionImagesList(data)}
                    renderItem={_renderItem}
                    ListHeaderComponent={<JournalMainPage />}
                    ListFooterComponent={<JournalFooterPage />}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {editionImagesList.length != 0 ? (
                <View style={{ alignSelf: 'flex-end', position: 'absolute', bottom: 40, right: 25 }}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => generatePDF()}>
                        <Image style={{ width: 55, height: 55 }} source={require('../../assets/pdf.png')} />
                    </TouchableOpacity>
                </View>
            ) : null}
            <Modal
                animationType="slide"
                transparent={true}
                visible={colorPickerModal}
            >
                <View style={globalStyles.modalDivstyle}>
                    <View style={globalStyles.modalSubDivstyleFull}>
                        <View style={globalStyles.modalSubDivstyle2}>
                            <ColorPicker
                                onColorSelected={color => { setColorSelected(color), setColorPickerModal(false) }}
                                style={{ flex: 1, width: '100%' }}
                            />
                            <TouchableOpacity onPress={() => setColorPickerModal(false)}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                    <View style={{ backgroundColor: '#5ec6ca', width: 140, justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 14 }}>Cancel</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


            <ModalDetailsComponent connectionModalStatus={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh} />
            <Toast ref={(toast) => this.toast = toast} />


        </SafeAreaView>
    );
}

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
    let [modalStatus, setModalStatus] = useState(false)

    let [isBoldView, setIsBoldView] = useState(false)
    let [isItalic, setIsItalic] = useState(false)
    let [isUnderline, setIsUnderline] = useState(false)
    let [colorPickerModal, setColorPickerModal] = useState(false)
    let [imageSelected, setImageSelected] = useState('')
    let [isDesc, setIsDesc] = useState(true)
    let [colorSelected, setColorSelected] = useState('#000000')
    let [upload, setUpload] = useState('Upload')
    let [onlyScaleDown, setOnlyScaleDown] = useState(false)
    let [description, setDescription] = useState('')
    let [fontStyle, setFontStyle] = useState('normal')
    let [fontWeight, setFontWeight] = useState('normal')
    let [textDecoration, setTextDecoration] = useState('none')
    let [imgOrientation, setImgOrientation] = useState("PORTRAIT")
    let [imgDescriptionVisible, setImgDescriptionVisible] = useState(true)
    let [loading, setLoading] = useState(false)
    let [currentToken, setCurrentToken] = useState('')


    //Lables
    let [holidaysandEventsofthemonth, setHolidaysandEventsofthemonth] = useState("Holidays and Events of the month")
    let [contributorsofthejournal, setContributorsofthejournal] = useState("Contributors of the journal")
    let [noHolidaysandEventsatthismoment, setNoHolidaysandEventsatthismoment] = useState("No Holidays and Events at this moment")
    let [addImage, setAddImage] = useState("Add Image")
    let [chooseImage, setchooseImage] = useState('Choose Image')
    let [mode, setMode] = useState('contain')


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
        setAddImage(strings.addImage)
        setchooseImage(strings.chooseImage)
        setUpload(strings.upload)
        getAllContributors(contextJournalRef)
        getEditionEvents(contextEditionRef)
        getTokenId()
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

    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                return;
            }
            user.getIdToken().then(function (idToken) {
                myContext.setToken(idToken);
                setCurrentToken(idToken)
            });
        });
    }


    /** function to open the mobile gallery and pick an image */
    const openGallery = () => {
        let options = {
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                // setImageSelected(response.assets[0].uri)
                console.log(response.assets[0].fileSize)
                resizeImg(response.assets[0].uri)
            }
        });
    }

    /** function to toggle Image source view by default and when user select an image */
    const renderFileUri = () => {
        if (imageSelected != '') {
            return <Image
                source={{ uri: imageSelected }}
                style={globalStyles.portrait_image_style} />
        } else {
            return <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: '#5ec6ca', width: 140, justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                    <Text style={{ color: 'white', alignSelf: 'center', fontSize: 12 }}>{chooseImage}</Text>
                </View>
            </View>
        }
    }

    const resizeImg = (imageSelected) => {
        ImageResizer.createResizedImage(imageSelected, 1024, 1024, 'JPEG', 90, 0, undefined, false, { mode, onlyScaleDown })
            .then(response => {
                console.log("RESPONSE: ", response.size)
                setImageSelected(response.uri)
            })
            .catch(err => {
                console.log("ERROR: ", err)
            });
    }
    /** this function call backend api to upload image into database */
    const uploadImagetoJournalEdition = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                const data = new FormData();
                data.append('imgPath', {
                    name: imageSelected,
                    type: "image/jpeg",
                    uri:
                        Platform.OS === "android"
                            ? imageSelected
                            : imageSelected.replace("file://", "")
                })
                data.append('editionRef', contextEditionRef)
                data.append('imgDescription', description)
                data.append('imgOrientation', imgOrientation)
                data.append('imgDescriptionVisible', imgDescriptionVisible)
                data.append('fullScreen', true)
                data.append('coverImage', false)
                data.append('desc', isDesc)
                data.append('fontWeight', fontWeight)
                data.append('fontStyle', fontStyle)
                data.append('textDecoration', textDecoration)
                data.append('textdescColor', colorSelected)
                StoreImage(currentToken, data)
                    .then((response) => response.json())
                    .then((responseJson) => { checkImageStatus(responseJson), setModalStatus(false) })
                    .catch((error) => { console.log(error) })
            } else {
                getAsyncStorageData()
                setConnectionModalStatus(true)
            }
        })
    }

    /** this function to check the status of uploaded image */
    const checkImageStatus = (responseJson) => {
        if (responseJson.status === "success") {
            this.toast.show("your Img Uploaded Succesfully", 2000)
            setLoading(false)
        } else {
            this.toast.show("Something Wrong!", 2000)
            setLoading(false)
        }
    }

    const switchBold_view = () => {
        if (isBoldView === false) {
            setIsBoldView(true)
            setFontWeight('bold')
        } else {
            setIsBoldView(false)
            setFontWeight('normal')
        }
    }

    const switchItalic_view = () => {
        if (isItalic === false) {
            setIsItalic(true)
            setFontStyle('italic')
        } else {
            setIsItalic(false)
            setFontStyle('normal')
        }
    }

    const switchUnderline_view = () => {
        if (isUnderline === false) {
            setIsUnderline(true)
            setTextDecoration('underline')
        } else {
            setIsUnderline(false)
            setTextDecoration('none')
        }
    }

    /** function that return view of contributors list in the last page  */
    const renderItem_Contributors_footer = ({ item }) => {
        return (
            <PreviewFooterListItem ownerUid={item.OWNER_UID} UserName={item.USER_NAME} />
        )
    }

    useEffect(() => {
        getJournalInfos()
        return () => {
        }
    }, [])



    return (
        <View>
            {myContext.PreviewListSize <= 13 ? (
                <View style={globalStyles.JournalPreview_pageStyle_FooterPage}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', height: '90%' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setModalStatus(true)}>
                            <View style={{ backgroundColor: '#5ec6ca', width: 140, justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 12 }}>{addImage}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={globalStyles.previewFooterPageItemListView}>
                        <Text style={globalStyles.purpleBoldLable}>{contextJournalName}</Text>
                        <Text style={globalStyles.purpleBoldLable}></Text>
                        <View>
                            <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo} />
                        </View>
                    </View>
                </View>
            ) : <></>
            }
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={colorPickerModal}
            >
                <View style={globalStyles.modalDivstyle}>
                    <View style={globalStyles.modalSubDivstyleFull}>
                        <View style={globalStyles.modalSubDivstyle2}>
                            <ColorPicker
                                onColorSelected={color => { setColorSelected(color), setColorPickerModal(false), setModalStatus(true) }}
                                style={{ flex: 1, width: '100%' }}
                            />
                            <TouchableOpacity onPress={() => {setColorPickerModal(false),setModalStatus(true)}}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', margin: 20 }}>
                                    <View style={{ backgroundColor: '#5ec6ca', width: 140, justifyContent: 'center', alignItems: 'center', padding: 10, borderRadius: 20 }}>
                                        <Text style={{ color: 'white', alignSelf: 'center', fontSize: 14 }}>Cancel</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal transparent={true} visible={modalStatus}>
                <View style={globalStyles.modalDivstyle}>
                    <View style={{ backgroundColor: '#ffffff', padding: 5, height: '75%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center', }}>
                        <View style={globalStyles.modalViewCenter}>
                            <View style={globalStyles.flexWidth100}>
                                <View style={globalStyles.journal_upload_item_view_landscape}>
                                    <TouchableOpacity activeOpacity={1} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                        <View style={globalStyles.journalDetails_LandscapeImageFullScreen_divDesc}>
                                            {renderFileUri()}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={globalStyles.flexWidth100}>
                                <View style={globalStyles.desc_Input}>
                                    <TextInput style={{ alignSelf: 'center', height: '100%', marginLeft: 10, padding: 0, fontSize: 12, color: colorSelected, fontStyle: global.fontStyle, fontWeight: global.fontWeight, textDecorationLine: global.textdecoration }}
                                        underlineColorAndroid="transparent"
                                        placeholder={"Description"}
                                        placeholderTextColor="#A5A5A5"
                                        multiline
                                        numberOfLines={4}
                                        onChangeText={(text) => setDescription(text)} />
                                </View>
                                <View style={globalStyles.viewRowAlignCenterMarginTop}>
                                    <TouchableOpacity onPress={() => switchBold_view()}>
                                        {isBoldView === false ? (
                                            <View style={globalStyles.font_view}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/bold.png')} />
                                            </View>
                                        ) :
                                            <View style={globalStyles.font_view_Selected}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/bold.png')} />
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => switchItalic_view()}>
                                        {isItalic === false ? (
                                            <View style={globalStyles.font_view}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/italic.png')} />
                                            </View>
                                        ) :
                                            <View style={globalStyles.font_view_Selected}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/italic.png')} />
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => switchUnderline_view()}>
                                        {isUnderline === false ? (
                                            <View style={globalStyles.font_view}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/underline.png')} />
                                            </View>
                                        ) :
                                            <View style={globalStyles.font_view_Selected}>
                                                <Image style={globalStyles.fontIcons} source={require('../../assets/underline.png')} />
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => {setModalStatus(false),setColorPickerModal(true)}}>
                                        <View style={globalStyles.font_view}>
                                            <Image style={globalStyles.fontColorIcons} source={require('../../assets/paint-palette.png')} />
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{ backgroundColor: colorSelected, width: 50, height: 20, marginLeft: 10 }}>

                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row',justifyContent:'center',marginTop:45 }}>
                                <View>
                                    {imageSelected != "" ? (
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => uploadImagetoJournalEdition()}>
                                            <View style={globalStyles.upload_button_style}>
                                                <Text style={globalStyles.Wel_Log_buttonLabel}>{upload}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) :
                                        <TouchableOpacity activeOpacity={0.8} disabled={true}>
                                            <View style={globalStyles.upload_button_style_disable}>
                                                <Text style={globalStyles.Wel_Log_buttonLabel}>{upload}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => setModalStatus(false)}>
                                        <View style={globalStyles.upload_button_style}>
                                            <Text style={globalStyles.Wel_Log_buttonLabel}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            </View>
                            
                        </View>
                    </View>
                </View>
                <Toast ref={(toast) => this.toast = toast} />
            </Modal>
         
        </View>
    )
}

const styles = StyleSheet.create({

})

export default JournalDetails;