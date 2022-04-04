import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";
import { strings } from "../../../../App";
import { JournalContext } from "../../04-context/Context";

const JournalSettings = ({ route, navigation }) => {
  const myContext = useContext(JournalContext);
  let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)

  //Labels
  let [contributor, setContributor] = useState("Contributors");
  let [settings, setSettings] = useState("Settings");
  let [journalSettings, setJournalSettings] = useState("Journal Settings");

  /** get params from async storage */
  const getAsyncStorageData = async () => {
    try {
      strings.setLanguage(contextAppLanguage)
      setContributor(strings.contributors)
      setSettings(strings.settings)
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

      <View style={globalStyles.viewFlex1}>
        <ImageBackground style={globalStyles.journalSettings_Img_background} source={require('../../../assets/journal_background_header.png')} >
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
                  <Text style={globalStyles.main_headerDiv_titlestyle}>{journalSettings}</Text>
                </View>
                <View style={globalStyles.headerGlobalLeftRightView}></View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      <View style={{ flex: 3 }}>
        <View style={{ height: 'auto' }}>
          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Contributors')}>
              <View style={globalStyles.viewRowAlignCenter}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../assets/settings_contributors_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>{contributor}</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../assets/next.png')} />
              </View>

            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('SettingsPage')}>
              <View style={globalStyles.viewRowAlignCenter}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../assets/settings_settings_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>{settings}</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../assets/next.png')} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('NotificationsPage')}>
              <View style={globalStyles.viewRowAlignCenter}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../assets/settings_notifications_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>Notifications</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../assets/next.png')} />
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.navigationView}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('ShippingAddressPage')}>
              <View style={globalStyles.viewRowAlignCenter}>
                <Image style={globalStyles.journalSettings_lefticon} source={require('../../../assets/settings_destination_icon.png')} />
                <Text style={globalStyles.journalSettings_label}>Destination</Text>
                <Image style={globalStyles.journalSettings_next_icon} source={require('../../../assets/next.png')} />
              </View>
            </TouchableOpacity>
          </View>
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