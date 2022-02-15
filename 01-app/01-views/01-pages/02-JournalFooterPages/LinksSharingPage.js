import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput } from "react-native";
import { globalStyles } from "../../../../01-app/03-constants/global";



const LinksSharingPage = ({ route, navigation }) => {
    var adminName = route.params.adminName
    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={{ flex: 1 }}>
                <ImageBackground style={globalStyles.bottomNav_Img_background} source={require('../../../../assets/purpuleImageBackground.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalDetails', { admin: adminName })}>
                                    <View style={{ padding: 8 }}>
                                        <Image style={globalStyles.header_globalbackicon} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                        </TouchableOpacity>
                                </View>
                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Links Sharing</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
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
                            {/* <View style={globalStyles.LinksSharing_inputText}>
                                <TextInput 
                                    style={{color:'black'}}
                                    placeholderTextColor='grey'
                                    placeholder='Paste URL here'
                                    underlineColorAndroid="transparent" />

                            </View> */}
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