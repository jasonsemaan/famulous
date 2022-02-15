import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Alert } from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { globalStyles } from "../../../01-app/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { firebase } from '@react-native-firebase/auth';
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";


const LoginPage = ({ route, navigation }) => {
    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [confirmpasswordWarning, setConfirmpasswordWarning] = useState(false)
    let [emailWarning, setEmailWarning] = useState(false)
    let [isConnectedToInternet, setIsConnectedToInternet] = useState(true);


    // var toastStatusVal = route.params.statusToastValue


    //Labels
    let [login, setLogin] = useState("Log In");
    let [emailLabel, setEmailLabel] = useState("Email");
    let [passwordLabel, setPasswordLabel] = useState("Password");
    let [forgotPassword, setForgotPassword] = useState("Forgot password?");
    let [dont_have_an_account, setDontHaveAccount] = useState("Don't have an account?");
    let [register, setRegister] = useState("Register");
    let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
    let [refresh, setRefresh] = useState("Refresh");
    let [checkyourconnectionthenrefreshthepage, setCheckyourconnectionthenrefreshthepage] = useState("Check your connection, then refresh the page");
    let [warning, setWarning] = useState("Warning")


    /**
     *  Login Function, Sign in from Firebase
     */
    const loginFunction = () => {
        if (password === '') {
            setConfirmpasswordWarning(true)
        } else {
            setConfirmpasswordWarning(false)
        }

        if (email === '') {
            setEmailWarning(true)
        } else {
            setEmailWarning(false)
        }

        if (password != '' && email != '') {
            auth().signInWithEmailAndPassword(email, password).then(response => {
                if (response.user.emailVerified === true) {
                    navigation.replace('Root')
                    setConfirmpasswordWarning(false)
                    setEmailWarning(false)
                    AsyncStorage.setItem('appLanguage', 'en')
                    AsyncStorage.setItem('Language', 'English')
                } else {
                    Toast.show({
                        text1: 'Warning',
                        text2: 'Please verify your email',
                        visibilityTime: 10000,
                        type: 'info'
                    });
                }
            }).catch(e => {
                setEmailWarning(true)
                setConfirmpasswordWarning(true)
                Alert.alert(
                    warning,
                    "" + e,
                    [
                        { text: "OK", onPress: () => console.log("OK Pressed") }
                    ]
                );
            })
        }
    }

    /**
     *  get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setLogin(strings.login)
            setEmailLabel(strings.email)
            setPasswordLabel(strings.password)
            setForgotPassword(strings.forgotPassword)
            setDontHaveAccount(strings.dont_have_an_account)
            setRegister(strings.register)
            setNoInternetConnection(strings.noInternetConnection)
            setRefresh(strings.refresh)
            setCheckyourconnectionthenrefreshthepage(strings.checkyourconnectionthenrefreshthepage)
            setWarning(strings.warning)
        } catch (e) {
            console.log(e)
        }
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
        checkConnection()
        return () => {
        }
    }, [])



    return (
        <View style={globalStyles.container}>
            {isConnectedToInternet == true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={globalStyles.Login_image_div}>
                        <Image source={require('../../../assets/loginPageIcon.png')} style={globalStyles.image_LoginPage}></Image>
                        <Text style={globalStyles.main_Login_boldText}>{login}</Text>
                    </View>

                    <View style={globalStyles.Login_Midle_div}>
                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: 'grey', marginLeft: 25, fontSize: 12 }}>{emailLabel}</Text>
                            <View style={globalStyles.login_InputwithImage}>
                                <TextInput style={{ width: 250, alignSelf: 'center', minHeight: 35, marginLeft: 10, padding: 0, color: 'black' }} underlineColorAndroid="transparent" onChangeText={(text) => setEmail(text)} />
                                {emailWarning ?
                                    (
                                        <Image source={require('../../../assets/warning.png')} style={globalStyles.login_password_warningicon}></Image>) : null}
                            </View>

                            <View>
                                <Text style={globalStyles.CreateAcc_titleInput}>{passwordLabel}</Text>
                                <View style={globalStyles.login_InputwithImage}>
                                    <TextInput style={{ width: 250, alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black' }} secureTextEntry={true} underlineColorAndroid="transparent" onChangeText={(text) => setPassword(text)} />
                                    {confirmpasswordWarning ?
                                        (
                                            <Image source={require('../../../assets/warning.png')} style={globalStyles.login_password_warningicon}></Image>) : null}
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => navigation.replace('ForgotPasswordPage')}>
                                    <Text style={globalStyles.forgotPassword}>{forgotPassword}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{ left: 0, right: 0, bottom: 0, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 50 }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => loginFunction()}>
                                    {/* <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.replace('HomePage')}> */}

                                    <View style={globalStyles.Welc_Log_button}>
                                        <Text style={globalStyles.Wel_Log_buttonLabel}>{login}</Text>
                                    </View>
                                </TouchableOpacity>

                                <View style={globalStyles.main_rowdiv}>
                                    <Text style={globalStyles.main_Welcome_smallText}>{dont_have_an_account} </Text>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CreateAccountPage')}>
                                        <Text style={globalStyles.Welc_Log_redlabel}>{register}</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={globalStyles.main_rowdiv}>
                                    <Image source={require('../../../assets/facebook.png')} style={globalStyles.login_footer_logos}></Image>
                                    <Image source={require('../../../assets/google-plus.png')} style={globalStyles.login_footer_logos}></Image>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
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
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </View>


    );
}



const styles = StyleSheet.create({

})

export default LoginPage;