import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../Activities/03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../App";

const WelcomePage = ({ navigation }) => {
    const [authenticated, setAuthenticated] = useState(false)
    let [splashVisible, setSplashVisible] = useState(true);


    //Labels
    let [lets_get_started, setLetsGetStarted] = useState("Let's get started");
    let [createAccount, setCreateAccount] = useState("Create Account");
    let [have_an_account, setHaveAnAccount] = useState("Have an account?");
    let [login, setLogin] = useState("Login");
    let [welcomeToFamulous, setWelcomeToFamulous] = useState("Welcome to Famulous");

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setLetsGetStarted(strings.lets_get_started)
            setCreateAccount(strings.createAccount)
            setHaveAnAccount(strings.have_an_account)
            setLogin(strings.login)
            setWelcomeToFamulous(strings.welcomeToFamulous)
        } catch (e) {
            console.log(e)
        }
    }

    /** function to check if user is logged in or not (using firebase) */
    const checkUserifLoggedIn = () => {
        let currentUser = firebase.auth().currentUser;
        if (currentUser != null) {
            if (currentUser.emailVerified === true) {
                setAuthenticated(true)
                navigation.replace('Root')
            } else {
                setAuthenticated(false)
            }
        }
    }

    const Hide_Splash_Screen = () => {
        setSplashVisible(false)
        checkUserifLoggedIn()
    }

    const Splash_Screen = () => {
        return (
            <View style={globalStyles.main_Container}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo_Drawer} />
                </View>
            </View>
        )
    }


    useEffect(() => {
        setTimeout(() => {
            Hide_Splash_Screen();
        }, 3000);
        getAsyncStorageData()

        return () => {
        }
    }, [])


    return (
        <View style={globalStyles.safeAreaContainer}>
            {splashVisible === false ? (
                    <View style={globalStyles.container}>
                        <View style={globalStyles.Welc_image_div}>
                            <Image source={require('../../assets/welcomePageIcon.png')} style={globalStyles.image_WelcomePage} />
                        </View>
                        <View style={globalStyles.Welc_Midle_div}>
                            <Text style={globalStyles.main_boldText}>{lets_get_started} {'\n'}</Text>
                            <Text style={globalStyles.main_Welcome_smallText}>{welcomeToFamulous}</Text>
                        </View>
                        <View style={globalStyles.Welc_Log_footer_div}>

                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('CreateAccountPage')}>
                                <View style={globalStyles.Welc_Log_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{createAccount}</Text>
                                </View>
                            </TouchableOpacity>
                            <View style={globalStyles.main_rowdiv}>
                                <Text style={globalStyles.main_Welcome_smallText}>{have_an_account} </Text>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('LoginPage')}>
                                    <Text style={globalStyles.Welc_Log_redlabel}>{login}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                   
                          ): <Splash_Screen/>
                        }
                         </View>
            );
}


            const styles = StyleSheet.create({

            })

            export default WelcomePage;