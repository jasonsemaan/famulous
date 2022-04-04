import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";

const UploadImagesPage = ({ route, navigation }) => {
    let [value, setValue] = useState('');
    let [landscapeStatus, setLandscapeStatus] = useState(false)
    let [portraitStatus, setPortraitStatus] = useState(false)
    let [smallStatus, setSmallStatus] = useState(false)

    const toggleLandscape = () => {
        setLandscapeStatus(!landscapeStatus)
        setPortraitStatus(false)
        setSmallStatus(false)
    }
    const togglePortrait = () => {
        setPortraitStatus(!portraitStatus)
        setLandscapeStatus(false)
        setSmallStatus(false)
    }
    const toggleSmall = () => {
        setSmallStatus(!smallStatus)
        setLandscapeStatus(false)
        setPortraitStatus(false)
    }

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
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Upload Images</Text>
                                </View>
                                <View style={globalStyles.headerGlobalLeftRightView}></View>
                            </View>
                        </View>
                    </View>
                    <View style={globalStyles.UploadImage_LinkSharing_Overflow_Div}>
                        <View style={{ justifyContent: 'flex-start', flex: 1 }}>
                            <ImageBackground style={globalStyles.uploadImages_imageUploaded} source={require('../../../assets/beach.jpeg')} imageStyle={{ borderRadius: 40 }}>
                                <TouchableOpacity activeOpacity={0.8}>
                                    <Image style={{ width: 45, height: 45, marginRight: 20, marginBottom: 20 }} source={require('../../../assets/uploadImage_editImage_icon.png')} /></TouchableOpacity>
                            </ImageBackground>

                            <View style={{ flex: 1, borderBottomWidth: 1, marginRight: 20, marginLeft: 20 }}>
                                <Text style={{ color: 'grey', fontSize: 14, marginLeft: 10, marginTop: 10 }}>Click to add description</Text>
                                <View style={{ flexDirection: 'row', marginTop: 'auto', marginBottom: 5 }}>
                                    <View style={globalStyles.viewFlex1}>
                                        <TextInput
                                            style={globalStyles.marginTopAuto}
                                            multiline={true}
                                            maxLength={150}
                                            onChangeText={(val) => setValue(val)}
                                        /></View>
                                    <Text style={{ color: '#5ec6ca', fontSize: 14, marginTop: 'auto' }}>{value.length}/150</Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, padding: 10 }}>
                                <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center', marginLeft: 30 }}>
                                    <Text style={{ color: 'grey', fontSize: 12 }}>Added by</Text>
                                    <Text style={{ marginLeft: 5, color: 'black', fontSize: 13 }}>Cynthia</Text>
                                </View>
                                <Text style={{ color: 'grey', fontSize: 14, marginLeft: 30, marginTop: 10 }}>Select image size</Text>
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                        <TouchableOpacity activeOpacity={0.8} onPress={() => toggleLandscape()}>
                                            <View style={landscapeStatus ? globalStyles.landscape_yellowBorder : globalStyles.landscape_greyBorder}>
                                                <View style={globalStyles.landscape_fill_div}></View>
                                                <Text style={globalStyles.imageSize_label}>Landscape</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity activeOpacity={0.8} onPress={() => togglePortrait()}>
                                            <View style={portraitStatus ? globalStyles.portrait_yellowBorder : globalStyles.portrait_greyBorder}>
                                                <View style={globalStyles.portrait_fill_div}></View>
                                                <Text style={globalStyles.imageSize_label}>Portrait</Text>
                                            </View>
                                        </TouchableOpacity>

                                        <TouchableOpacity activeOpacity={0.8} onPress={() => toggleSmall()}>
                                            <View style={smallStatus ? globalStyles.small_yellowBorder : globalStyles.small_greyBorder}>
                                                <View style={globalStyles.small_fill_div}></View>
                                                <Text style={globalStyles.imageSize_label}>Small</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>
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

export default UploadImagesPage;