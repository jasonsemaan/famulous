import React, { useState, useEffect } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../01-app/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";

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
    /**
     * get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
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
                setIsConnectedToInternet(false)
                getAsyncStorageData()
            }
        })
    }

    /**
      *  function to check if internet connection is enable or not
      */
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
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ height: '10%' }}>
                            <TouchableOpacity onPress={() => navigation.navigate("WelcomePage")}>
                                <Image source={require('../../../assets/left-arrow.png')} style={{ width: 30, height: 30, marginTop: 20 }}></Image>
                            </TouchableOpacity>
                        </View>

                        <View style={{ height: '90%', alignItems: 'center' }}>
                            <Image source={require('../../../assets/resetPassword.png')} style={globalStyles.image_ResetPassword}></Image>

                            <Text style={{ marginTop: 100, fontWeight: 'bold', fontSize: 18 }}>{resetPassword}</Text>
                            <Text style={{ color: 'grey', marginTop: 5, fontSize: 11 }}>{enterAnEmailAddressYouUsetoSignIn}</Text>
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <View style={{ marginTop: 'auto' }}>
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
                <SafeAreaView style={{ flex: 1, backgroundColor: 'white', width: '100%' }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' }}>
                        <Image source={require('../../../assets/no-internet.png')} style={{ width: 60, height: 60, marginBottom: 30 }}></Image>
                        <Text style={{ marginBottom: 10, fontSize: 16, fontWeight: 'bold',color: 'black' }}>{noInternetConnection}</Text>
                        <Text style={{ color: 'grey' }}>{checkyourconnectionthenrefreshthepage}</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection()}>
                            <View style={globalStyles.resetPassword_button}>
                                <Text style={globalStyles.Wel_Log_buttonLabel}>{refresh}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            }

        </View>
    );
}


const styles = StyleSheet.create({

})

export default ForgotPasswordPage;