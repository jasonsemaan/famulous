import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, Alert, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../01-app/03-constants/global";
import DraggableFlatList, { ScaleDecorator, } from "react-native-draggable-flatlist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../App";
import FastImage from 'react-native-fast-image'
import moment from "moment";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import auth, { firebase } from '@react-native-firebase/auth';
import { constants } from "../../03-constants/Constants";




const JournalSorting = ({ route, navigation }) => {
    var adminName = route.params.adminName
    let [imagesList, setImagesList] = useState([]);
    let [loading, setLoading] = useState(false);
    let [currentIdToken, setCurrentIdToken] = useState("");
    let [currentEditionRef, setCurrentEditionRef] = useState("");
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)

    //Labels
    let [hereYouCanSort, setHereYouCanSort] = useState("Here you can sort images of");
    let [areyousureyouwanttoremove, setAreyousureyouwanttoremove] = useState("Are you sure you want to remove this image?");
    let [cancel, setCancel] = useState("Cancel");
    let [remove, setRemove] = useState("Remove");
    let [save, setSave] = useState("Save");
    let [youhaveNoPhotosatThisMoment, setYouhaveNoPhotosatThisMoment] = useState("You have no photos at this moment!!")
    let [addphotostopreviewthejournal, setAddphotostopreviewthejournal] = useState("Add photos to preview the journal.")
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");

    /**
     * get the tokenID
     */
    const getTokenId = () => {
        setLoading(true)
        auth().onAuthStateChanged(function (user) {
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData(idToken)
                setCurrentIdToken(idToken)
            });
        });
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
    const getAsyncStorageData = async (idToken) => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setHereYouCanSort(strings.hereYouCanSort)
            setAreyousureyouwanttoremove(strings.areyousureyouwanttoremove)
            setCancel(strings.cancel)
            setRemove(strings.remove)
            setSave(strings.save)
            setYouhaveNoPhotosatThisMoment(strings.youhaveNoPhotosatThisMoment)
            setAddphotostopreviewthejournal(strings.addphotostopreviewthejournal)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            getJournalEditionImages(idToken, await AsyncStorage.getItem('editionRef'))
            setCurrentEditionRef(await AsyncStorage.getItem('editionRef'))
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * call backend api to get all single images from the db
     * @param {*} idToken getted automatically at the start of the app
     */
    const getJournalEditionImages = (idToken, editionRef) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/selectSingleEditionImages", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + idToken
            },
            body: JSON.stringify({
                editionRef: editionRef
            })
        })
            .then((response) => response.json())
            .then((responseJson) => storeData(responseJson))
    };


    /**
     *  function to store response of the backend api into a current list
     */
    const storeData = (responseJson) => {
        setImagesList(responseJson)
        setLoading(false)
    }


    /**
     *  popup alert to delete item from list or cancel request
     */
    const alertRemove = (imageRef) => {
        Alert.alert(
            '',
            areyousureyouwanttoremove,
            [
                {
                    text: cancel,
                    onPress: () => console.log('Canceled'),
                    style: 'cancel'
                },
                {
                    text: remove,
                    onPress: () => deleteItem(imageRef)
                },
            ]
        )
    }


    /**
     *  delete item from list
     */
    const deleteItem = (imageRef) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                setLoading(true)
                deleteImageFromDB(imageRef)
            } else {
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        })
    }


    /**
    *  delete Image from DB
    */
    const deleteImageFromDB = (imageRef) => {
        setLoading(true)
        fetch(constants.apiIP + "journal/deleteImage", {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imgStoreRef: imageRef,
            })
        })
            .then((response) => response.json())
            .then(getJournalEditionImages(currentIdToken, currentEditionRef))
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
                setLoading(false)
                getAsyncStorageDataForNoConnection()
                setConnectionModalStatus(true)
            }
        });
    }


    useEffect(() => {
        checkConnection();
        return () => {
        }
    }, [])


    /**
     *  render the main flatlist items view
     */
    const renderItem = ({ item, drag, isActive, index }) => {
        return (
            <View>
                {two_perRow(item, drag, isActive, index)}
            </View>
        );
    };



    /**
     * function to seperate flatlist items, >30 and <=30
     */
    const two_perRow = (item, drag, isActive, index) => {

        let noDesc = "No description"
        let desc = item.imgDescription
        let description = item.imgDescriptionVisible == false ? noDesc : desc

        var imageDate = moment(new Date(item.uploadTime * 1000)).format('MM-DD-YYYY');
        if (index <= 29) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={0.8} onLongPress={drag}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5 }}>
                            <View style={{ width: '20%' }}>
                                <FastImage
                                    style={globalStyles.sorting_ItemImg}
                                    source={{
                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.contributerUid + "/" + item.imgPath,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{ width: '70%' }}>
                                <Text style={{ fontSize: 10, marginTop: 3,color: 'black' }}>By {item.contributorName}</Text>
                                <Text style={{ fontSize: 10, color: 'grey', marginTop: 3 }}>{description.substring(0, 50)}</Text>
                                <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{imageDate}</Text>
                                {item.fullScreen == true ? (
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Image source={require('../../../assets/star.png')} style={{ width: 10, height: 10 }} />
                                        <Text style={{ fontSize: 9, color: 'grey', marginLeft: 3 }}>FULL SCREEN / {item.imgOrientation}</Text>
                                    </View>
                                ) : <View style={{ flexDirection: 'row', marginTop: 3 }}>
                                    <Image source={require('../../../assets/star.png')} style={{ width: 10, height: 10 }} />
                                    <Text style={{ fontSize: 9, color: 'grey', marginLeft: 3 }}>{item.imgOrientation}</Text>
                                </View>
                                }
                            </View>
                            <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => alertRemove(item.imgStoreRef)}>
                                    <Image source={require('../../../assets/delete.png')} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                                {/* <Image source={require('../../../assets/sort.png')} style={{ width: 20, height: 20 }} /> */}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        } else if (index > 29) {
            return (
                <View>
                    <TouchableOpacity activeOpacity={0.8} onLongPress={drag}>
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5, backgroundColor: 'lightgrey' }}>
                            <View style={{ width: '20%' }}>
                                <FastImage
                                    style={globalStyles.sorting_ItemImg}
                                    source={{
                                        uri: constants.apiIP + "download/byuser/bypath?path=" + item.contributerUid + "/" + item.imgPath,
                                    }}
                                    resizeMode={FastImage.resizeMode.cover}
                                />
                            </View>
                            <View style={{ width: '70%' }}>
                                <Text style={{ fontSize: 10 }}>{description.substring(0, 50)}</Text>
                                <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{imageDate}</Text>
                                {item.fullScreen == true ? (
                                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                        <Image source={require('../../../assets/star.png')} style={{ width: 10, height: 10 }} />
                                        <Text style={{ fontSize: 9, color: 'grey', marginLeft: 3 }}>Full screen / {item.imgOrientation}</Text>
                                    </View>
                                ) : <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    <Image source={require('../../../assets/star.png')} style={{ width: 10, height: 10 }} />
                                    <Text style={{ fontSize: 9, color: 'grey', marginLeft: 3 }}>{item.imgOrientation}</Text>
                                </View>
                                }
                            </View>
                            <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => alertRemove(item.imgStoreRef)}>
                                    <Image source={require('../../../assets/delete.png')} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )

        }

    }


    return (
        <View style={globalStyles.JournalSorting_main_Container}>
            <SafeAreaView style={{ flex: 1 }}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ fontSize: 12, color: 'white' }}
                />
                {imagesList.length != 0 ? (
                    <View style={{ flex: 1 }}>

                        <View style={globalStyles.sorting_header}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails', { admin: adminName })}>
                                <View style={{ padding: 10 }}>
                                    <Image source={require('../../../assets/left-arrow.png')} style={{ width: 20, height: 20 }} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center', fontSize: 11, width: '85%', marginRight: 25 ,color: 'black'}}>{hereYouCanSort} {adminName}</Text>
                            </View>
                        </View>
                        <DraggableFlatList
                            data={imagesList}
                            onDragEnd={({ data }) => setImagesList(data)}
                            keyExtractor={(item) => item.imgStoreRef}
                            renderItem={renderItem}
                        />
                        <View style={{
                            alignSelf: 'center',
                            position: 'absolute',
                            bottom: 40,
                        }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => console.log(imagesList)}>
                                <View style={globalStyles.drawerMenu_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{save}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                        <Image source={require('../../../assets/search_emptyList.png')} style={{ width: 60, height: 60, marginBottom: 30 }}></Image>
                        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold',color: 'black' }}>{youhaveNoPhotosatThisMoment}</Text>
                        <Text style={{ color: 'grey' }}>{addphotostopreviewthejournal}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('JournalDetails', { admin: adminName })}>
                            <View style={{ marginTop: 50, width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: "grey", borderWidth: 1 }}>
                                <Text style={{color: 'black'}}>Back</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </SafeAreaView>

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
        </View>
    );
}




const styles = StyleSheet.create({
    listContainer: {
        width: 355,
        backgroundColor: '#F5F5F5'
    }
})

export default JournalSorting;