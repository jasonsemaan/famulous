import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, Modal, Alert } from "react-native";
import { ScrollView, TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { globalStyles } from "../../../Activities/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { firebase } from '@react-native-firebase/auth';
import NetInfo from "@react-native-community/netinfo";
import { strings } from "../../../App";
import { NoInternetConnection } from "../02-components/ConnectionComponent";
import { JournalContext } from "../04-context/Context";

const LoginPage = ({ route, navigation }) => {

    const myContext = useContext(JournalContext);

    let [email, setEmail] = useState('')
    let [password, setPassword] = useState('')
    let [confirmpasswordWarning, setConfirmpasswordWarning] = useState(false)
    let [emailWarning, setEmailWarning] = useState(false)
    let [isConnectedToInternet, setIsConnectedToInternet] = useState(true);

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


    /**  Login Function, Sign in from Firebase */
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
                    AsyncStorage.setItem('appLanguage', 'en')
                    myContext.setAppLanguage('en')
                    setConfirmpasswordWarning(false)
                    setEmailWarning(false)
                    navigation.replace('Root')
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

    /** get params from async storage */
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
        checkConnection()
        return () => {
        }
    }, [])


    return (
        <SafeAreaView style={globalStyles.container}>
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
            {isConnectedToInternet == true ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                    <View style={globalStyles.Login_image_div}>
                        <Image source={require('../../assets/loginPageIcon.png')} style={globalStyles.image_LoginPage}/>
                        <Text style={globalStyles.main_Login_boldText}>{login}</Text>
                    </View>

                    <View style={globalStyles.Login_Midle_div}>
                        <View style={{ width: '100%', marginTop: 20 }}>
                            <Text style={{ color: 'grey', marginLeft: 25, fontSize: 12 }}>{emailLabel}</Text>
                            <View style={globalStyles.login_InputwithImage}>
                                <TextInput style={globalStyles.textInputWithIcon}underlineColorAndroid="transparent" onChangeText={(text) => setEmail(text)} />
                                {emailWarning ?
                                    (
                                        <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon}/>) : null}
                            </View>

                            <View>
                                <Text style={globalStyles.CreateAcc_titleInput}>{passwordLabel}</Text>
                                <View style={globalStyles.login_InputwithImage}>
                                    <TextInput style={globalStyles.textInputWithIcon} secureTextEntry={true} underlineColorAndroid="transparent" onChangeText={(text) => setPassword(text)} />
                                    {confirmpasswordWarning ?
                                        (
                                            <Image source={require('../../assets/warning.png')} style={globalStyles.login_password_warningicon}/>) : null}
                                </View>
                            </View>
                            <View>
                                <TouchableOpacity onPress={() => navigation.replace('ForgotPasswordPage')}>
                                    <Text style={globalStyles.forgotPassword}>{forgotPassword}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={globalStyles.viewLoginButton}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => loginFunction()}>
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
                                    <Image source={require('../../assets/facebook.png')} style={{width: 40,height: 40,resizeMode: 'contain',margin: 5}}/>
                                    <Image source={require('../../assets/google-plus.png')} style={globalStyles.login_footer_logos}/>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            ) :
                <NoInternetConnection noInternetConnection={noInternetConnection} checkyourconnection={checkyourconnectionthenrefreshthepage} checkConnection={checkConnection} refresh={refresh} />

            }
            <Toast ref={(ref) => Toast.setRef(ref)} />
        </SafeAreaView>


    );
}



const styles = StyleSheet.create({

})

export default LoginPage;