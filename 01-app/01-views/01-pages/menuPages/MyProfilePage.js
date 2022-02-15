import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal, Alert, DevSettings } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FastImage from 'react-native-fast-image';
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import Toast, { DURATION } from 'react-native-easy-toast';
import { strings } from "../../../../App";
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";



const MyProfilePage = ({ navigation }) => {
    let [signedUserName, setSignedUserName] = useState("");
    let [signedUserUid, setSignedUserUid] = useState("");
    let [signedUserbirthday, setSignedUserbirthday] = useState("");
    let [signedUserEmail, setSignedUserEmail] = useState("");
    let [signedPhoneNumber, setSignedPhoneNumber] = useState("");
    let [profilePhoto, setProfilePhoto] = useState('')
    let [loading, setLoading] = useState(false);
    let [securityText, setSecurityText] = useState(true);
    let [securityTextNewPassword, setSecurityTextNewPassword] = useState(true);
    let [passwordErrorStatus, setIncorrectPasswordErrorStatus] = useState(false);
    let [currentPassword, setCurrentPassword] = useState("");
    let [newPassword, setNewPassword] = useState("");
    let [currentpasswordwarningstatus, setCurrentpasswordwarningstatus] = useState(false);
    let [newpasswordwarningstatus, setNewpasswordwarningstatus] = useState(false);
    let [connectionModalStatus, setConnectionModalStatus] = useState(false)


    let [currentToken, setCurrentToken] = useState('')


    //Labels
    let [myProfile, setMyProfile] = useState("My Profile");
    let [editJournalProfile, setEditJournalProfile] = useState("Edit Journal Profile");
    let [name, setName] = useState("Name");
    let [birthday, setBirthday] = useState("Birthday");
    let [phoneNumber, setPhoneNumber] = useState("Phone number");
    let [email, setEmail] = useState("Email");
    let [currentPasswordLabel, setCurrentPasswordLabel] = useState("Current Password");
    let [newPasswordLabel, setNewPasswordLabel] = useState("New Password");
    let [incorrectPasswordLabel, setIncorrectPasswordLabel] = useState("Incorrect Password!");
    let [yourProfilehasSuccesfullyUpdated, setYourProfilehasSuccesfullyUpdated] = useState("Your profile has successfully updated");
    let [pleaseYouHaveToRe_SelecttheProfileImage, setPleaseYouHaveToRe_SelecttheProfileImage] = useState("Please you have to re-select the profile image");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");


    let [change, setChange] = useState("Change");
    let [save, setSave] = useState("Save");


    const showPassword = require('../../../../assets/view.png')
    const hidePassword = require('../../../../assets/hidden.png')
    let showPasswordIcon = securityText == false ? showPassword : hidePassword
    let showPasswordIconNewPassword = securityTextNewPassword == false ? showPassword : hidePassword

    /**
     * function to change show/hide password icon in the textInput
     */
    const toggleshowPasswordIcon = (status) => {
        if (status === 0) {
            setSecurityText(!securityText)
        } else {
            setSecurityTextNewPassword(!securityTextNewPassword)
        }

    }

    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    /**
     * function to change profile password in firebase
     */
    const changePassword = () => {
        if (currentPassword == "") {
            setCurrentpasswordwarningstatus(true)
            setIncorrectPasswordErrorStatus(false)
        } else {
            setCurrentpasswordwarningstatus(false)
        }
        if (newPassword == "") {
            setNewpasswordwarningstatus(true)
        } else {
            setNewpasswordwarningstatus(false)
        }

        if (currentPassword != "" && newPassword != "") {
            NetInfo.fetch().then(state => {
                if (state.isConnected == true) {
                    console.log(state)
                    this.reauthenticate(currentPassword).then(() => {
                        var user = firebase.auth().currentUser;
                        user.updatePassword(newPassword).then(() => {
                            console.log("Password updated!");
                            this.toast.show('Password updated', 2000)
                            setIncorrectPasswordErrorStatus(false)
                        }).catch((error) => { console.log(error); });
                    }).catch((error) => { checkError(error) });
                } else {
                    setConnectionModalStatus(true)
                    getAsyncStorageData()
                }
            })
        }
    }


    const checkError = (error) => {
        setIncorrectPasswordErrorStatus(true)
    }


    /**
     * get the tokenID
     */
    const getTokenId = () => {
        setLoading(true)
        auth().onAuthStateChanged(function (user) {
            user.getIdToken().then(function (idToken) {
                console.log("idToken", idToken);
                setCurrentToken(idToken)
                getUserProfile(idToken)
                getAsyncStorageData();
            });
        });
    }


    /**
     *  get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setMyProfile(strings.myProfile)
            setEditJournalProfile(strings.editJournalProfile)
            setName(strings.name)
            setBirthday(strings.birthday)
            setPhoneNumber(strings.phoneNumber)
            setEmail(strings.email)
            setCurrentPasswordLabel(strings.currentPassword)
            setNewPasswordLabel(strings.newPassword)
            setIncorrectPasswordLabel(strings.incorrectPassword)
            setYourProfilehasSuccesfullyUpdated(strings.yourProfilehasSuccesfullyUpdated)
            setPleaseYouHaveToRe_SelecttheProfileImage(strings.pleaseYouHaveToRe_SelecttheProfileImage)
            setChange(strings.change)
            setSave(strings.save)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)

        } catch (e) {
            console.log(e)
        }
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
            .then((responseJson) => storeUserProfile(responseJson))
    };


    /**
     * function to store the user info in the AsyncStorage
     * @param {*} response getted from the response of the api
     */
    const storeUserProfile = (response) => {
        setSignedUserUid(response.userUid)
        setSignedUserName(response.username)
        setSignedUserEmail(response.email)
        setSignedUserbirthday(response.birthdate)
        setSignedPhoneNumber(response.phoneNumber)
        setLoading(false)
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
                console.log('Response = ', response.assets[0].uri);
                setProfilePhoto(response.assets[0].uri)
            }
        });
    }


    /**
     *  this function call backend api to update userProfile
     */
    const updateUserProfile = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                if (profilePhoto == "") {
                    this.toast.show(pleaseYouHaveToRe_SelecttheProfileImage, 2000)
                } else if (signedUserName == "" || signedUserbirthday == "" || signedPhoneNumber == "" || signedUserEmail == "") {
                    this.toast.show("Please fill the required fields", 2000)
                }
                else {
                    setLoading(true)
                    FastImage.clearDiskCache().then(e => {
                        FastImage.clearMemoryCache().then(_ => {
                            const data = new FormData();
                            data.append('profilePhoto', {
                                name: profilePhoto,
                                type: "image/jpeg",
                                uri:
                                    Platform.OS === "android"
                                        ? profilePhoto
                                        : profilePhoto.replace("file://", "")
                            })
                            data.append('name', signedUserName)
                            data.append('birthday', signedUserbirthday)
                            data.append('phone', signedPhoneNumber + "")
                            data.append('email', signedUserEmail)


                            fetch(constants.apiIP + "userProfile/updateUserProfile", {
                                method: 'post',
                                body: data,
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                    "Authorization": "Bearer " + currentToken
                                },
                            })
                                .then((response) => response.json())
                                .then((responseJson) => console.log(responseJson))
                                .then(this.toast.show(yourProfilehasSuccesfullyUpdated, 2000), setLoading(false))
                        })
                    })
                }
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageData()
            }
        })
    }


    /**
     *  function to toggle Image source view by default and when user select an image
     */
    const renderFileUri = () => {
        if (profilePhoto != '') {
            return <Image
                source={{ uri: profilePhoto }}
                style={{ width: 80, height: 80, borderRadius: 80 / 2, marginTop: 20 }} />
        } else {
            return <FastImage
                style={{ width: 80, height: 80, borderRadius: 80 / 2, marginTop: 20 }}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />

        }
    }

    /**
    *  function to check if internet connection is enable or not
    */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getTokenId();
                setConnectionModalStatus(false)
            } else {
                setConnectionModalStatus(true)
                getAsyncStorageData()
                setLoading(false)
            }
        });
    }


    useEffect(() => {
        checkConnection();
        return () => {
        }
    }, [])


    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
                <Spinner
                    visible={loading}
                    textContent={'Loading...'}
                    textStyle={{ fontSize: 12, color: 'white' }}
                />
                <View style={{ height: '100%', backgroundColor: '#febf2e' }}>
                    <View style={{ height: '15%', alignItems: 'center' }}>
                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                        <View style={{ padding: 10 }}>
                                            <Image style={globalStyles.backArrow} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>{myProfile}</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                            </View>
                        </View>
                    </View>

                    <View style={globalStyles.menuDrawer_Overflow_Div}>
                        <ScrollView style={{ width: '100%', height: '100%' }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>

                            <View style={{ height: '100%', alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => openGallery()}>
                                    {renderFileUri()}
                                </TouchableOpacity>
                                <Text style={{ color: 'grey', fontSize: 15, marginTop: 15 }}>{editJournalProfile}</Text>
                                <View style={{ flex: 1, width: '100%', marginTop: 10 }}>
                                    <Text style={globalStyles.myProfile_titleInput}>{name}</Text>
                                    <View style={globalStyles.myprofile_Input}>
                                        <TextInput style={globalStyles.myProfile_textInput} underlineColorAndroid="transparent" defaultValue={signedUserName} onChangeText={(text) => setSignedUserName(text)} /></View>

                                    <Text style={globalStyles.myProfile_titleInput}>{birthday}</Text>
                                    <View style={globalStyles.myprofile_Input}>
                                        <TextInput style={globalStyles.myProfile_textInput} underlineColorAndroid="transparent" defaultValue={signedUserbirthday} onChangeText={(text) => setSignedUserbirthday(text)} /></View>

                                    <Text style={globalStyles.myProfile_titleInput}>{phoneNumber}</Text>
                                    <View style={globalStyles.myprofile_Input}>
                                        <TextInput style={globalStyles.myProfile_textInput} underlineColorAndroid="transparent" keyboardType="numeric" defaultValue={signedPhoneNumber} onChangeText={(text) => setSignedPhoneNumber(text)} /></View>

                                    <Text style={globalStyles.myProfile_titleInput}>{email}</Text>
                                    <View style={globalStyles.myprofile_Input}>
                                        <TextInput style={globalStyles.myProfile_textInput} underlineColorAndroid="transparent" defaultValue={signedUserEmail} onChangeText={(text) => setSignedUserEmail(text)} /></View>

                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={globalStyles.myProfile_titleInput}>{currentPasswordLabel}</Text>
                                        {passwordErrorStatus ?
                                            (
                                                <Text style={globalStyles.incorrectPassword}>{incorrectPasswordLabel}</Text>) : null}
                                    </View>
                                    {/* <View style={globalStyles.myprofile_Input}>
                                        <TextInput style={globalStyles.myProfile_textInput} secureTextEntry={true} underlineColorAndroid="transparent" onChangeText={(text) => setCurrentPassword(text)} /></View> */}
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={{ width: 260, alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black' }} secureTextEntry={securityText} underlineColorAndroid="transparent" onChangeText={(text) => setCurrentPassword(text)} />
                                        <TouchableOpacity onPress={() => toggleshowPasswordIcon(0)} style={{ justifyContent: 'center' }}>
                                            <Image source={showPasswordIcon} style={globalStyles.login_password_showHidePass}></Image>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ width: '80%' }}>
                                            <Text style={globalStyles.myProfile_titleInput}>{newPasswordLabel}</Text>
                                            {/* <View style={globalStyles.myprofile_Input}>
                                                <TextInput style={globalStyles.myProfile_textInput} secureTextEntry={true} underlineColorAndroid="transparent" onChangeText={(text) => setNewPassword(text)} />
                                            </View> */}
                                            <View style={globalStyles.login_InputwithImage}>
                                                <TextInput style={{ width: 200, alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black' }} secureTextEntry={securityTextNewPassword} underlineColorAndroid="transparent" onChangeText={(text) => setNewPassword(text)} />
                                                <TouchableOpacity onPress={() => toggleshowPasswordIcon(1)} style={{ justifyContent: 'center' }}>
                                                    <Image source={showPasswordIconNewPassword} style={globalStyles.login_password_showHidePass}></Image>
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                        <View style={{ width: '20%', marginTop: 30, justifyContent: 'center' }}>
                                            {currentPassword == "" || newPassword == "" ? (
                                                <TouchableOpacity activeOpacity={0.8} disabled={true}>
                                                    <Text style={{ color: 'grey', fontSize: 14 }}>{change}</Text>
                                                </TouchableOpacity>
                                            ) :
                                                <TouchableOpacity activeOpacity={0.8} onPress={() => changePassword()}>
                                                    <Text style={{ color: '#5ec6ca', fontSize: 14 }}>{change}</Text>
                                                </TouchableOpacity>
                                            }
                                        </View>

                                    </View>
                                </View>
                                <View style={{ left: 0, right: 0, bottom: 0, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 15,marginBottom:20 }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => updateUserProfile()}>
                                        <View style={globalStyles.drawerMenu_button}>
                                            <Text style={globalStyles.Wel_Log_buttonLabel}>{save}</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAwareScrollView>

            <Modal transparent={true} visible={connectionModalStatus}>
                <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
                    <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <View style={{ backgroundColor: '#ffffff', padding: 5, height: '10%', borderRadius: 10, alignItems: 'center', marginBottom: 50, marginLeft: 10, marginRight: 10 }}>
                            <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image source={require('../../../../assets/no-internet.png')} style={{ width: 30, height: 30, marginLeft: 10 }}></Image>
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
            <Toast ref={(toast) => this.toast = toast}
                style={{ borderRadius: 20 }}
                fadeInDuration={500}
                fadeOutDuration={500} />
        </View>

    );
}




const styles = StyleSheet.create({

})

export default MyProfilePage;