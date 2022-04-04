import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";

const LinksSharingPage = ({ route, navigation }) => {
    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={globalStyles.viewFlex1}>
                <ImageBackground style={globalStyles.bottomNav_Img_background} source={require('../../../assets/purpuleImageBackground.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={globalStyles.subHeaderViewbackgroundYellow}>
                                <View style={globalStyles.headerGlobalLeftRightView}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails')}>
                                    <View style={{ padding: 8 }}>
                                        <Image style={globalStyles.header_globalbackicon} source={require('../../../assets/back-icon.png')} />
                                        </View>
                                        </TouchableOpacity>
                                </View>
                                <View style={globalStyles.headerGlobalMiddleView}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Links Sharing</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}></View>
                            </View>
                        </View>
                    </View>
                    <View style={globalStyles.UploadImage_LinkSharing_Overflow_Div}>
                        <View style={{ alignItems: 'center', justifyContent: 'flex-end', flex: 3 }}>
                            <View style={{flex:1,width:'100%', position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, justifyContent: 'center', alignItems: 'center' }}>
                                    <TextInput
                                        style={globalStyles.linksharing_input}
                                        placeholderTextColor='#A5A5A5'
                                        placeholder='Paste URL here'
                                        underlineColorAndroid="transparent" />
                            </View>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

})

export default LinksSharingPage;