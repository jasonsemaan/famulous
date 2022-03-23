import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { globalStyles } from "../../../03-constants/global";
import CountryPicker from 'react-native-country-picker-modal'
import { CountryCode, Country } from './src/types'
import { strings } from "../../../../App";

const ShippingAddressPage = ({ route, navigation }) => {
  var admin = route.params.admin
  let [inputs, setInputs] = useState([{ key: '', value: '' }])
  let [withFlag, setWithFlag] = useState(true)
  let [withCountryNameButton, setWithCountryNameButton] = useState(true)
  let [withFilter, setWithFilter] = useState(true)
  let [countryCode, setCountryCode] = useState('FR')
  let [country, setCountry] = useState(null)

  //Labels
  let [shippingAddress, setShippingAddress] = useState('Shipping Address')
  let [shippingInformation, setShippingInformation] = useState('Shipping Information')
  let [nameOnTheMailbox, setNameOnTheMailbox] = useState('Name on the mailbox')
  let [firstname, setFirstName] = useState('First Name')
  let [familyname, setFamilyName] = useState('Family Name')
  let [addressTitle, setAddressTitle] = useState('Address Title')
  let [street, setStreet] = useState('Street')
  let [number, setNumber] = useState('Number')
  let [additionnalInformation, setAdditionnalInformation] = useState('Additionnal Information')
  let [zipCode, setZipCode] = useState('Zip Code')
  let [city, setCity] = useState('City')
  let [save, setSave] = useState('Save')


  /** function to save the selected country */
  const onSelect = (country) => {
    setCountryCode(country.cca2)
    setCountry(country)
  }

  /** function to add a new shipping information view */
  const addHandler = () => {
    const _inputs = [...inputs];
    _inputs.push({ key: '', value: '' });
    setInputs(_inputs);
    scrollToEnd()
  }

  /** function to scroll automatically to the end of flatlist */
  const scrollToEnd = () => {
    this.scrollView.scrollToEnd({ animated: true });
  }

  /** function to remove a shipping address */
  const deleteHandler = (key) => {
    const _inputs = inputs.filter((input, index) => index != key);
    setInputs(_inputs);
  }


  /** get params from async storage */
  const getAsyncStorageData = async () => {
    try {
      strings.setLanguage(global.appLanguage)
      setShippingAddress(strings.shippingAddress)
      setShippingInformation(strings.shippingInformation)
      setNameOnTheMailbox(strings.nameOnTheMailbox)
      setFirstName(strings.firstname)
      setFamilyName(strings.familyName)
      setAddressTitle(strings.addressTitle)
      setStreet(strings.street)
      setNumber(strings.number)
      setAdditionnalInformation(strings.additionnalInformation)
      setZipCode(strings.zipCode)
      setCity(strings.city)
      setSave(strings.save)
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
                  <Text style={globalStyles.main_headerDiv_titlestyle}>{shippingAddress}</Text>
                </View>
                <View style={globalStyles.headerGlobalLeftRightView}></View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
      <View style={{ flex: 3.5 }}>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
          <Text style={{ alignSelf: 'center', marginLeft: 45, fontSize: 15, fontWeight: 'bold' }}>{shippingInformation}</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={addHandler}>
            <Image source={require('../../../assets/home_plus_icon.png')} style={globalStyles.ShippingAddress_header_Pluslogo}/>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={globalStyles.viewWidth100}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='always'
          ref={(view) => {
            this.scrollView = view;
          }}>
          <View style={globalStyles.ShippingAddress_AllinfoView}>
            <Text style={globalStyles.ShippingAddress_titleInput_header}>{nameOnTheMailbox}</Text>
            <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={firstname} placeholderTextColor="#A5A5A5" /></View>
            <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={familyname} placeholderTextColor="#A5A5A5" /></View>

            <Text style={globalStyles.ShippingAddress_titleInput}>{shippingAddress}</Text>
            <View style={globalStyles.shippingView_textinput}>
              <TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={addressTitle} placeholderTextColor="#A5A5A5" /></View>
            <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
              <View style={globalStyles.shippingView_textinput}>
                <TextInput style={globalStyles.ShippingAddress_inputText_street_3sur4} underlineColorAndroid="transparent" placeholder={street} placeholderTextColor="#A5A5A5" />
                {/* <Image source={require('../../../../assets/search_icon.png')} style={globalStyles.ShippingAddress_search_icon}/>*/}
              </View>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText_1sur4} underlineColorAndroid="transparent" placeholder={number} placeholderTextColor="#A5A5A5" keyboardType="numeric" /></View>
            </View>
            <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={additionnalInformation} placeholderTextColor="#A5A5A5" /></View>
            <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={zipCode} placeholderTextColor="#A5A5A5" keyboardType="numeric" /></View>
            <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={city} placeholderTextColor="#A5A5A5" /></View>
            <View style={globalStyles.InputwithImageFlag}>
              <CountryPicker
                {...{
                  countryCode,
                  withFilter,
                  withFlag,
                  withCountryNameButton,
                  onSelect
                }}
                containerButtonStyle={{ marginLeft: 10 }}
              />
            </View>

            <TouchableOpacity activeOpacity={0.8}>
              <Text style={globalStyles.shippingSaveLabel}>{save}</Text>
            </TouchableOpacity>


          </View>


          {inputs.map((input, key) => (

            <View style={globalStyles.ShippingAddress_AllinfoView}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => deleteHandler(key)}>
                <Image source={require('../../../assets/delete_close_icon.png')} style={globalStyles.ShippingAddress_delete_icon}/>
              </TouchableOpacity>
              <Text style={globalStyles.ShippingAddress_titleInput_header}>{nameOnTheMailbox}</Text>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={firstname} placeholderTextColor="#A5A5A5" /></View>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={familyname} placeholderTextColor="#A5A5A5" /></View>

              <Text style={globalStyles.ShippingAddress_titleInput}>{shippingAddress}</Text>
              <View style={globalStyles.shippingView_textinput}>
                <TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={addressTitle} placeholderTextColor="#A5A5A5" /></View>
              <View style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
                <View style={globalStyles.shippingView_textinput}>
                  <TextInput style={globalStyles.ShippingAddress_inputText_street_3sur4} underlineColorAndroid="transparent" placeholder={street} placeholderTextColor="#A5A5A5" />
                </View>
                <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText_1sur4} underlineColorAndroid="transparent" placeholder={number} placeholderTextColor="#A5A5A5" keyboardType="numeric" /></View>
              </View>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={additionnalInformation} placeholderTextColor="#A5A5A5" /></View>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={zipCode} placeholderTextColor="#A5A5A5" keyboardType="numeric" /></View>
              <View style={globalStyles.shippingView_textinput}><TextInput style={globalStyles.ShippingAddress_inputText} underlineColorAndroid="transparent" placeholder={city} placeholderTextColor="#A5A5A5" /></View>
              <View style={globalStyles.InputwithImageFlag}>
                <CountryPicker
                  {...{
                    countryCode,
                    withFilter,
                    withFlag,
                    withCountryNameButton,
                    onSelect
                  }}
                  containerButtonStyle={{ marginLeft: 10 }}
                />
              </View>
              <TouchableOpacity activeOpacity={0.8}>
                <Text style={globalStyles.shippingSaveLabel}>{save}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: "lightgray"
  }
})

export default ShippingAddressPage;