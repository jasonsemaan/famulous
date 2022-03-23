import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Switch } from "react-native";
import { globalStyles } from "../03-constants/global";
import auth, { firebase } from '@react-native-firebase/auth';
import { ScrollView } from "react-native-gesture-handler";
import FastImage from 'react-native-fast-image'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../App";
import { constants } from "../03-constants/Constants";
import { useIsFocused } from '@react-navigation/native';

const DrawerNav = ({ navigation }) => {
    const [scrollStatus, setScrollStatus] = useState(0)
    const [userUid, setUserUid] = useState("")
    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState();

    //Labels
    let [myProfile, setMyProfile] = useState("My Profile");
    let [myJournals, setMyJournals] = useState("My Journals");
    let [join_a_Journal, setJoinaJournal] = useState("Join a journal");
    let [subscription, setSubscription] = useState("Subscription");
    let [howitworks, setHowitWorks] = useState("How it works");
    let [support, setSupport] = useState("Support");
    let [signOut, setSignOut] = useState("Sign Out");
    let [areyousure, setAreyousure] = useState("Are you suree?");
    let [cancel, setCancel] = useState("Cancel");

    const top_arrow = require('../assets/top-arrow.png')
    const end_arrow = require('../assets/down-arrow.png')
    let arrow = scrollStatus == 0 ? end_arrow : top_arrow

    const toggleSwitch = () => {
    if(isEnabled == false){
        //English
         setIsEnabled(true)
         AsyncStorage.setItem('appLanguage', 'en')
         global.appLanguage="en"
    }else{
        //France
        setIsEnabled(false)
         AsyncStorage.setItem('appLanguage', 'fr')
         global.appLanguage="fr"
    }
    getAsyncStorageData()
    }


    const navigateTo = (namePage) => {
        navigation.navigate(namePage);
        navigation.closeDrawer();
    }

    const alertLogout = () => {
        Alert.alert(
            '',
            areyousure,
            [
                {
                    text: cancel,
                    onPress: () => console.log('Canceled'),
                    style: 'cancel'
                },
                {
                    text: signOut,
                     onPress: () => SignOutFunction()
                },
            ]
        )
    }


    /** get the tokenID */
    const getTokenId = () => {
        auth().onAuthStateChanged(function (user) {
            if(!user){
                return;
            }
            user.getIdToken().then(function (idToken) {
                getAsyncStorageData()
                getUserProfile(idToken)
            });
        });
    }

    /** call backend api to get the user signed profile  */
    const getUserProfile = (idToken) => {
        fetch(constants.apiIP + "userProfile/getUserProfile", {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                "Authorization": "Bearer " + idToken
            },
        })
            .then((response) => response.json())
            .then((responseJson) => setUserUid(responseJson.userUid))
    };

    const scroll = () => {
        if (scrollStatus === 0) {
            setScrollStatus(1)
            this.scrollView.scrollToEnd({ animated: true });
        } else if (scrollStatus === 1) {
            setScrollStatus(0)
            this.scrollView.scrollTo({ animated: true }, 0);
        }
    }

    let SignOutFunction = () => {
        firebase.auth().signOut();
        navigation.navigate('WelcomePage');
        
    }

    const getAsyncStorageData = async () => {
        try {
            if(await AsyncStorage.getItem('appLanguage')== "en"){
                setIsEnabled(true)
            }else{
                setIsEnabled(false)
            }
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setMyProfile(strings.myProfile)
            setMyJournals(strings.myJournals)
            setJoinaJournal(strings.join_a_Journal)
            setSubscription(strings.subscription)
            setHowitWorks(strings.howitworks)
            setSupport(strings.support)
            setSignOut(strings.signOut)
            setAreyousure(strings.areyousure)
            setCancel(strings.cancel)
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        getTokenId();
        return () => {
        }
    }, [isFocused])


    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={globalStyles.side_menu_style}>
                <View style={globalStyles.menuModal_style}>
                    <View style={{ margin: 30, width: '100%', flexDirection: 'row' }}>
                        <View style={{ alignItems: 'center', width: '15%' }}>
                        </View>
                        <View style={{ alignItems: 'center', width: '70%' }}>
                            <Image source={require('../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo_Drawer}/>
                        </View>
                        <View style={{ width: '15%', justifyContent: 'center', marginLeft: 10 }}>

                        </View>
                    </View>
                    {userUid != "" ? (
                        <FastImage
                            style={globalStyles.side_menu_circleImage}
                            source={{
                                uri: constants.apiIP + "download/byuser/bypath?path=" + userUid + "/profile.jpg",
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                        />
                    ) : <Image source={require('../assets/user.png')} style={globalStyles.home_famulous_logo_Drawer_byDefault}/>

                    }
                    <ScrollView style={{ flex: 1, width: '100%', marginBottom: 30, marginTop: 20 }} showsVerticalScrollIndicator={false}
                        ref={(view) => {
                            this.scrollView = view;
                        }}
                        onScrollEndDrag={() => scroll()}
                    >
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('MyProfilePage')}>
                            <View style={globalStyles.viewWidth100}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_myprofile_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{myProfile}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('Root')}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_myJournals_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{myJournals}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('JoinJournalsPage')}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_joinJournal_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{join_a_Journal}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('SubscriptionPage')}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_subscription_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{subscription}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('HowItWorksPage')}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_howitworks_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{howitworks}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigateTo('SupportPage')}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_support_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{support}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/france.png')} style={globalStyles.Drawer_icons}/>
                                    <Switch
                                        trackColor={{ false: "#E5E5E5", true: "#E5E5E5" }}
                                        thumbColor={isEnabled ? "#3ddc84" : "#3ddc84"}
                                        ios_backgroundColor="#E5E5E5"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                        style={{marginLeft:15,marginRight:15}}
                                    />
                                    <Image source={require('../assets/united-kingdom.png')} style={globalStyles.Drawer_icons}/>
                                </View>
                            </View>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => alertLogout()}>
                            <View style={globalStyles.drawer_row_div}>
                                <View style={globalStyles.drawer_row_item}>
                                    <Image source={require('../assets/drawer_signout_icon.png')} style={globalStyles.Drawer_icons}/>
                                    <Text style={globalStyles.drawer_titles}>{signOut}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>

                    <View style={globalStyles.side_menu_footer}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => scroll()} style={globalStyles.viewWidth100}>
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', height: 50 }}>
                                <Image style={globalStyles.side_menu_arrow} source={arrow} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

})

export default DrawerNav;