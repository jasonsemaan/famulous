import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";

const SettingsPage = ({ route, navigation }) => {
    var admin = route.params.admin
    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={globalStyles.viewFlex1}>
                <ImageBackground style={globalStyles.settingsPage_Img_background} source={require('../../../assets/journal_background_header.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={globalStyles.subHeaderViewbackgroundYellow}>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings', { adminName: admin })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={globalStyles.headerGlobalMiddleView}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Notifications</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}></View>
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
            <View style={{ flex: 3.5 }}>

            </View>
        </View>

    );
}


const styles = StyleSheet.create({

})

export default SettingsPage;