import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { CheckBox, Input } from "react-native-elements";
import { globalStyles } from "../../../03-constants/global";
import CountryPicker from 'react-native-country-picker-modal'
import { strings } from "../../../../App";

const PaymentPage = ({ navigation }) => {
    
    //Labels
    let [payment, setPayment] = useState("Payment");
    let [monthlyBundle, setMonthlyBundle] = useState("Monthly bundle 1");
    let [discount, setDiscount] = useState("Discount");
    let [total, setTotal] = useState("Total");
    let [add_a_promo, setAddPromo] = useState("Add a promo code");
    let [paymentMethod, setPaymentMethod] = useState("Payment Method");
    let [name_on_the_card, setNameOnTheCard] = useState("Name on the card");
    let [zipCode, setZipCode] = useState("Zip Code");
    let [billingAddress, setBillingAddress] = useState("Billing address");
    let [street, setStreet] = useState("Street");
    let [city, setCity] = useState("City");
    let [number, setNumber] = useState("Number");
    let [i_agree_to_the, setIAgreeToThe] = useState("I agree to the");
    let [terms_and_Conditions, setTermsAndConditions] = useState("Terms & Conditions");
    let [and, setAnd] = useState("and");
    let [privacy, setPrivacy] = useState("Privacy");
    let [policy, setPolicy] = useState("Policy");
    let [confirm, setConfirm] = useState("Confirm");

    let [CheckBoxStatus, setCheckBoxStatus] = useState(false)
    let [withFlag, setWithFlag] = useState(true)
    let [withCountryNameButton, setWithCountryNameButton] = useState(true)
    let [withFilter, setWithFilter] = useState(true)
    let [countryCode, setCountryCode] = useState('FR')
    let [country, setCountry] = useState(null)
  

    // function to save the selected country
    const onSelect = (country) => {
      setCountryCode(country.cca2)
      setCountry(country)
    }

    /** get params from async storage */ 
     const getAsyncStorageData = () => {
        try {
            strings.setLanguage(global.appLanguage)
            setPayment(strings.payment)
            setMonthlyBundle(strings.monthlybundle)
            setDiscount(strings.discount)
            setTotal(strings.total)
            setAddPromo(strings.addPromoCode)
            setPaymentMethod(strings.paymentMethod)
            setNameOnTheCard(strings.name_on_the_card)
            setZipCode(strings.zipCode)
            setBillingAddress(strings.billingAddress)
            setStreet(strings.street)
            setCity(strings.city)
            setNumber(strings.number)
            setIAgreeToThe(strings.i_agree_to_the)
            setTermsAndConditions(strings.terms_and_Conditions)
            setAnd(strings.and)
            setPrivacy(strings.privacy)
            setPolicy(strings.policy)
            setConfirm(strings.confirm)
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
            <View style={globalStyles.mainFlexbackgroundYellow}>
                <View style={globalStyles.viewHeight15AlignCenter}>
                    <View style={globalStyles.main_headerDiv_backandtitle}>
                        <View style={globalStyles.subHeaderViewbackgroundYellow}>
                            <View style={globalStyles.headerGlobalLeftRightView}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('DeliveryPage')}>
                                    <View style={{ padding: 10 }}>
                                        <Image style={globalStyles.header_globalbackicon} source={require('../../../assets/back-icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={globalStyles.headerGlobalMiddleView}>
                                <Text style={globalStyles.main_headerDiv_titlestyle}>{payment}</Text>
                            </View>
                            <View style={globalStyles.headerGlobalLeftRightView}></View>
                        </View>
                    </View>
                </View>
                <View style={globalStyles.menuDrawer_Overflow_Div}>
                    <ScrollView style={{ width: '100%',marginTop:10 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='always'>
                        <View style={{ flex: 1, alignItems: 'center'}}>
                            <View style={{ width: '100%', marginTop: 30 }}>
                                <View style={globalStyles.payment_singleGreenDiv}>
                                    <Text style={{ marginLeft: 10, color: 'grey' }}>{monthlyBundle}</Text>
                                    <Text style={{ marginLeft: 'auto' }}>$14.99</Text>
                                </View>
                                <View style={globalStyles.payment_singleGreenDiv}>
                                    <Text style={{ marginLeft: 10, color: 'grey' }}>{discount}</Text>
                                    <Text style={{ marginLeft: 'auto' }}>$0.0</Text>
                                </View>
                                <View style={globalStyles.payment_singleGreenDiv_total}>
                                    <Text style={{ marginLeft: 10, color: 'white' }}>{total}</Text>
                                    <Text style={{ marginLeft: 'auto', color: 'white' }}>$14.99</Text>
                                </View>
                            </View>

                            <Text style={{ color: '#9b56a2', textAlign: 'center', marginTop: 15 }}>{add_a_promo}</Text>
                            
                            <View style={{ width: '100%', marginTop: 30 }}>
                                <View style={globalStyles.payment_singleGreenDiv}>
                                    <Text style={{ marginLeft: 10, color: 'grey' }}>{paymentMethod}</Text>
                                </View>
                                <View style={globalStyles.payment_singleGreenDiv_column}>
                                    <View style={globalStyles.payment_Input}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={name_on_the_card} placeholderTextColor="#A5A5A5" /></View>
                                    <View style={globalStyles.payment_Input}>
                                        <TextInput style={{ alignSelf: 'center', width: 200, height: 35,padding:0,marginLeft:10, color:'black' }} underlineColorAndroid="transparent" placeholder="1234 5678 1234 5678" placeholderTextColor="#A5A5A5" keyboardType="numeric" />
                                        <Image source={require('../../../assets/creditcard.png')} style={globalStyles.payment_creditcard_image}/>
                                    </View>
                                    <View style={globalStyles.payment_Input}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={zipCode} placeholderTextColor="#A5A5A5" keyboardType="numeric" /></View>
                                </View>
                            </View>
                            <View style={{ width: '100%', marginTop: 30 }}>
                                <View style={globalStyles.payment_singleGreenDiv}>
                                    <Text style={{ marginLeft: 10, color: 'grey' }}>{billingAddress}</Text>
                                </View>
                                <View style={globalStyles.payment_singleGreenDiv_column}>
                                    <View style={{ flexDirection: 'row',height:35,padding:0 }}>
                                    <View style={globalStyles.payment_Input3sur4}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={street} placeholderTextColor="#A5A5A5" /></View>
                                        <View style={globalStyles.payment_Input1sur4}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={number} placeholderTextColor="#A5A5A5" /></View>
                                    </View>
                                    <View style={{ flexDirection: 'row',height:35,padding:0,marginTop:10 }}>
                                    <View style={globalStyles.payment_Input3sur4}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={city} placeholderTextColor="#A5A5A5" /></View>
                                        <View style={globalStyles.payment_Input1sur4}>
                                        <TextInput style={globalStyles.payment_textInput} underlineColorAndroid="transparent" placeholder={zipCode} placeholderTextColor="#A5A5A5" /></View>
                                    </View>
                                    <View style={globalStyles.InputwithImageFlag}>
                                        <CountryPicker
                                            {...{
                                                countryCode,
                                                withFilter,
                                                withFlag,
                                                withCountryNameButton,
                                                onSelect
                                            }}
                                            containerButtonStyle={{marginLeft:10}}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }}>
                                <CheckBox
                                    onPress={() => { setCheckBoxStatus(!CheckBoxStatus) }}
                                    checked={CheckBoxStatus} />

                                <View style={{marginRight:10}}> 
                                    <View style={globalStyles.flexRow}>
                                        <Text style={{ color: 'grey', fontSize: 12 }}>{i_agree_to_the}</Text>
                                        <Text style={{ textDecorationLine: 'underline', fontSize: 12 }}> {terms_and_Conditions}</Text>
                                        <Text style={{ color: 'grey', fontSize: 12 }}> {and}</Text>
                                        <Text style={{ textDecorationLine: 'underline', fontSize: 12 }}> {privacy}</Text>
                                    </View>

                                    <View>
                                        <Text style={{ textDecorationLine: 'underline', fontSize: 12 }}> {policy}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30, marginBottom: 40 }}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SubscriptionPage')}>
                                    <View style={globalStyles.drawerMenu_button}>
                                        <Text style={globalStyles.Wel_Log_buttonLabel}>{confirm}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({

})

export default PaymentPage;