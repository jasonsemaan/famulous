import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { globalStyles } from "../../../../01-app/03-constants/global";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../../App";



const JournalSettings = ({ route, navigation }) => {
  var adminName = route.params.adminName

  //Labels
  let [contributor, setContributor] = useState("Contributors");
  let [settings, setSettings] = useState("Settings");
  let [preview, setPreview] = useState("Preview");
  let [journalSettings, setJournalSettings] = useState("Journal Settings");


  /**
   *  get params from async storage
   */
  const getAsyncStorageData = async () => {
    try {
      strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
      setContributor(strings.contributors)
      setSettings(strings.settings)
      setPreview(strings.preview)
      setJournalSettings(strings.journalSettings)
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

      <View style={{ flex: 1 }}>
        <ImageBackground style={globalStyles.journalSettings_Img_background} source={require('../../../../assets/journal_background_header.png')} >
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
                  <Text style={globalStyles.main_headerDiv_titlestyle}>{journalSettings}</Text>
                </View>
                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
              </View>


            </View>

          </View>
        </ImageBackground>

      </View>


      <View style={{ flex: 3 }}>
        <View style={{ height: 'auto' }}>
          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Contributors', { admin: adminName })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../../assets/settings_contributors_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>{contributor}</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SettingsPage', { admin: adminName })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../../assets/settings_settings_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>{settings}</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('NotificationsPage', { admin: adminName })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../../assets/settings_notifications_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>Notifications</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ShippingAddressPage', { admin: adminName })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../../assets/settings_destination_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>Destination</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View>

          {/* <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('PreviewPage', { admin: adminName })}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../../assets/settings_preview_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>{preview}</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View> */}

        </View>
      </View>



    </View>
  );
}





const styles = StyleSheet.create({
  navigationView: {
    justifyContent: 'center',
    height: 55,
    borderBottomWidth: 0.5,
    borderBottomColor: '#5ec6ca',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10
  }
})

export default JournalSettings;