import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, Alert } from "react-native";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import PhoneInput, { isValidNumber } from "react-native-phone-number-input";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../Activities/03-constants/global";
import DatePicker from 'react-native-datepicker'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../App";
import NetInfo from "@react-native-community/netinfo";
import ImagePicker from "react-native-image-crop-picker";
import { NoInternetConnection } from "../02-components/ConnectionComponent";
import { createUserProfile, checkEmailVerification } from "../03-providers/UserProvider";

const CreateAccountPage = ({ route, navigation }) => {
    let [name, setName] = useState('')
    let [birthday, setBirthday] = useState('')
    let [password, setPassword] = useState('')
    let [confirmPassword, setConfirmPassword] = useState('')
    let [email, setEmail] = useState('')
    let [emailCondition, setEmailCondition] = useState(0)
    let [emailWarning, setEmailWarning] = useState(false)
    let [confirmpasswordWarning, setConfirmpasswordWarning] = useState(false)
    let [nameWarning, setNameWarning] = useState(false)
    let [phonenumberWarning, setPhoneNumberWarning] = useState(false)
    let [weeakpasswordStatus, setWeakPasswordStatus] = useState(false)
    let [emailExistStatus, setEmailExistStatus] = useState(false)
    let [phoneValue, setPhoneValue] = useState("");
    let [formattedValue, setFormattedValue] = useState("");
    let [securityText, setSecurityText] = useState(true);
    let [securityTextConfirm, setSecurityTextConfirm] = useState(true);

    let [submitBtnToggle, setSubmitBtnToggle] = useState(true);
    let checkValid = isValidNumber(formattedValue);
    let [imageSelected, setImageSelected] = useState("")
    let [currentToken, setCurrentToken] = useState('')
    let [isConnectedToInternet, setIsConnectedToInternet] = useState(true);


    //Labels
    let [createAccount, setCreateAccount] = useState("Create Account");
    let [nameLabel, setNameLabel] = useState("Full Name");
    let [familyNameLabel, setFamilyNameLabel] = useState("Family Name");
    let [birthdayLabel, setBirthdayLabel] = useState("Birthday");
    let [phoneNumberLabel, setPhoneNumberLabel] = useState("Phone number");
    let [emailLabel, setEmailLabel] = useState("Email");
    let [passwordLabel, setPasswordLabel] = useState("Password");
    let [confirmPasswordLabel, setConfirmPasswordLabel] = useState("Confirm Password");
    let [submitLabel, setSubmitLabel] = useState("Submit");
    let [finalizeLabel, setFinalizeLabel] = useState("Finalize");
    let [email_already_in_use, setEmailAlreadyinUse] = useState("The email address is already in use by another account.");
    let [weak_password, setWeakPassword] = useState("Weak-password, The given password is invalid.");
    let [your_account_successfully_created, setYourAccountSuccessfullyCreated] = useState("Your account has been successfully created");
    let [please_verify_your_email, setPleaseVerifyYourEmail] = useState("Please Verify Your Email Address");
    let [pleaseselectaprofilepicture, setPleaseselectaprofilepicture] = useState("Please select a profile picture");
    let [warning, setWarning] = useState("Warning")
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");
    let [checkyourconnectionthenrefreshthepage, setCheckyourconnectionthenrefreshthepage] = useState("Check your connection, then refresh the page");


    const showPassword = require('../../assets/view.png')
    const hidePassword = require('../../assets/hidden.png')
    let showHidePasswordIcon = securityText == false ? showPassword : hidePassword
    let showHideConfrimPasswordIcon = securityTextConfirm == false ? showPassword : hidePassword


    /** function to change show/hide password icon in the textInput */
    const toggleshowPasswordIcon = () => {
        setSecurityText(!securityText)
    }
    const toggleshowConfirmPasswordIcon = () => {
        setSecurityTextConfirm(!securityTextConfirm)
    }

    /** function to check if email is formatted */
    const validate = (text) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        if (reg.test(text) === false) {
            setEmail(text)
            setEmailCondition(0)
            return false;
        }
        else {
            setEmail(text)
            setEmailCondition(1)
        }
    }

    /** function check if all require fields exists then call backend api "callApiIfUserVerified()" to check if email is verified */
    const submitFunction = () => {
        if (emailCondition === 0 || email == '') {
            setEmailWarning(true)
        } else {
            setEmailWarning(false)
        }

        if (password != confirmPassword || password == '' || confirmPassword == '') {
            setConfirmpasswordWarning(true)
            setWeakPasswordStatus(false)
        } else {
            setConfirmpasswordWarning(false)
        }

        if (name == '') {
            setNameWarning(true)
        } else {
            setNameWarning(false)
        }

        if (phoneValue == '' || checkValid == false) {
            setPhoneNumberWarning(true)
        } else {
            setPhoneNumberWarning(false)
        }

        if (imageSelected == "" && password == confirmPassword && password != '' && confirmPassword != '' && emailCondition === 1 && email != '' && name != '' && phoneValue != '' && checkValid == true) {
            Alert.alert(
                warning,
                pleaseselectaprofilepicture,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        }

        if (imageSelected != "" && password == confirmPassword && password != '' && confirmPassword != '' && emailCondition === 1 && email != '' && name != '' && phoneValue != '' && checkValid == true) {
            callApiIfUserVerified()
        }
    }

    /**  Function call backend Api to check if email is verified */
    const callApiIfUserVerified = () => {
        checkEmailVerification(email)
            .then((response) => response.json())
            .then((responseJson) => checkUserIfVerified(responseJson))
            .catch((error) => { console.log(error) })
    }

    /**
     * Function that takes callApiIfUserVerified() Api's response 
     * check if user is verifed 
     * if not verified then create User Account in Firebase with email and password, and submit btn change to finalize
     * if verified nothing to do
     */
    const checkUserIfVerified = (responseJson) => {
        if (responseJson.emailVerified === false) {
            setEmailExistStatus(false)
            auth().createUserWithEmailAndPassword(email, password).then(response => {
                response.user.getIdToken().then(function (idToken) {
                    setCurrentToken(idToken)
                })
                response.user.sendEmailVerification().then(user => {
                    Toast.show({
                        text1: your_account_successfully_created,
                        text2: please_verify_your_email,
                        visibilityTime: 6000,
                    });
                    setSubmitBtnToggle(false)
                    setEmailWarning(false)
                    setConfirmpasswordWarning(false)
                    setNameWarning(false)
                    setWeakPasswordStatus(false)
                    setEmailExistStatus(false)
                })
            }).catch(e => {
                if (e.message === '[auth/weak-password] The given password is invalid.' || e.message === '[auth/weak-password] The given password is invalid. [ Password should be at least 6 characters ]') {
                    setWeakPasswordStatus(true)
                    setEmailExistStatus(false)
                } else {
                    setWeakPasswordStatus(false)
                    setEmailExistStatus(true)
                }
            })
        } else {
            setEmailExistStatus(true)
            setWeakPasswordStatus(false)

        }
    }

    /**
     * finalizeFunction() check if user verified with Firebase
     * if verified then call uploadProfile() function, Login and navigate to the HomePage 
     * if not verified then a message appear to tell the user that he should verifie the email
     */
    const finalizeFunction = () => {
        auth().signInWithEmailAndPassword(email, password).then(response => {
            if (response.user.emailVerified === true) {
                navigation.navigate('Root')
                uploadProfile()
            } else {
                Toast.show({
                    text1: 'Warning',
                    text2: 'Please verify your email',
                    visibilityTime: 6000,
                    type: 'info'
                });
            }
        })
    }


    /** this function call backend api to upload the profile into database with the require fields */
    const uploadProfile = () => {
        const data = new FormData();
        data.append('profilePhoto', {
            name: imageSelected,
            type: "image/jpeg",
            uri:
                Platform.OS === "android"
                    ? imageSelected
                    : imageSelected.replace("file://", "")
        })
        data.append('name', name)
        data.append('birthday', birthday)
        data.append('phone', formattedValue)
        data.append('email', email)

        createUserProfile(currentToken, data)
            .then((response) => response.json())
            .then((responseJson) => console.log(responseJson))
            .catch((error) => { console.log(error) })
    }

    /** function to open the mobile gallery and pick an image */
    const openGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true
        }).then(image => {
            setImageSelected(image.path)
        })
    }

    /** function to toggle Image source view by default and when user select an image */
    const renderFileUri = () => {
        if (imageSelected != '') {
            return <Image
                source={{ uri: imageSelected }}
                style={globalStyles.createAccount_uploadRoundedImage}
            />
        } else {
            return <Image
                source={require('../../assets/user.png')}
                style={globalStyles.createAccount_uploadRoundedImage}
            />
        }
    }

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setCreateAccount(strings.createAccount)
            setNameLabel(strings.fullName)
            setFamilyNameLabel(strings.familyName)
            setBirthdayLabel(strings.birthday)
            setPhoneNumberLabel(strings.phoneNumber)
            setEmailLabel(strings.email)
            setPasswordLabel(strings.password)
            setConfirmPasswordLabel(strings.confirmpassword)
            setSubmitLabel(strings.submit)
            setFinalizeLabel(strings.finalize)
            setEmailAlreadyinUse(strings.email_already_in_use)
            setWeakPassword(strings.weak_password)
            setYourAccountSuccessfullyCreated(strings.your_account_successfully_created)
            setPleaseVerifyYourEmail(strings.please_verify_your_email)
            setPleaseselectaprofilepicture(strings.pleaseselectaprofilepicture)
            setWarning(strings.warning)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setCheckyourconnectionthenrefreshthepage(strings.checkyourconnectionthenrefreshthepage)
        } catch (e) {
            console.log(e)
        }
    }

    /** function to check if internet connection is enable or not */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            console.log(state)
            if (state.isConnected == true) {
                getAsyncStorageData()
                setIsConnectedToInternet(true)
            } else {
                getAsyncStorageData()
                setIsConnectedToInternet(false)
            }
        });
    }

    useEffect(() => {
        checkConnection()
        return () => {
        }
    }, [])


    return (
        <SafeAreaView style={globalStyles.container}>
            {isConnectedToInternet == true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }} showsVerticalScrollIndicator={false}>
                    <View style={globalStyles.JournalDetails_header}>
                            <View style={globalStyles.viewWidth100FlexRow}>
                                <View style={globalStyles.detailsHeaderLeftView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('WelcomePage')}>
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
                        <View style={globalStyles.CreateAcc_image_div}>
                            <View style={globalStyles.createAccount_profileImage}>
                                <TouchableOpacity activeOpacity={0.5} style={globalStyles.viewFlex1} onPress={() => openGallery()}>
                                    <View style={globalStyles.createAccount_uploadRoundedImage}>
                                        {renderFileUri()}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <Text style={globalStyles.main_Login_boldText}>{createAccount}</Text>
                        </View>

                        <View style={globalStyles.Login_Midle_div}>
                            <View style={{ flex: 1, width: '100%' }}>
                                <View>
                                    <Text style={{ color: 'grey', marginLeft: 25, marginTop: 20, fontSize: 12 }}>{nameLabel}</Text>
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={globalStyles.textInputWithIcon} underlineColorAndroid="transparent" onChangeText={(text) => setName(text)} />
                                        {nameWarning ?
                                            (
                                                <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon} />) : null}
                                    </View>
                                </View>

                                <View>
                                    <Text style={globalStyles.CreateAcc_titleInput}>{birthdayLabel}</Text>
                                    <DatePicker
                                        style={{ width: '95%', marginTop: 3 }}
                                        date={birthday}
                                        mode="date"
                                        showIcon={false}
                                        placeholder="select date"
                                        format="DD-MM-YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        customStyles={{
                                            dateIcon: {
                                                position: 'absolute',
                                                left: 0,
                                                top: 4,
                                                marginLeft: 0
                                            },
                                            dateInput: {
                                                marginLeft: 20,
                                                borderRadius: 5,
                                                borderColor: '#D5D5D5',
                                                alignItems: 'flex-start',
                                                padding: 10,
                                                fontSize: 10
                                            }
                                        }}
                                        onDateChange={(date) => setBirthday(date)}
                                    />
                                </View>

                                <View>
                                    <Text style={globalStyles.CreateAcc_titleInput}></Text>
                                    <View style={globalStyles.phonenumber_InputwithImage}>

                                        <PhoneInput
                                            ref={(view) => {
                                                this.phoneInput = view;
                                            }}
                                            textInputStyle={{ fontSize: 12, color: 'black' }}
                                            codeTextStyle={{ fontSize: 12 }}
                                            textContainerStyle={{ backgroundColor: 'white' }}
                                            flagButtonStyle={{ marginLeft: 5 }}
                                            defaultValue={phoneValue}
                                            defaultCode="FR"
                                            layout="first"
                                            onChangeText={(text) => {
                                                setPhoneValue(text);
                                            }}
                                            onChangeFormattedText={(text) => {
                                                setFormattedValue(text);
                                            }}
                                        />
                                        {phonenumberWarning ?
                                            (
                                                <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon_Phone} />) : null}
                                    </View>
                                </View>

                                <View>
                                    <View style={globalStyles.flexRow}>
                                        <Text style={globalStyles.CreateAcc_titleInput}>{emailLabel}</Text>
                                        {emailExistStatus ?
                                            (
                                                <Text style={globalStyles.weakpassword_label}>{email_already_in_use}</Text>) : null}
                                    </View>
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={globalStyles.textInputWithIcon} underlineColorAndroid="transparent" onChangeText={(text) => validate(text)} />
                                        {emailWarning ?
                                            (
                                                <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon} secureTextEntry={false} />) : null}
                                    </View>
                                </View>

                                <View>
                                    <View style={globalStyles.flexRow}>
                                        <Text style={globalStyles.CreateAcc_titleInput}>{passwordLabel}</Text>
                                        {weeakpasswordStatus ?
                                            (
                                                <Text style={globalStyles.weakpassword_label}>{weak_password}</Text>) : null}
                                    </View>
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={globalStyles.textInputWithIcon} secureTextEntry={securityText} underlineColorAndroid="transparent" onChangeText={(text) => setPassword(text)} />
                                        <TouchableOpacity onPress={() => toggleshowPasswordIcon()} style={{ justifyContent: 'center', flex: 1 }}>
                                            <Image source={showHidePasswordIcon} style={globalStyles.login_password_showHidePass} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                                <View>
                                    <View style={globalStyles.flexRow}>
                                        <Text style={globalStyles.CreateAcc_titleInput}>{confirmPasswordLabel}</Text>
                                    </View>
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={globalStyles.textInputWithIcon} secureTextEntry={securityTextConfirm} underlineColorAndroid="transparent" onChangeText={(text) => setConfirmPassword(text)} />
                                        <TouchableOpacity onPress={() => toggleshowConfirmPasswordIcon()} style={{ justifyContent: 'center', flex: 1 }}>
                                            <Image source={showHideConfrimPasswordIcon} style={globalStyles.login_password_showHidePass} />
                                        </TouchableOpacity>
                                        {confirmpasswordWarning ?
                                            (
                                                <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon} />) : null}
                                    </View>
                                </View>

                                {/* <View>
                                    <Text style={globalStyles.CreateAcc_titleInput}>{confirmPasswordLabel}</Text>
                                    <View style={globalStyles.login_InputwithImage}>
                                        <TextInput style={globalStyles.textInputWithIcon} underlineColorAndroid="transparent" onChangeText={(text) => setConfirmPassword(text)} />
                                        {confirmpasswordWarning ?
                                            (
                                                <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon} />) : null}
                                    </View>
                                </View> */}


                                <View style={globalStyles.viewSubmitButton}>
                                    {submitBtnToggle ? (
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => submitFunction()}>
                                            <View style={globalStyles.createAccount_button}>
                                                <Text style={globalStyles.Wel_Log_buttonLabel}>{submitLabel}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ) :
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => finalizeFunction()}>
                                            <View style={globalStyles.createAccount_button}>
                                                <Text style={globalStyles.Wel_Log_buttonLabel}>{finalizeLabel}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </View>
                        </View>

                        <Toast ref={(ref) => Toast.setRef(ref)} />
                    </KeyboardAwareScrollView>
                </View>
            ) :
                <NoInternetConnection noInternetConnection={noInternetConnection} checkyourconnection={checkyourconnectionthenrefreshthepage} checkConnection={checkConnection} refresh={refresh} />

            }
        </SafeAreaView>

    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

})

export default CreateAccountPage;