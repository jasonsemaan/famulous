import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, ImageBackground, TouchableOpacity, FlatList, TextInput, Modal } from "react-native";
import { globalStyles } from "../../../../01-app/03-constants/global";
import SelectDropdown from 'react-native-select-dropdown'
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { strings } from "../../../../App";
import Toast, { DURATION } from 'react-native-easy-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import FastImage from 'react-native-fast-image'
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";



const countries = ["Italic", "Bold", "Arial"]
const languages = ["Francais", "English"]

const SettingsPage = ({ route, navigation }) => {
  var admin = route.params.admin
  let [fontStyle, setFontStyle] = useState("Italic");
  let [currentLanguage, setCurrentLanguage] = useState("English");
  let [editionRef, setEditionRef] = useState("");
  let [idToken, setIdToken] = useState("");
  let [imageSelected, setImageSelected] = useState('');
  let [signedUserUid, setSignedUserUid] = useState('');
  let [journaltitle, setJournaltitle] = useState('');
  let [journalRef, setJournalRef] = useState('');
  let [accessStatus, setAccessStatus] = useState('')
  let [modalStatus, setModalStatus] = useState(false)
  let [confirmJournalName, setConfirmJournalName] = useState('')
  let [coverImage, setCoverImage] = useState('')
  let [connectionModalStatus, setConnectionModalStatus] = useState(false)


  //Labels
  let [journalSettings, setJournalSettings] = useState("Journal Settings");
  let [editJournalProfile, setEditJournalProfile] = useState("Edit Journal Profile");
  let [titleOfJournal, setTitleOfJournal] = useState("Title of the journal");
  let [titlesFonts, setTitlesFonts] = useState("Titles Font");
  let [languageoftheJournal, setLanguageoftheJournal] = useState("Language of the journal");
  let [deleteJournal, setDeleteJournal] = useState("Delete Journal");
  let [selectTitlesfont, setSelectTitlesfont] = useState("Select titles font");
  let [youaregoingtoremove, setyouaregoingtoremove] = useState("You are going to remove");
  let [removedJournalCannotbeRestored, setRemovedJournalCannotbeRestored] = useState("Journal. Removed journal CANNOT be restored! Are you ABSOLUTELY sure?");
  let [pleaseType, setPleaseType] = useState("Please type");
  let [toProceedorClose, setToProceedorClose] = useState("to proceed or close to cancel.");
  let [deleteLabel, setDeleteLabel] = useState("Delete");
  let [submit, setSubmit] = useState("Submit");
  let [journalNameLabel, setJournalNameLabel] = useState("Journal name");
  let [thejournalhassuccessfullydeleted, setThejournalhassuccessfullydeleted] = useState("The journal has successfully deleted");
  let [pleasetypeavalidjournalname, setPleasetypeavalidjournalname] = useState("Please type a valid journal name");
  let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
  let [refresh, setRefresh] = useState("Refresh");





  /**
   *  store the language selected in th AsyncStorage then go back to homePage
   */
  // const storeData = async (index) => {
  //   try {
  //     if (index === 0) {
  //       await AsyncStorage.setItem('appLanguage', 'fr')
  //       await AsyncStorage.setItem('Language', 'Francais')
  //     } else if (index === 1) {
  //       await AsyncStorage.setItem('appLanguage', 'en')
  //       await AsyncStorage.setItem('Language', 'English')
  //     }
  //     navigation.navigate('Root')
  //     getAsyncStorageData();
  //   } catch (e) {
  //     console.log(e)
  //   }
  // }


  /**
   *  function to open the mobile gallery and pick an image
   */
  const openGallery = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        setImageSelected(response.assets[0].uri)
      }
    });
  }


  /**
  *  this function call backend api to upload the journal edition cover image into database
  */
  const uploadCoverImagetoJournalEdition = () => {
    NetInfo.fetch().then(state => {
      console.log(state)
      if (state.isConnected == true) {
        FastImage.clearDiskCache().then(e => {
          FastImage.clearMemoryCache().then(_ => {
            const data = new FormData();
            data.append('imgPath', {
              name: imageSelected,
              type: "image/jpeg",
              uri:
                Platform.OS === "android"
                  ? imageSelected
                  : imageSelected.replace("file://", "")
            })
            data.append('editionRef', editionRef)
            data.append('imgDescription', '')
            data.append('imgOrientation', '')
            data.append('imgDescriptionVisible', '')
            data.append('fullScreen', '')
            data.append('coverImage', true)

            fetch(constants.apiIP + "journal/insertUpdateCoverPicture", {
              method: 'post',
              body: data,
              headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": "Bearer " + idToken
              },
            })
              .then((response) => response.json())
              .then(this.toast.show('Your Journal cover image has updated successfully', 2000))
          })
        })
      } else {
        setConnectionModalStatus(true)
        getAsyncStorageDataForNoConnection()
      }
    })
  }

  /**
    *  get params from async storage
    */
  const getAsyncStorageDataForNoConnection = async () => {
    try {
      strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
      setNoInternetConnection(strings.noInternetConnection)
      setRefresh(strings.refresh)
    } catch (e) {
      console.log(e)
    }
  }


  /**
   *  get params from async storage
   */
  const getAsyncStorageData = async () => {
    try {
      setAccessStatus(await AsyncStorage.getItem('accessStatus'))
      strings.setLanguage(await AsyncStorage.getItem('appLanguage'))
      setCurrentLanguage(await AsyncStorage.getItem('Language'))
      setJournalSettings(strings.journalSettings)
      setEditJournalProfile(strings.editJournalProfile)
      setTitleOfJournal(strings.titleOfJournal)
      setTitlesFonts(strings.titlesFont)
      setLanguageoftheJournal(strings.languageOftheJournal)
      setDeleteJournal(strings.deleteJournal)
      setSelectTitlesfont(strings.selectTitlefonts)
      setyouaregoingtoremove(strings.youaregoingtoremove)
      setRemovedJournalCannotbeRestored(strings.removedJournalCannotbeRestored)
      setPleaseType(strings.pleaseType)
      setToProceedorClose(strings.toProceedorClose)
      setDeleteLabel(strings.delete)
      setSubmit(strings.submit)
      setJournalNameLabel(strings.journalName)
      setThejournalhassuccessfullydeleted(strings.thejournalhassuccessfullydeleted)
      setPleasetypeavalidjournalname(strings.pleasetypeavalidjournalname)
      setNoInternetConnection(strings.noInternetConnection)
      setRefresh(strings.refresh)

      setIdToken(await AsyncStorage.getItem('Token'))
      setEditionRef(await AsyncStorage.getItem('editionRef'))
      setSignedUserUid(await AsyncStorage.getItem('UserUid'))
      setJournaltitle(await AsyncStorage.getItem('JournalName'))
      setJournalRef(await AsyncStorage.getItem('JournalRef'))
      setCoverImage(await AsyncStorage.getItem('CoverImage'))
      console.log(await AsyncStorage.getItem('CoverImage'))

    } catch (e) {
      console.log(e)
    }
  }


  /**
   *  function to check if the confirmation journal name is the same of the journal selected
   */
  const checkIfJournalNameCorrect = (confirmationJournalName) => {
    setModalStatus(false)
    if (confirmationJournalName === journaltitle && confirmationJournalName != '') {
      deleteJournalFromDB(journalRef)
    } else {
      this.toast.show(pleasetypeavalidjournalname, 2000);
    }
  }


  /**
   *  insert admin and the key into DB
   */
  const deleteJournalFromDB = (journalRef) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        fetch(constants.apiIP + "journal/deleteJournal", {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            journalRef: journalRef,
          })
        })
          .then((response) => response.json())
          .then(this.toast.show(thejournalhassuccessfullydeleted, 2000))
      } else {
        setConnectionModalStatus(true)
        getAsyncStorageDataForNoConnection()
      }
    })
  }


  const renderFileUri = () => {
    if (imageSelected != '') {
      return <Image
        source={{ uri: imageSelected }}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    } else {
      return <Image
        source={require('../../../../assets/defaultCover.jpg')}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    }
  }

  const renderFileUriIfCoverExist = () => {
    if (imageSelected != '') {
      return <Image
        source={{ uri: imageSelected }}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    } else {
      return <Image
        source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + signedUserUid + "/" + coverImage }}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    }
  }

  /**
    *  function to check if internet connection is enable or not
    */
  const checkConnection = () => {
    NetInfo.fetch().then(state => {
      console.log("is Connected? ", state)
      if (state.isConnected == true) {
        getAsyncStorageData()
        setConnectionModalStatus(false)
      } else {
        setConnectionModalStatus(true)
        getAsyncStorageDataForNoConnection()
      }
    });
  }


  useEffect(() => {
    checkConnection();
    return () => {
    }
  }, [])



  return (
    <View style={globalStyles.JournalDetails_main_Container}>

      <View style={{ flex: 1 }}>
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
                  <Text style={globalStyles.main_headerDiv_titlestyle}>{journalSettings}</Text>
                </View>
                <View style={{ width: '15%', justifyContent: 'center', alignItems: 'center' }}></View>
              </View>


            </View>

          </View>
        </ImageBackground>
      </View>

      <View style={{ flex: 3, alignItems: 'center' }}>

        {accessStatus == 0 ? (
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => openGallery()}>
              {coverImage == "null" || coverImage == "" ? (
                renderFileUri()
              ) :
                renderFileUriIfCoverExist()
              }
            </TouchableOpacity>

            <Text style={{ color: 'grey', fontSize: 14, alignSelf: 'center', marginTop: 15 }}>{editJournalProfile}</Text>

            {imageSelected != "" ? (
              <TouchableOpacity onPress={() => uploadCoverImagetoJournalEdition()}>
                <Text style={{ color: 'green', fontSize: 18, alignSelf: 'center', marginTop: 10 }}>{submit}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}


        <ScrollView>
          <View style={{ width: '100%', marginTop: 15 }}>
            <Text style={globalStyles.settingsPage_titleInput}>{titleOfJournal}</Text>
            <View style={globalStyles.login_InputwithImage}>
              <TextInput style={globalStyles.textInputWithIcon} underlineColorAndroid="transparent" value={journaltitle} editable={false} />
            </View>

            <Text style={globalStyles.settingsPage_titleInput}>{titlesFonts}</Text>
            <View style={globalStyles.settingsPage_dropdown}>
              <SelectDropdown
                buttonStyle={{ backgroundColor: 'white', borderColor: '#D5D5D5', borderWidth: 0.5, borderRadius: 5, width: '100%', height: 37 }}
                defaultButtonText={selectTitlesfont}
                buttonTextStyle={fontStyle == 'Italic' ? globalStyles.titleFontsItalic : fontStyle == 'Arial' ? globalStyles.titleFontsArial : globalStyles.titleFontsBold}

                data={countries}
                onSelect={(selectedItem, index) => {
                  console.log(selectedItem, index)
                  setFontStyle(selectedItem)
                  console.log(fontStyle)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
              />
              <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/bottom_arrow.jpeg')} />

            </View>

            {/* <Text style={globalStyles.settingsPage_titleInput}>{languageoftheJournal}</Text>
            <View style={globalStyles.settingsPage_dropdown}>
              <SelectDropdown
                buttonStyle={{ backgroundColor: 'white', borderColor: '#D5D5D5', borderWidth: 0.5, borderRadius: 5, width: '100%', height: 37 }}
                defaultButtonText={currentLanguage}
                buttonTextStyle={{ textAlign: 'left', fontSize: 12 }}
                data={languages}
                onSelect={(selectedItem, index) => {
                  storeData(index)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
              />
              <Image style={globalStyles.journalSettings_next_icon} source={require('../../../../assets/bottom_arrow.jpeg')} />
            </View> */}

          </View>
        </ScrollView>
      </View>

      {accessStatus == 0 ? (
        <View style={{ left: 0, right: 0, bottom: 0, height: 70, justifyContent: 'center', alignItems: 'center' }}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setModalStatus(true)}>
            <View style={globalStyles.settingsPage_button}>
              <Text style={globalStyles.Wel_Log_buttonLabel}>{deleteJournal}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null
      }

      <Modal transparent={true} visible={modalStatus}>
        <TouchableOpacity activeOpacity={0} style={{ flex: 1 }} onPress={() => setModalStatus(false)}>
          <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#ffffff', padding: 5, height: '40%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' }}>
              <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10 }}>
                <Text style={globalStyles.deleteJournal_confirmationTitle_desc}>{youaregoingtoremove} {journaltitle} {removedJournalCannotbeRestored}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={globalStyles.deleteJournal_confirmationTitle}>{pleaseType}</Text>
                  <Text style={globalStyles.deleteJournal_journalNamewithbackground}>{journaltitle}</Text>
                  <Text style={globalStyles.deleteJournal_confirmationTitle2}>{toProceedorClose}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ marginTop: 'auto' }}>
                    <View style={globalStyles.calendarModal_InputView}>
                      <TextInput style={globalStyles.DeleteJournalModal_textInput} underlineColorAndroid="transparent" onChangeText={(text) => setConfirmJournalName(text)} placeholderTextColor='#A5A5A5' />
                    </View>
                  </View>
                </View>
                <View>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => checkIfJournalNameCorrect(confirmJournalName)}>
                    <View style={globalStyles.deleteJournal_button_style}>
                      <Text style={globalStyles.Wel_Log_buttonLabel}>{deleteLabel}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent={true} visible={connectionModalStatus}>
        <TouchableOpacity activeOpacity={1} style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: '#ffffff', padding: 5, height: '10%', borderRadius: 10, alignItems: 'center', marginBottom: 50, marginLeft: 10, marginRight: 10 }}>
              <View style={{ flex: 1, width: '100%', justifyContent: 'center', padding: 10, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={require('../../../../assets/no-internet.png')} style={{ width: 30, height: 30, marginLeft: 10 }}></Image>
                    <Text style={globalStyles.noInternetConnectionLabelStyle}>{noInternetConnection}</Text>
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => checkConnection()}>
                    <View style={{ padding: 10 }}>
                      <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#5ec6ca', marginRight: 20 }}>{refresh}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>
        </TouchableOpacity>
      </Modal>


      <Toast ref={(toast) => this.toast = toast}
        style={{ borderRadius: 20 }}
        fadeInDuration={500}
        fadeOutDuration={500} />
    </View>

  );
}







const styles = StyleSheet.create({

})

export default SettingsPage;