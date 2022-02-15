import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Modal } from "react-native";
import { ScrollView, TextInput, TouchableHighlight, TouchableWithoutFeedback } from "react-native-gesture-handler";
import SortableGrid from 'react-native-sortable-grid'
import { CheckBox, Input } from "react-native-elements";
import moment from "moment";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { globalStyles } from "../../../01-app/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FastImage from 'react-native-fast-image'
import auth, { firebase } from '@react-native-firebase/auth';
import { strings } from "../../../App";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import Toast, { DURATION } from 'react-native-easy-toast';
import { constants } from "../../03-constants/Constants";




var jsonLayoutsData = [
    { id: 1, type: "portraitDesc" },
    { id: 2, type: "portrait" },
    { id: 3, type: "portraitFullWidth_Desc" },
    { id: 4, type: "portraitFullWidth" },
    { id: 5, type: "landscapeDesc" },
    { id: 6, type: "landscape" },
]

const JournalDetails = ({ route, navigation }) => {
    var admin = route.params.admin
    const currentDate = moment().format('DD-MM-YYYY')

    let [description, setDescription] = useState("")
    let [imgOrientation, setImgOrientation] = useState("PORTRAIT")
    let [imgDescriptionVisible, setImgDescriptionVisible] = useState(true)
    let [isFullScreen, setIsFullScreen] = useState(false)
    let [currentToken, setCurrentToken] = useState('')
    let [signedUserName, setSignedUserName] = useState('')
    let [signedUserUid, setSignedUserUid] = useState('')
    let [editionRef, setEditionRef] = useState('')
    let [loading, setLoading] = useState(false)
    let [journalName, setJournalName] = useState('')
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
    let [accessStatus, setAccessStatus] = useState('')

    //Labels
    let [preview, setPreview] = useState('Preview')
    let [sorting, setSorting] = useState('Sorting')
    let [writedescription, setWriteDescription] = useState('Write a description')
    let [upload, setUpload] = useState('Upload')
    let [chooseImage, setchooseImage] = useState('Choose Image')
    let [pleaseSelectanImage, setPleaseSelectanImage] = useState('Please select an image')
    let [yourImgUploadedSuccesfully, setYourImgUploadedSuccesfully] = useState('Your image uploaded successfully')
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");


    /**
     *  function to change view by index of layout selected in the horizontal flatlist
     */
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


    /**
     * get the tokenID
     */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            user.getIdToken().then(function (idToken) {
                getUserProfile(idToken)
                setCurrentToken(idToken)
                AsyncStorage.setItem('Token', idToken)
            });

        });
    }


    /**
     *  function to open the mobile gallery and pick an image
     */
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
                console.log(response)
            }
        });
    }


    /**
     *  function to toggle Image source view by default and when user select an image
     */
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


    /**
     * call backend api to get the user signed profile
     * @param {*} idToken getted automatically at the start of the app
     */
    const getUserProfile = (idToken) => {
        setLoading(true)
        fetch(constants.apiIP + "userProfile/getUserProfile", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": "Bearer " + idToken
            },
        })
            .then((response) => response.json())
            .then((responseJson) => storeUserProfile(responseJson))
    };

    /**
     * function to store the user info in the AsyncStorage
     * @param {*} response getted from the response of the api
     */
    const storeUserProfile = (response) => {
        setSignedUserName(response.username)
        setSignedUserUid(response.userUid)
        setLoading(false)
    }


    /** 
     * get params from async storage  
     */
    const getAsyncStorageData = async () => {
        try {
            setAccessStatus(await AsyncStorage.getItem('accessStatus'))
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setPreview(strings.preview)
            setSorting(strings.sorting)
            setWriteDescription(strings.writeadescription)
            setUpload(strings.upload)
            setchooseImage(strings.chooseImage)
            setPleaseSelectanImage(strings.pleaseSelectanImage)
            setYourImgUploadedSuccesfully(strings.yourImgUploadedSuccesfully)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setEditionRef(await AsyncStorage.getItem('editionRef'))
            setJournalName(await AsyncStorage.getItem('JournalName'))
        } catch (e) {
            console.log(e)
        }
    }


    /**
     *  this function call backend api to upload image into database
     */
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
                data.append('editionRef', editionRef)
                data.append('imgDescription', description)
                data.append('imgOrientation', imgOrientation)
                data.append('imgDescriptionVisible', imgDescriptionVisible)
                data.append('fullScreen', isFullScreen)
                data.append('coverImage', false)

                fetch(constants.apiIP + "journal/storeImage", {
                    method: 'post',
                    body: data,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": "Bearer " + currentToken
                    },
                })
                    .then((response) => response.json())
                    .then((responseJson) => checkImageStatus(responseJson))

            } else {
                getAsyncStorageData()
                setConnectionModalStatus(true)
            }
        })
    }

    /**
     *  this function to check the status of uploaded image
     */
    const checkImageStatus = (responseJson) => {
        if (responseJson.status === "success") {
            this.toast.show(yourImgUploadedSuccesfully, 2000)
            setLoading(false)
        } else {
            this.toast.show("Something Wrong", 2000)
        }
    }


    /**
    *  function to check if internet connection is enable or not
    */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log("Is connected?", state);
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


    /**
     *  function render the horizontal flatlist item view by index 
     */
    const _renderItemLayoutsData = ({ item, index }) => {
        if (index === 0) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(0)}>
                    <View style={portraitDescriptionStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
                        <View style={{ width: 60 }}>
                            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }}></Image>
                            </View>
                        </View>
                        <View style={{ width: 60, marginLeft: 10 }}>
                            <View>
                                <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ fontSize: 5, color: '#222222' }}>Jane doe</Text>
                                <Text style={{ fontSize: 5, color: '#222222', marginTop: 1 }}>1 - 11 - 2021</Text>
                            </View>
                            <View style={{ width: '80%', marginTop: 5 }}>
                                <Text style={{ height: 30, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 5, color: 'grey', textAlignVertical: 'top', width: 35 }}>Lorem ipsum dolor sit amet,consectetur adipiscing elit. Fusce laoreet consequat gravida.</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        } else if (index === 1) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(1)}>
                    <View style={portraitStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
                        <View style={{ width: 60 }}>
                            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }}></Image>
                            </View>
                        </View>
                        <View style={{ width: 60, marginLeft: 10 }}>
                            <View>
                                <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                            </View>
                            <View style={{ marginTop: 5 }}>
                                <Text style={{ fontSize: 5, color: '#222222' }}>Jane doe</Text>
                                <Text style={{ fontSize: 5, color: '#222222', marginTop: 1 }}>1 - 11 - 2021</Text>
                            </View>
                            <View style={{ width: '80%', marginTop: 5 }}>
                                {/* <Text style={{ height: 30, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 5, color: 'grey', textAlignVertical: 'top', width: 35}}>Lorem ipsum dolor sit amet,consectetur adipiscing elit. Fusce laoreet consequat gravida.</Text> */}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            )
        } else if (index === 2) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(2)}>
                        <View style={portraitFullDescStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
                            <View style={{ width: '100%' }}>
                                <View style={{ width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 100, height: 75, resizeMode: 'contain', }}></Image>
                                </View>
                                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 5, color: 'grey' }}>Lorem ipsum dolor sit amet</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                                    <View>
                                        <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                                    </View>
                                    <Text style={{ fontSize: 5, color: '#222222', marginLeft: 5 }}>Jane doe</Text>
                                    <Text style={{ fontSize: 5, color: '#222222', marginTop: 1, marginLeft: 5 }}>1 - 11 - 2021</Text>
                                </View>

                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 7, color: '#febf2e', marginTop: -12, fontWeight: 'bold' }}>Full Screen</Text>
                    </View>
                </View>
            )
        } else if (index === 3) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(3)}>
                        <View style={portraitFullStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
                            <View style={{ width: '100%' }}>
                                <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                    <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }}></Image>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                                    <View>
                                        <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                                    </View>
                                    <Text style={{ fontSize: 5, color: '#222222', marginLeft: 5 }}>Jane doe</Text>
                                    <Text style={{ fontSize: 5, color: '#222222', marginTop: 1, marginLeft: 5 }}>1 - 11 - 2021</Text>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={{ fontSize: 7, color: '#febf2e', marginTop: -12, fontWeight: 'bold' }}>Full Screen</Text>
                    </View>
                </View>
            )
        } else if (index === 4) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(4)}>
                    <View style={landscapeDescriptionStatus ? globalStyles.imageLayout_landscapeWithDesc_Selected : globalStyles.imageLayout_landscapeWithDesc}>
                        <View style={{ width: '100%', flexDirection: 'row' }}>
                            <View style={{ width: '65%', height: 60 }}>
                                <Image source={require('../../../assets/landscape_image2.jpeg')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }}></Image>
                            </View>
                            <View style={{ width: 60, marginLeft: 5, marginTop: 10 }}>
                                <View>
                                    <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                                </View>
                                <View style={{ marginTop: 5 }}>
                                    <Text style={{ fontSize: 5, color: '#222222' }}>Jane doe</Text>
                                    <Text style={{ fontSize: 5, color: '#222222', marginTop: 1 }}>1 - 11 - 2021</Text>
                                </View>

                            </View>
                        </View>

                        <View style={{ marginTop: 1, width: '95%', marginRight: 'auto' }}>
                            <Text style={{ height: 30, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 5, color: 'grey', textAlignVertical: 'top', width: '100%' }}>Lorem ipsum dolor sit amet, consecter adipiscing elit. Fusce laoreet consequat gravida.</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
        } else if (index === 5) {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => toggleLayoutView(5)}>
                    <View style={landscapeStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
                        <View style={{ width: '100%' }}>
                            <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <Image source={require('../../../assets/landscape_image2.jpeg')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }}></Image>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 1 }}>
                                <View>
                                    <Image source={require('../../../assets/portrait_image2.jpeg')} style={{ width: 15, height: 15, borderRadius: 15 / 2 }} />
                                </View>
                                <Text style={{ fontSize: 5, color: '#222222', marginLeft: 5 }}>Jane doe</Text>
                                <Text style={{ fontSize: 5, color: '#222222', marginTop: 1, marginLeft: 5 }}>1 - 11 - 2021</Text>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        }
    };



    return (
        <SafeAreaView style={globalStyles.JournalDetails_main_Container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ fontSize: 12, color: 'white' }}
            />
            <View style={globalStyles.JournalDetails_header}>
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ width: '20%', alignItems: 'flex-start' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                            <View style={{ width: 80, height: 40, justifyContent: 'center' }}>
                                <Image style={globalStyles.backArrow} source={require('../../../assets/left-arrow.png')} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: '60%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 22, fontFamily: 'Didot Italic', color: '#9b56a2' }}>{journalName}</Text>
                        <Text style={{ fontSize: 16, color: '#5ec6ca', fontFamily: 'Didot Italic' }}>{admin}</Text>

                    </View>
                    <View style={{ width: '20%', alignItems: 'flex-end', height: 40, justifyContent: 'center' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings', { adminName: admin })}>
                            <Image style={{ width: 26, height: 26, marginRight: 20 }} source={require('../../../assets/settingIcon.png')} /></TouchableOpacity>
                    </View>
                </View>
            </View>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <View style={{ flex: 1, marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 1, alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', width: '100%' }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalPreview', { adminName: admin, journalEditionRef: editionRef })}>
                                <Text style={globalStyles.journalDetails_prev_sort_btn}>{preview}</Text>
                            </TouchableOpacity>
                            {accessStatus == 0 ? (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSorting', { adminName: admin })}>
                                    <Text style={globalStyles.journalDetails_prev_sort_btn}>Images</Text>
                                </TouchableOpacity>
                            ) : null
                            }
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CalendarPage', { adminName: admin })} style={{marginLeft:'auto',marginRight:20}}>
                                <Image style={{ width: 25, height: 25, alignSelf: 'center'}} source={require('../../../assets/desktop-calendar.png')} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <SafeAreaView style={{ flex: 1, justifyContent: 'center', height: 700 }}>
                        <ScrollView style={{ flex: 1, height: 800 }} showsVerticalScrollIndicator={false}>
                            <View style={{ flex: 1 }}>
                                {isPortraitViewDesc ? (
                                    <View style={globalStyles.journal_upload_item_view_portrait}>
                                        <View style={globalStyles.portrait_width50}>
                                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
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
                                                    <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
                                                        {renderFileUri()}
                                                    </TouchableOpacity>
                                                </View>
                                                <View style={globalStyles.landscape_rightView}>
                                                    <View style={globalStyles.landscape_closeView}>
                                                    </View>
                                                    <View style={{ marginTop: 40 }}>
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

                                                </View>
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
                                            <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
                                                <View style={globalStyles.portrait_width100}>
                                                    {renderFileUri()}
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={globalStyles.portrait_2ndView50}>
                                            <View style={globalStyles.portrait_closeView}>
                                            </View>

                                            <View style={{ marginTop: 20 }}>
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
                                            </View>
                                        </View>
                                    </View>

                                ) : isPortraitViewFull ? (
                                    <View style={globalStyles.journal_upload_item_view_portraitFullScreen}>
                                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
                                            <View style={globalStyles.journalDetails_imageFullScreen_div}>
                                                {renderFileUri()}
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.journal_details_userprifile_rounded}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/profile.jpg",
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={globalStyles.journal_text_styles}>{signedUserName}</Text>
                                            </View>
                                            <View style={{ marginLeft: 15 }}>
                                                <Text style={{ fontSize: 9, color: '#222222' }}>{currentDate}</Text>
                                            </View>
                                        </View>

                                    </View>

                                ) : isPortraitViewFullDesc ? (
                                    <View style={globalStyles.journal_upload_item_view_portraitFullScreen}>
                                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
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
                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10 }}>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.journal_details_userprifile_rounded}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/profile.jpg",
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={globalStyles.journal_text_styles}>{signedUserName}</Text>
                                            </View>
                                            <View style={{ marginLeft: 15 }}>
                                                <Text style={{ fontSize: 9, color: '#222222' }}>{currentDate}</Text>
                                            </View>
                                        </View>

                                    </View>

                                ) : isLandscapeView ? (
                                    <View style={globalStyles.journal_upload_item_view_landscape}>
                                        <TouchableOpacity activeOpacity={0.5} style={{ flex: 1 }} onPress={() => openGallery()}>
                                            <View style={globalStyles.journalDetails_LandscapeImageFullScreen_divDesc}>
                                                {renderFileUri()}
                                            </View>
                                        </TouchableOpacity>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
                                            <View>
                                                <FastImage
                                                    style={globalStyles.journal_details_userprifile_rounded}
                                                    source={{
                                                        uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/profile.jpg",
                                                    }}
                                                    resizeMode={FastImage.resizeMode.cover}
                                                />
                                            </View>
                                            <View style={{ marginLeft: 10 }}>
                                                <Text style={globalStyles.journal_text_styles}>{signedUserName}</Text>
                                            </View>
                                            <View style={{ marginLeft: 15 }}>
                                                <Text style={{ fontSize: 9, color: '#222222' }}>{currentDate}</Text>
                                            </View>
                                        </View>

                                    </View>

                                ) : null
                                }
                            </View>



                            <View style={{ marginLeft: 20, marginTop: 10, flexDirection: 'row' }}>
                                <Text style={{ fontSize: 10, color: '#9b56a2', fontWeight: '600' }}>Choose your image layout</Text>
                            </View>
                            <View>
                                <FlatList showsHorizontalScrollIndicator={false} data={jsonLayoutsData} renderItem={_renderItemLayoutsData} horizontal={true} />
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

            {/* <View style={globalStyles.calendarRight_FixIcon}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CalendarPage', { adminName: admin })}>
                    <Image style={{ width: 45, height: 45 }} source={require('../../../assets/desktop-calendar.png')} />
                </TouchableOpacity>
            </View> */}
            {/* <View style={globalStyles.journalDetails_footer_tabs}>
                <View style={globalStyles.journalDetails_footer_tabs_singleDiv}><TouchableOpacity onPress={() => footertabsToggle('CalendarPage')}><Image source={disableCalander} style={globalStyles.journalDetails_footer_tabs_icons} /></TouchableOpacity></View>
                <View style={globalStyles.journalDetails_footer_tabs_singleDiv}><TouchableOpacity onPress={() => footertabsToggle('UploadImagesPage')}><Image source={disableUploadImage} style={globalStyles.journalDetails_footer_tabs_icons} /></TouchableOpacity></View>
                <View style={globalStyles.journalDetails_footer_tabs_singleDiv}><Image source={require('../../../assets/journal-icon-8.jpeg')} style={globalStyles.journalDetails_footer_tabs_icons} /></View>
                <View style={globalStyles.journalDetails_footer_tabs_singleDiv}><TouchableOpacity onPress={() => footertabsToggle('LinksSharingPage')}><Image source={disableLinkSharing} style={globalStyles.journalDetails_footer_tabs_icons} /></TouchableOpacity></View>
                <View style={globalStyles.journalDetails_footer_tabs_singleDiv}><TouchableOpacity onPress={() => footertabsToggle('ChatPage')}><Image source={disableChat} style={globalStyles.journalDetails_footer_tabs_icons} /></TouchableOpacity></View>
            </View> */}

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

            <Toast ref={(toast) => this.toast = toast} />

        </SafeAreaView>

    );
}



const styles = StyleSheet.create({

})

export default JournalDetails;