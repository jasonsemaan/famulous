import React, { useEffect, useState,useRef } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import PhoneInput, { isValidNumber } from "react-native-phone-number-input";
import auth, { firebase } from '@react-native-firebase/auth';
import { globalStyles } from "../../../03-constants/global";
import { validate } from "jest-validate";



const SupportPage = ({ navigation }) => {

    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={{ flex: 1, backgroundColor: '#febf2e' }}>
                <View style={{ height:'15%', alignItems: 'center' }}>

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
                                <Text style={globalStyles.main_headerDiv_titlestyle}>Support</Text>
                            </View>
                            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                        </View>
                    </View>
                </View>


                <View style={globalStyles.menuDrawer_Overflow_Div}>
    
                </View>


            </View>

        </View>

    );
}




const styles = StyleSheet.create({

})

export default SupportPage;