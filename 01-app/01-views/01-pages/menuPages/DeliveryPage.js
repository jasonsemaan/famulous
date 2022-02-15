import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RadioForm from "react-native-simple-radio-button";
import { globalStyles } from "../../../03-constants/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../../App";

const DeliveryPage = ({ navigation }) => {

    //Labels
    let [delivery, setDelivery] = useState("Delivery");
    let [please_fill_in, setPleaseFillIn] = useState("Please fill in the recipient's details");
    let [you_can_skip, setYouCanSkip] = useState("You can skip for later");
    let [complete_shipping_later, setCompleteShippingLater] = useState("Complete shipping adress later");
    let [complete_shipping_now, setCompleteShippingNow] = useState("Complete shipping adress now");
    let [continuee, setContinuee] = useState("Continue");

    const radioData = [{ label: 'Complete shipping adress later', value: 0 }, { label: 'Complete shipping adress now', value: 1 }]


    /**
     *  get params from async storage
     */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
            setDelivery(strings.delivery)
            setPleaseFillIn(strings.please_fill_in)
            setYouCanSkip(strings.you_can_skip_for_later)
            setCompleteShippingLater(strings.complete_shipping_later)
            setCompleteShippingNow(strings.complete_shipping_now)
            setContinuee(strings.continue)
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getAsyncStorageData();
        return () => {
        }
    }, [])


    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={{ flex: 1, backgroundColor: '#febf2e' }}>
                <View style={{ height: '15%', alignItems: 'center' }}>

                    <View style={globalStyles.main_headerDiv_backandtitle}>
                        <View style={{ width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' }}>
                            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SubscriptionPage')}>
                                    <View style={{ padding: 10 }}>
                                        <Image style={globalStyles.header_globalbackicon} source={require('../../../../assets/back-icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '70%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={globalStyles.main_headerDiv_titlestyle}>{delivery}</Text>
                            </View>
                            <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
                        </View>


                    </View>

                </View>
                <View style={globalStyles.menuDrawer_Overflow_Div}>

                    <View style={{ marginTop: 30, alignItems: 'center', borderBottomColor: '#5ec6ca', borderBottomWidth: 1, marginRight: 20, marginLeft: 20, padding: 20 }}>
                        <Text style={{ color: '#9b56a2', textAlign: 'center', fontSize: 14 }}>
                            {please_fill_in}
                        </Text>
                        <Text style={{ color: 'grey', marginTop: 20, fontSize: 10 }}>{you_can_skip}</Text>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20, height: 100 }}>
                        <RadioForm
                            radio_props={radioData}
                            buttonColor={'grey'}
                            buttonSize={10}
                            selectedButtonColor={'grey'}
                            labelStyle={{ fontSize: 12 }}
                            onPress={(value) => console.log(value)} />
                    </View>

                    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('PaymentPage')}>
                            <View style={globalStyles.drawerMenu_button}>
                                <Text style={globalStyles.Wel_Log_buttonLabel}>{continuee}</Text>
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

export default DeliveryPage;