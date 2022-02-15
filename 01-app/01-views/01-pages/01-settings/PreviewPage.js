import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../../01-app/03-constants/global";



const PreviewPage = ({ route, navigation }) => {
    var admin = route.params.admin
  
    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <ImageBackground style={globalStyles.settingsPage_Img_background} source={require('../../../../assets/journal_background_header.png')} >
                    <View style={{ flex: 1, alignItems: 'center' }}>

                        <View style={globalStyles.main_headerDiv_backandtitle}>
                            <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                    <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings', { adminName: admin })}>
                                        <View style={{ padding: 8 }}>
                                            <Image style={globalStyles.header_globalbackicon} source={require('../../../../assets/back-icon.png')} />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={globalStyles.main_headerDiv_titlestyle}>Preview</Text>
                                </View>
                                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                            </View>


                        </View>

                    </View>
                </ImageBackground>
            </View>

            <View style={{ flex: 3.5, backgroundColor: '#F5F5F5' }}>
                <SafeAreaView style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={globalStyles.Preview_div_rect}>
                        <Image style={{width:'100%',height:'100%',resizeMode:'stretch'}} source={require('../../../../assets/preview_background.png')} />
                        </View>

                             <View style={globalStyles.Preview_div_rect}>
                             </View>
                       

                    </ScrollView>
                </SafeAreaView>

            </View>

        </View>

    );
}




const styles = StyleSheet.create({

})

export default PreviewPage;