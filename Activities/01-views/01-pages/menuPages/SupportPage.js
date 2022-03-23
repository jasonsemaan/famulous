import React, { useEffect, useState,useRef } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import { globalStyles } from "../../../03-constants/global";

const SupportPage = ({ navigation }) => {

    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={globalStyles.mainFlexbackgroundYellow}>
                <View style={{ height:'15%', alignItems: 'center' }}>

                    <View style={globalStyles.main_headerDiv_backandtitle}>
                        <View style={globalStyles.subHeaderViewbackgroundYellow}>
                            <View style={globalStyles.headerGlobalLeftRightView}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                    <View style={{ padding: 10 }}>
                                          <Image style={globalStyles.backArrow} source={require('../../../assets/back-icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={globalStyles.headerGlobalMiddleView}>
                                <Text style={globalStyles.main_headerDiv_titlestyle}>Support</Text>
                            </View>
                            <View style={globalStyles.headerGlobalLeftRightView}></View>
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