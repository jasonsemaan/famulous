import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import { globalStyles } from "../../../Activities/03-constants/global";
import DraggableFlatList from "react-native-draggable-flatlist";
import { strings } from "../../../App";
import FastImage from 'react-native-fast-image'
import moment from "moment";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from "@react-native-community/netinfo";
import auth, { firebase } from '@react-native-firebase/auth';
import Toast, { DURATION } from 'react-native-easy-toast';
import { constants } from "../../03-constants/Constants";
import { ModalConnection } from "../02-components/ConnectionComponent";
import { changeImgOrder, DeleteImage, GetSingleEditionImages, updateImageDescription } from "../03-providers/ImagesProvider";
import { SingleImageEnable, FullScreenImageEnable, SingleImageDisable, FullScreenImageDisable } from "../02-components/JournalSortingComponent";
import { JournalContext } from "../04-context/Context";

const JournalSorting = ({ route, navigation }) => {

    const myContext = useContext(JournalContext);
    let [contextMonthDate, setContextMonthDate] = useState(myContext.DateMonth)
    let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
    let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)

    let [imagesList, setImagesList] = useState([]);
    let [loading, setLoading] = useState(false);
    let [currentIdToken, setCurrentIdToken] = useState("");
    let [selectedImageDescription, setSelectedImageDescription] = useState("");
    let [selectedImageRef, setSelectedImageRef] = useState("");
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)
    let [modalStatus, setModalStatus] = useState(false)

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
    let [editImageDescription, setEditImageDescription] = useState("Edit image description")
    let [by, setBy] = useState("By")
    let [fullScreenLabel, setFullScreenLabel] = useState("FULL SCREEN")



    /** get the tokenID */
    const getTokenId = () => {
        setLoading(true)
        auth().onAuthStateChanged(function (user) {
            if (!user) {
                return;
            }
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData(idToken)
                setCurrentIdToken(idToken)
            });
        });
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
    const getAsyncStorageData = async (idToken) => {
        try {
            strings.setLanguage(contextAppLanguage)
            setHereYouCanSort(strings.hereYouCanSort)
            setAreyousureyouwanttoremove(strings.areyousureyouwanttoremove)
            setCancel(strings.cancel)
            setRemove(strings.remove)
            setSave(strings.save)
            setYouhaveNoPhotosatThisMoment(strings.youhaveNoPhotosatThisMoment)
            setAddphotostopreviewthejournal(strings.addphotostopreviewthejournal)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setEditImageDescription(strings.editImageDescription)
            setBy(strings.by)
            setFullScreenLabel(strings.fullScreenLabel)
            getJournalEditionImages(idToken, contextEditionRef)
        } catch (e) {
            console.log(e)
        }
    }

    /** call backend api to get all single images from the db */
    const getJournalEditionImages = (idToken, editionRef) => {
        setLoading(true)
        GetSingleEditionImages(idToken, editionRef)
            .then((response) => response.json())
            .then((responseJson) => storeData(responseJson))
            .catch((error) => { console.log(error) })
    };

    /** function to store response of the backend api into a current list */
    const storeData = (responseJson) => {
        const sortedList = responseJson.sort(function (obj1, obj2) {
            return obj1.imgOrder - obj2.imgOrder;
        });
        setImagesList(sortedList)
        setLoading(false)
    }

    /** popup alert to delete item from list or cancel request */
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


    /** delete item from list */
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


    /** delete Image from DB */
    const deleteImageFromDB = (imageRef) => {
        setLoading(true)
        DeleteImage(imageRef)
            .then((response) => response.json())
            .then(getJournalEditionImages(currentIdToken, contextEditionRef))
            .catch((error) => { console.log(error) })
    }

    const openUpdateDescModal = (imageRef, imageDesc) => {
        setSelectedImageDescription(imageDesc)
        setSelectedImageRef(imageRef)
        setModalStatus(true);
    }

    const updateImageDesc = () => {
        updateImageDescription(selectedImageRef, selectedImageDescription)
            .then((response) => response.json())
            .then(getTokenId(), setModalStatus(false))
            .catch((error) => { console.log(error) })
    }

    const sendSortedListToDB = () => {
        changeImgOrder(imagesList)
            .then((response) => response.json())
            .then((response) => getTokenId())
            .catch((error) => { console.log(error) })
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
        checkConnection();
        return () => {
        }
    }, [])

    /** render the main flatlist items view */
    const renderItem = ({ item, drag, isActive, index }) => {
        return (
            <View>
                {two_perRow(item, drag, isActive, index)}
            </View>
        );
    };

    /** function to seperate flatlist items, >30 and <=30 */
    const two_perRow = (item, drag, isActive, index) => {
        let noDesc = "No description"
        let desc = item.imgDescription
        let description = item.imgDescriptionVisible == false ? noDesc : desc

        var imageDate = moment(new Date(item.uploadTime * 1000)).format('MM-DD-YYYY');
       
            return (
                <View>
                    {/* {item.fullScreen === false ? ( */}
                        <TouchableOpacity activeOpacity={0.8} onLongPress={drag}>
                            <SingleImageEnable contributerUid={item.contributerUid}
                                imgPath={item.imgPath}
                                by={by}
                                contributorName={item.contributorName}
                                description={description.substring(0, 50)} i
                                imageDate={imageDate}
                                fullScreenLabel={fullScreenLabel}
                                imgOrientation={item.imgOrientation}
                                fullScreen={item.fullScreen}
                                imgDescriptionVisible={item.imgDescriptionVisible}
                                openUpdateDescModal={() => openUpdateDescModal(item.imgStoreRef, item.imgDescription)}
                                alertRemove={() => alertRemove(item.imgStoreRef)}
                                isDesc={item.desc}
                            />
                        </TouchableOpacity>
                    {/* ) :
                        <TouchableOpacity activeOpacity={0.8} onLongPress={drag}>
                            <FullScreenImageEnable contributerUid={item.contributerUid}
                                imgPath={item.imgPath}
                                by={by}
                                contributorName={item.contributorName}
                                description={description.substring(0, 50)} i
                                imageDate={imageDate}
                                fullScreenLabel={fullScreenLabel}
                                imgOrientation={item.imgOrientation}
                                fullScreen={item.fullScreen}
                                imgDescriptionVisible={item.imgDescriptionVisible}
                                openUpdateDescModal={() => openUpdateDescModal(item.imgStoreRef, item.imgDescription)}
                                alertRemove={() => alertRemove(item.imgStoreRef)}
                                isDesc={item.desc}
                            />
                        </TouchableOpacity>
                    } */}
                </View>
            )
        
    }


    return (
        <View style={globalStyles.JournalSorting_main_Container}>
            <SafeAreaView style={globalStyles.viewFlex1}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={globalStyles.spinnerTextStyle}
                />
                {imagesList.length != 0 ? (
                    <View style={globalStyles.viewFlex1}>

                        <View style={globalStyles.sorting_header}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails')}>
                                <View style={{ padding: 10 }}>
                                    <Image source={require('../../assets/left-arrow.png')} style={{ width: 20, height: 20 }} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ alignSelf: 'center', fontSize: 11, width: '85%', marginRight: 25, color: 'black' }}>{hereYouCanSort} {contextMonthDate}</Text>
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
                            <TouchableOpacity activeOpacity={0.8} onPress={() => sendSortedListToDB()}>
                                <View style={globalStyles.SortingSave_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{save}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) :
                    <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
                        <Image source={require('../../assets/search_emptyList.png')} style={globalStyles.noInternetIconwidth60} />
                        <Text style={globalStyles.blackBoldLabel}>{youhaveNoPhotosatThisMoment}</Text>
                        <Text style={globalStyles.textColorGrey}>{addphotostopreviewthejournal}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('JournalDetails')}>
                            <View style={{ marginTop: 50, width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderColor: "grey", borderWidth: 1 }}>
                                <Text style={{ color: 'black' }}>Back</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                }
            </SafeAreaView>
            <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh} />

            <Modal transparent={true} visible={modalStatus}>
                <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
                    <View style={globalStyles.modalDivstyle}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '35%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center', }}>
                            <View style={globalStyles.modalViewCenter}>
                                <View style={globalStyles.alignItemsCenter}>
                                    <View style={{ marginBottom: 10, flexDirection: 'row' }}>
                                        <Image source={require('../../assets/edit.png')} style={{ width: 15, height: 15, marginRight: 10 }} />
                                        <Text style={{ color: 'black', fontSize: 12 }}>
                                            {editImageDescription}
                                        </Text>
                                    </View>
                                    <View style={globalStyles.calendarModal_InputView}>
                                        <TextInput style={globalStyles.calendarModal_textInput} underlineColorAndroid="transparent" defaultValue={selectedImageDescription} onChangeText={(text) => setSelectedImageDescription(text)} placeholderTextColor='#A5A5A5' />
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => updateImageDesc()}>
                                        <View style={globalStyles.changeDesc_button_style}>
                                            <Text style={globalStyles.Wel_Log_buttonLabel}>Change</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
                <Toast ref={(toast) => this.toast = toast} />
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