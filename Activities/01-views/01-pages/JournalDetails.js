import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList, Modal } from "react-native";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import moment from "moment";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { globalStyles } from "../../../Activities/03-constants/global";
import FastImage from 'react-native-fast-image'
import auth, { firebase } from '@react-native-firebase/auth';
import { strings } from "../../../App";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { constants } from "../../03-constants/Constants";
import { PortraitDescription, PortraitNoDescription, PortraitFullDescription, PortraitFullNoDescription, LandscapeDescription, LandscapeNoDescription, ModalDetailsComponent, MainLandscapeDescView, MainPortraitNoDescView, MainPortraitFullView, MainLandscapeNoDescView } from "../02-components/JournalDetailsComponents";
import { getUser } from "../03-providers/UserProvider";
import { StoreImage } from "../03-providers/ImagesProvider";
import { JournalContext } from "../04-context/Context";

var jsonLayoutsData = [
    { id: 1, type: "portraitDesc" },
    { id: 2, type: "portrait" },
    { id: 3, type: "portraitFullWidth_Desc" },
    { id: 4, type: "portraitFullWidth" },
    { id: 5, type: "landscapeDesc" },
    { id: 6, type: "landscape" },
]

const JournalDetails = ({ route, navigation }) => {
    const myContext = useContext(JournalContext);

    const currentDate = moment().format('DD-MM-YYYY')
    let [contextAccessStatus, setContextAccessStatus] = useState(myContext.accessStatus)
    let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
    let [dateMonthSelected, setDateMonthSelected] = useState(myContext.DateMonth)
    let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
    let [contextEditionDaysLeft, setContextEditionDaysLeft] = useState(myContext.editionDaysLeft)
    let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)

    let [description, setDescription] = useState("")
    let [imgOrientation, setImgOrientation] = useState("PORTRAIT")
    let [imgDescriptionVisible, setImgDescriptionVisible] = useState(true)
    let [isFullScreen, setIsFullScreen] = useState(false)
    let [currentToken, setCurrentToken] = useState('')
    let [signedUserName, setSignedUserName] = useState('')
    let [signedUserUid, setSignedUserUid] = useState('')
    let [loading, setLoading] = useState(false)
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)

    let [portraitDescriptionStatus, setPortraitDescriptionStatus] = useState(true)
    let [portraitStatus, setPortraitStatus] = useState(false)
    let [portraitFullDescStatus, setPortraitFullDescStatus] = useState(false)
    let [portraitFullStatus, setPortraitFullStatus] = useState(false)
    let [landscapeDescriptionStatus, setLandscapeDescriptionStatus] = useState(false)
    let [landscapeStatus, setLandscapeStatus] = useState(false)

    let [isPortraitViewDesc, setIsPortraitViewDesc] = useState(true)
    let [isPortraitView, setIsPortraitView] = useState(false)
    let [isPortraitViewFullDesc, setIsPortraitViewFullDesc] = useState(false)
    let [isPortraitViewFull, setIsPortraitViewFull] = useState(false)
    let [isLandscapeView, setIsLandscapeView] = useState(false)
    let [isLandscapeViewDesc, setIsLandscapeViewDesc] = useState(false)

    let [imageSelected, setImageSelected] = useState('')

    //Labels
    let [preview, setPreview] = useState('Preview')
    let [sorting, setSorting] = useState('Sorting')
    let [daysLeft, setDaysLeft] = useState("Days Left");
    let [writedescription, setWriteDescription] = useState('Write a description')
    let [upload, setUpload] = useState('Upload')
    let [chooseImage, setchooseImage] = useState('Choose Image')
    let [yourImgUploadedSuccesfully, setYourImgUploadedSuccesfully] = useState('Your image uploaded successfully')
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");
    let [chooseyourimagelayout, setChooseyourimagelayout] = useState("Choose your image layout");

    /** function to change view by index of layout selected in the horizontal flatlist */
    const toggleLayoutView = (value) => {
        if (value === 0) {
            setPortraitDescriptionStatus(true)
            setPortraitStatus(false)
            setPortraitFullDescStatus(false)
            setPortraitFullStatus(false)
            setLandscapeDescriptionStatus(false)
            setLandscapeStatus(false)

            setIsPortraitViewDesc(true)
            setIsPortraitView(false)
            setIsPortraitViewFullDesc(false)
            setIsPortraitViewFull(false)
            setIsLandscapeViewDesc(false)
            setIsLandscapeView(false)

            setImgOrientation("PORTRAIT")
            setImgDescriptionVisible(true)
            setIsFullScreen(false)
        } else if (value === 4) {
            setPortraitDescriptionStatus(false)
            setPortraitStatus(false)
            setPortraitFullDescStatus(false)
            setPortraitFullStatus(false)
            setLandscapeDescriptionStatus(true)
            setLandscapeStatus(false)

            setIsPortraitViewDesc(false)
            setIsPortraitView(false)
            setIsPortraitViewFullDesc(false)
            setIsPortraitViewFull(false)
            setIsLandscapeViewDesc(true)
            setIsLandscapeView(false)

            setImgOrientation("LANDSCAPE")
            setImgDescriptionVisible(true)
            setIsFullScreen(false)
        } else if (value === 1) {
            setPortraitDescriptionStatus(false)
            setPortraitStatus(true)
            setPortraitFullDescStatus(false)
            setPortraitFullStatus(false)
            setLandscapeDescriptionStatus(false)
            setLandscapeStatus(false)

            setIsPortraitViewDesc(false)
            setIsPortraitView(true)
            setIsPortraitViewFullDesc(false)
            setIsPortraitViewFull(false)
            setIsLandscapeViewDesc(false)
            setIsLandscapeView(false)

            setImgOrientation("PORTRAIT")
            setImgDescriptionVisible(false)
            setIsFullScreen(false)
            setDescription("")
        } else if (value === 3) {
            setPortraitDescriptionStatus(false)
            setPortraitStatus(false)
            setPortraitFullDescStatus(false)
            setPortraitFullStatus(true)
            setLandscapeDescriptionStatus(false)
            setLandscapeStatus(false)

            setIsPortraitViewDesc(false)
            setIsPortraitView(false)
            setIsPortraitViewFullDesc(false)
            setIsPortraitViewFull(true)
            setIsLandscapeViewDesc(false)
            setIsLandscapeView(false)

            setImgOrientation("PORTRAIT")
            setImgDescriptionVisible(false)
            setIsFullScreen(true)
            setDescription("")
        } else if (value === 2) {
            setPortraitDescriptionStatus(false)
            setPortraitStatus(false)
            setPortraitFullDescStatus(true)
            setPortraitFullStatus(false)
            setLandscapeDescriptionStatus(false)
            setLandscapeStatus(false)

            setIsPortraitViewDesc(false)
            setIsPortraitView(false)
            setIsPortraitViewFullDesc(true)
            setIsPortraitViewFull(false)
            setIsLandscapeViewDesc(false)
            setIsLandscapeView(false)

            setImgOrientation("PORTRAIT")
            setImgDescriptionVisible(true)
            setIsFullScreen(true)
        } else if (value === 5) {
            setPortraitDescriptionStatus(false)
            setPortraitStatus(false)
            setPortraitFullDescStatus(false)
            setPortraitFullStatus(false)
            setLandscapeDescriptionStatus(false)
            setLandscapeStatus(true)

            setIsPortraitViewDesc(false)
            setIsPortraitView(false)
            setIsPortraitViewFullDesc(false)
            setIsPortraitViewFull(false)
            setIsLandscapeViewDesc(false)
            setIsLandscapeView(true)

            setImgOrientation("LANDSCAPE")
            setImgDescriptionVisible(false)
            setIsFullScreen(false)
            setDescription("")
        }
    }

    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                return;
            }
            user.getIdToken().then(function (idToken) {
                myContext.setToken(idToken);
                getUserProfile(idToken)
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
                setImageSelected(response.assets[0].uri)
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

    /** call backend api to get the user signed profile */
    const getUserProfile = (idToken) => {
        setLoading(true)
        getUser(idToken)
            .then((response) => response.json())
            .then((responseJson) => storeUserProfile(responseJson))
            .catch((error) => { console.log(error) })
    };

    /** function to store the user info in the AsyncStorage */
    const storeUserProfile = (response) => {
        setSignedUserName(response.username)
        setSignedUserUid(response.userUid)
        setLoading(false)
    }

    /**  get params from async storage  */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(contextAppLanguage)
            setPreview(strings.preview)
            setSorting(strings.sorting)
            setDaysLeft(strings.daysLeft)
            setWriteDescription(strings.writeadescription)
            setUpload(strings.upload)
            setchooseImage(strings.chooseImage)
            setYourImgUploadedSuccesfully(strings.yourImgUploadedSuccesfully)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setChooseyourimagelayout(strings.chooseyourimagelayout)
        } catch (e) {
            console.log(e)
        }
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
                data.append('fullScreen', isFullScreen)
                data.append('coverImage', false)

                StoreImage(currentToken, data)
                    .then((response) => response.json())
                    .then((responseJson) => checkImageStatus(responseJson))
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
            this.toast.show(yourImgUploadedSuccesfully, 2000)
            setLoading(false)
        } else {
            this.toast.show("Something Wrong!", 2000)
            setLoading(false)
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

    useEffect(() => {
        checkConnection();
        return () => {
        }
    }, [])


    /** function render the horizontal flatlist item view by index  */
    const _renderItemLayoutsData = ({ item, index }) => {
        if (index === 0) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(0)}>
                    <PortraitDescription portraitDescriptionStatus={portraitDescriptionStatus} />
                </TouchableOpacity>
            );
        } else if (index === 1) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(1)}>
                    <PortraitNoDescription portraitStatus={portraitStatus} />
                </TouchableOpacity>
            )
        } else if (index === 2) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(2)}>
                        <PortraitFullDescription portraitFullDescStatus={portraitFullDescStatus} />
                    </TouchableOpacity>
                    <View style={globalStyles.alignItemsCenter}>
                        <Text style={globalStyles.detailsYellowFullScreenLabel}>Full Screen</Text>
                    </View>
                </View>
            )
        } else if (index === 3) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(3)}>
                        <PortraitFullNoDescription portraitFullStatus={portraitFullStatus} />
                    </TouchableOpacity>
                    <View style={globalStyles.alignItemsCenter}>
                        <Text style={globalStyles.detailsYellowFullScreenLabel}>Full Screen</Text>
                    </View>
                </View>
            )
        } else if (index === 4) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(4)}>
                    <LandscapeDescription landscapeDescriptionStatus={landscapeDescriptionStatus} />
                </TouchableOpacity>
            )
        } else if (index === 5) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(5)}>
                    <LandscapeNoDescription landscapeStatus={landscapeStatus} />
                </TouchableOpacity>
            );
        }
    };

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
                        <Text style={globalStyles.detailsSelectedJournalNameTitle}>{contextJournalName}</Text>
                        <Text style={globalStyles.detailsSelectedmonthTitle}>{dateMonthSelected}</Text>
                    </View>
                    <View style={globalStyles.detailsHeaderRightView}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings')}>
                            <Image style={globalStyles.detailsSettingsIcon} source={require('../../assets/settingIcon.png')} /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, marginTop: 10 }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: 120, borderRadius: 8, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', height: 20, flexDirection: 'row' }}>
                            {/* <Image source={require('../../assets/clock.png')} style={{ width: 18, height: 18, marginRight: 5 }} /> */}
                            <Text style={{ fontSize: 11, color:'black' }}>{contextEditionDaysLeft} {daysLeft}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1, alignItems: 'center', marginTop: 10 }}>
                        <View style={globalStyles.viewWidth100FlexRow}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalPreview')}>
                                <Text style={globalStyles.journalDetails_prev_sort_btn}>{preview}</Text>
                            </TouchableOpacity>
                            {contextAccessStatus == 0 ? (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSorting')}>
                                    <Text style={globalStyles.journalDetails_prev_sort_btn}>Images</Text>
                                </TouchableOpacity>
                            ) : null
                            }
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CalendarPage')} style={{ marginLeft: 'auto', marginRight: 20 }}>
                                <Image style={globalStyles.detailsCalendarIcon} source={require('../../assets/desktop-calendar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center', height: 700 }}>
                        <ScrollView style={{ flex: 1, height: 800 }} showsVerticalScrollIndicator={false}>
                            <View style={globalStyles.viewFlex1}>
                                {isPortraitViewDesc ? (
                                    <View style={globalStyles.journal_upload_item_view_portrait}>
                                        <View style={globalStyles.portrait_width50}>
                                            <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                                <View style={globalStyles.portrait_width100}>
                                                    {renderFileUri()}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={globalStyles.portrait_2ndView50}>
                                            <View style={globalStyles.portrait_closeView}>
                                            </View>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.journal_details_userprifile_rounded}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/profile.jpg",
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={globalStyles.journalDetails_ViewUserandDateMargins}>
                                                <Text style={globalStyles.journal_text_styles}>{signedUserName}</Text>
                                                <Text style={globalStyles.journal_text_styles_date}>{currentDate}</Text>
                                            </View>
                                            <View style={globalStyles.portrait_description}>
                                                <TextInput multiline={true} style={{ height: 200, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 11, color: 'grey', textAlignVertical: 'top' }}
                                                    placeholder={writedescription}
                                                    placeholderTextColor="#A5A5A5"
                                                    underlineColorAndroid="transparent"
                                                    value={description}
                                                    onChangeText={(text) => setDescription(text)} />
                                            </View>
                                        </View>
                                    </View>
                                ) : isLandscapeViewDesc ? (
                                    <View>
                                        <View style={globalStyles.journal_upload_item_view_landscape}>
                                            <View style={globalStyles.landscape_width50}>
                                                <View style={globalStyles.landscape_width100}>
                                                    <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                                        {renderFileUri()}
                                                    </TouchableOpacity>
                                                </View>
                                                <MainLandscapeDescView signedUserUid={signedUserUid} signedUserName={signedUserName} currentDate={currentDate} />
                                            </View>
                                            <View style={globalStyles.landscape_description}>
                                                <TextInput multiline={true} style={{ height: 100, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 11, color: 'grey', marginRight: 15, marginLeft: 5, textAlignVertical: 'top' }}
                                                    placeholder={writedescription}
                                                    placeholderTextColor="#A5A5A5"
                                                    underlineColorAndroid="transparent"
                                                    numberOfLines={5}
                                                    value={description}
                                                    onChangeText={(text) => setDescription(text)} />
                                            </View>
                                        </View>
                                    </View>
                                ) : isPortraitView ? (
                                    <View style={globalStyles.journal_upload_item_view_portrait}>
                                        <View style={globalStyles.portrait_width50}>
                                            <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                                <View style={globalStyles.portrait_width100}>
                                                    {renderFileUri()}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <MainPortraitNoDescView signedUserUid={signedUserUid} signedUserName={signedUserName} currentDate={currentDate} />
                                    </View>
                                ) : isPortraitViewFull ? (
                                    <View style={globalStyles.journal_upload_item_view_portraitFullScreen}>
                                        <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                            <View style={globalStyles.journalDetails_imageFullScreen_div}>
                                                {renderFileUri()}
                                            </View>
                                        </TouchableOpacity>
                                        <MainPortraitFullView signedUserUid={signedUserUid} signedUserName={signedUserName} currentDate={currentDate} />
                                    </View>
                                ) : isPortraitViewFullDesc ? (
                                    <View style={globalStyles.journal_upload_item_view_portraitFullScreen}>
                                        <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                            <View style={globalStyles.journalDetails_PortraitImageFullScreen_divDesc}>
                                                {renderFileUri()}
                                            </View>
                                        </TouchableOpacity>
                                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                            <TextInput multiline={true} style={{ alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 11, color: 'grey', textAlignVertical: 'top' }}
                                                placeholder={writedescription}
                                                placeholderTextColor="#A5A5A5"
                                                underlineColorAndroid="transparent"
                                                numberOfLines={2}
                                                value={description}
                                                onChangeText={(text) => setDescription(text)} />
                                        </View>
                                        <MainPortraitFullView signedUserUid={signedUserUid} signedUserName={signedUserName} currentDate={currentDate} />
                                    </View>
                                ) : isLandscapeView ? (
                                    <View style={globalStyles.journal_upload_item_view_landscape}>
                                        <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                            <View style={globalStyles.journalDetails_LandscapeImageFullScreen_divDesc}>
                                                {renderFileUri()}
                                            </View>
                                        </TouchableOpacity>
                                        <MainLandscapeNoDescView signedUserUid={signedUserUid} signedUserName={signedUserName} currentDate={currentDate} />
                                    </View>
                                ) : null
                                }
                            </View>

                            <View style={{ marginLeft: 20, marginTop: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 10, color: '#9b56a2', fontWeight: '600' }}>{chooseyourimagelayout}</Text>
                            </View>
                            <View>
                                <FlatList showsHorizontalScrollIndicator={false}
                                    data={jsonLayoutsData}
                                    renderItem={_renderItemLayoutsData}
                                    horizontal={true} />
                            </View>
                            <View style={{ marginBottom: 30 }}>
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
                        </ScrollView>
                    </SafeAreaView>
                </View>
            </KeyboardAwareScrollView>

            <ModalDetailsComponent connectionModalStatus={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh} />
            <Toast ref={(toast) => this.toast = toast} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

})

export default JournalDetails;