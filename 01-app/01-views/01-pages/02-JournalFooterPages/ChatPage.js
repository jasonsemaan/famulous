import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../../01-app/03-constants/global";

var jsonData = [
    { id: 1, name: "Me", admin: true },
    { id: 2, name: "Jane Doe", admin: false },
    { id: 3, name: "Jhon Doe", admin: false },
    { id: 5, name: "Max Doe", admin: false },
    { id: 6, name: "Dan Doe", admin: false },
]

const ChatPage = ({ route, navigation }) => {
    var adminName = route.params.adminName

    const _renderItem = ({ item }) => {

        return (
            <View >
                 <TouchableOpacity activeOpacity={0.8} style={globalStyles.chat_touchableStyle}>
                                    <Image style={{ width: 70, height: 70, borderRadius: 70 / 2 }} source={require('../../../../assets/beach.jpeg')}></Image>
                                    <Text style={globalStyles.chat_white_name}>{item.name}</Text>
                                </TouchableOpacity>
            </View>
        );
    };

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
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Chat</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', padding: 10,alignSelf:'center' }}>
                            <FlatList showsHorizontalScrollIndicator={false} data={jsonData} renderItem={_renderItem} horizontal={true} />
                        </View>

                    </View>

                    <View style={globalStyles.Chat_Overflow_Div}>

                            <View style={{ alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>

                                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 80, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>

                                    <TextInput
                                        style={globalStyles.chat_input}
                                        placeholderTextColor='#A5A5A5'
                                        placeholder='Text here...'
                                        underlineColorAndroid="transparent" />
                                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginLeft: 'auto', marginRight: 10 }}>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image source={require('../../../../assets/footer_tab_uploadimage_icon.png')} style={globalStyles.chatCamera_input_icon}></Image></TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image source={require('../../../../assets/footer_tab_linksharing_icon.png')} style={globalStyles.chatAttach_input_icon}></Image></TouchableOpacity>
                                    </View>


                                </View>
                            </View>

                            {/* <View style={globalStyles.chat_inputText}>
                                    <TextInput style={{ width: '70%' }}
                                    style={{color:'black'}}
                                    placeholderTextColor='grey'
                                    placeholder='Text here...' />
                                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginLeft: 'auto' }}>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image source={require('../../../../assets/footer_tab_uploadimage_icon.png')} style={globalStyles.chatCamera_input_icon}></Image></TouchableOpacity>
                                        <TouchableOpacity activeOpacity={0.8}>
                                            <Image source={require('../../../../assets/footer_tab_linksharing_icon.png')} style={globalStyles.chatAttach_input_icon}></Image></TouchableOpacity>
                                    </View>
                                </View> */}
                    </View>


                </ImageBackground>
            </View>



        </View>

    );
}




const styles = StyleSheet.create({

})

export default ChatPage;