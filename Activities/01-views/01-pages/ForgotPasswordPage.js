import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../Activities/03-constants/global";
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";
import { NoInternetConnection } from "../02-components/ConnectionComponent";

const ForgotPasswordPage = ({ navigation }) => {

    let [emailVerification, setEmailVerification] = useState("")
    let [isConnectedToInternet, setIsConnectedToInternet] = useState(true);

    //Labels
    let [resetPassword, setResetPassword] = useState("Reset Password");
    let [enterAnEmailAddressYouUsetoSignIn, setEnterAnEmailAddressYouUsetoSignIn] = useState("Enter an email address you use to sign in to.");
    let [emailAddress, setEmailAddress] = useState("Email address");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");
    let [checkyourconnectionthenrefreshthepage, setCheckyourconnectionthenrefreshthepage] = useState("Check your connection, then refresh the page");

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(global.appLanguage)
            setResetPassword(strings.resetPassword)
            setEnterAnEmailAddressYouUsetoSignIn(strings.enterEmailAddressYouUsetoSignIn)
            setEmailAddress(strings.emailAddress)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setCheckyourconnectionthenrefreshthepage(strings.checkyourconnectionthenrefreshthepage)
        } catch (e) {
            console.log(e)
        }
    }

    const forgotPasswordReset = (Email) => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                firebase.auth().sendPasswordResetEmail(Email)
                    .then(function (user) {
                        alert('Please check your email...')
                    }).catch(function (e) {
                        alert(e)
                        console.log(e)
                    })
            } else {
                getAsyncStorageData()
                setIsConnectedToInternet(false)
            }
        })
    }

    /** function to check if internet connection is enable or not */
    const checkConnection = () => {
        NetInfo.fetch().then(state => {
            if (state.isConnected == true) {
                getAsyncStorageData()
                setIsConnectedToInternet(true)
            } else {
                setIsConnectedToInternet(false)
                getAsyncStorageData()
            }
        });
    }

    useEffect(() => {
        getAsyncStorageData()
        return () => {
        }
    }, [])


    return (
        <View style={globalStyles.container}>
            {isConnectedToInternet == true ? (
                <SafeAreaView style={globalStyles.viewFlex1}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={globalStyles.viewFlex1}>
                        <View style={{ height: '10%' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("WelcomePage")}>
                                <Image source={require('../../assets/left-arrow.png')} style={{ width: 30, height: 30, marginTop: 20 }} />
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '90%', alignItems: 'center' }}>
                            <Image source={require('../../assets/resetPassword.png')} style={globalStyles.image_ResetPassword} />

                            <Text style={{ marginTop: 100, fontWeight: 'bold', fontSize: 18 }}>{resetPassword}</Text>
                            <Text style={{ color: 'grey', marginTop: 5, fontSize: 11 }}>{enterAnEmailAddressYouUsetoSignIn}</Text>
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <View style={globalStyles.marginTopAuto}>
                                    <View style={globalStyles.calendarModal_InputView}>
                                        <TextInput style={globalStyles.calendarModal_textInput} underlineColorAndroid="transparent" onChangeText={(text) => setEmailVerification(text)} placeholder={emailAddress} placeholderTextColor='#A5A5A5' />
                                    </View>
                                </View>
                            </View>
                            {emailVerification != "" ? (
                                <TouchableOpacity activeOpacity={0.8} onPress={() => forgotPasswordReset(emailVerification)} >
                                    <View style={globalStyles.resetPassword_button}>
                                        <Text style={globalStyles.Wel_Log_buttonLabel}>{resetPassword}</Text>
                                    </View>
                                </TouchableOpacity>
                            ) :
                                <TouchableOpacity activeOpacity={0.8} disabled={true}>
                                    <View style={globalStyles.resetPassword_button_disable}>
                                        <Text style={globalStyles.Wel_Log_buttonLabel}>{resetPassword}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        </View>

                    </KeyboardAwareScrollView>

                </SafeAreaView>
            ) :
                <NoInternetConnection noInternetConnection={noInternetConnection} checkyourconnection={checkyourconnectionthenrefreshthepage} checkConnection={checkConnection} refresh={refresh} />
            }
        </View>
    );
}


const styles = StyleSheet.create({

})

export default ForgotPasswordPage;