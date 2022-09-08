import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity, TextInput, Modal } from "react-native";
import { globalStyles } from "../../../../Activities/03-constants/global";
import SelectDropdown from 'react-native-select-dropdown'
import { ScrollView } from "react-native-gesture-handler";
import { strings } from "../../../../App";
import Toast, { DURATION } from 'react-native-easy-toast';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import FastImage from 'react-native-fast-image'
import NetInfo from "@react-native-community/netinfo";
import { constants } from "../../../03-constants/Constants";
import { ModalConnection } from "../../02-components/ConnectionComponent";
import { DeleteJournal, UpdateJournalName } from "../../03-providers/JournalProvider";
import { UpdateCoverImage } from "../../03-providers/ImagesProvider";
import { JournalContext } from "../../04-context/Context";
import ImageResizer from "react-native-image-resizer";

const countries = ["Italic", "Bold", "Arial"]

const SettingsPage = ({ route, navigation }) => {
  const myContext = useContext(JournalContext);
  let [contextEditionRef, setContextEditionRef] = useState(myContext.EditionRef)
  let [contextAccessStatus, setContextAccessStatus] = useState(myContext.accessStatus)
  let [contextJournalRef, setContextJournalRef] = useState(myContext.JournalRef)
  let [contextJournalName, setContextJournalName] = useState(myContext.JournalName)
  let [contextCoverImage, setContextCoverImage] = useState(myContext.CoverImage)
  let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)
  let [contextToken, setContextToken] = useState(myContext.Token)
  let [contextUserUid, setContextUserUid] = useState(myContext.UserUid)


  let [fontStyle, setFontStyle] = useState("Italic");
  let [imageSelected, setImageSelected] = useState('');
  let [modalStatus, setModalStatus] = useState(false)
  let [loading, setLoading] = useState(false)
  let [confirmJournalName, setConfirmJournalName] = useState('')
  let [currentJournalName, setCurrentJournalName] = useState('')

  let [connectionModalStatus, setConnectionModalStatus] = useState(false)

  //Labels
  let [journalSettings, setJournalSettings] = useState("Journal Settings");
  let [editJournalProfile, setEditJournalProfile] = useState("Edit Journal Profile");
  let [titleOfJournal, setTitleOfJournal] = useState("Title of the journal");
  let [titlesFonts, setTitlesFonts] = useState("Titles Font");
  let [deleteJournal, setDeleteJournal] = useState("Delete Journal");
  let [selectTitlesfont, setSelectTitlesfont] = useState("Select titles font");
  let [youaregoingtoremove, setyouaregoingtoremove] = useState("You are going to remove");
  let [removedJournalCannotbeRestored, setRemovedJournalCannotbeRestored] = useState("Journal. Removed journal CANNOT be restored! Are you ABSOLUTELY sure?");
  let [pleaseType, setPleaseType] = useState("Please type");
  let [toProceedorClose, setToProceedorClose] = useState("to proceed or close to cancel.");
  let [deleteLabel, setDeleteLabel] = useState("Delete");
  let [submit, setSubmit] = useState("Submit");
  let [pleasetypeavalidjournalname, setPleasetypeavalidjournalname] = useState("Please type a valid journal name");
  let [noInternetConnection, setNoInternetConnection] = useState("No Internet connection");
  let [refresh, setRefresh] = useState("Refresh");

  let [mode, setMode] = useState('contain')
  let [onlyScaleDown, setOnlyScaleDown] = useState(false)

  const resizeImg = (imageSelected) => {
    ImageResizer.createResizedImage(imageSelected, 1024, 1024, 'JPEG', 90, 0, undefined, false, { mode, onlyScaleDown })
      .then(response => {
        setImageSelected(response.uri)
      })
      .catch(err => {
        console.log("ERROR: ", err)
      });
  }

  /** function to open the mobile gallery and pick an image */
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
        resizeImg(response.assets[0].uri)
      }
    });
  }



  /** this function call backend api to upload the journal edition cover image into database */
  const uploadCoverImagetoJournalEdition = () => {
    NetInfo.fetch().then(state => {
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
            data.append('editionRef', contextEditionRef)
            data.append('imgDescription', '')
            data.append('imgOrientation', '')
            data.append('imgDescriptionVisible', '')
            data.append('fullScreen', '')
            data.append('coverImage', true)
            UpdateCoverImage(contextToken, data)
              .then((response) => response.json())
              .then(this.toast.show('Your Journal cover image has updated successfully', 2000), navigation.navigate("Root"))
              .catch((error) => { console.log(error) })
          })
        })
      } else {
        setConnectionModalStatus(true)
        getAsyncStorageDataForNoConnection()
      }
    })
  }

  /** get params from async storage */
  const getAsyncStorageDataForNoConnection = async () => {
    try {
      strings.setLanguage(contextAppLanguage)
      setNoInternetConnection(strings.noInternetConnection)
      setRefresh(strings.refresh)
    } catch (e) {
      console.log(e)
    }
  }

  /** get params from async storage */
  const getAsyncStorageData = async () => {
    try {
      strings.setLanguage(contextAppLanguage)
      setJournalSettings(strings.journalSettings)
      setEditJournalProfile(strings.editJournalProfile)
      setTitleOfJournal(strings.titleOfJournal)
      setTitlesFonts(strings.titlesFont)
      setDeleteJournal(strings.deleteJournal)
      setSelectTitlesfont(strings.selectTitlefonts)
      setyouaregoingtoremove(strings.youaregoingtoremove)
      setRemovedJournalCannotbeRestored(strings.removedJournalCannotbeRestored)
      setPleaseType(strings.pleaseType)
      setToProceedorClose(strings.toProceedorClose)
      setDeleteLabel(strings.delete)
      setSubmit(strings.submit)
      setPleasetypeavalidjournalname(strings.pleasetypeavalidjournalname)
      setNoInternetConnection(strings.noInternetConnection)
      setRefresh(strings.refresh)
    } catch (e) {
      console.log(e)
    }
  }

  /** function to check if the confirmation journal name is the same of the journal selected */
  const checkIfJournalNameCorrect = (confirmationJournalName) => {
    setModalStatus(false)
    if (confirmationJournalName === contextJournalName && confirmationJournalName != '') {
      deleteJournalFromDB(contextJournalRef)
    } else {
      this.toast.show(pleasetypeavalidjournalname, 2000);
    }
  }

  /**  insert admin and the key into DB */
  const deleteJournalFromDB = (journalRef) => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        DeleteJournal(journalRef)
          .then((response) => response.json())
          .then(navigation.navigate("Root"))
          .catch((error) => { console.log(error) })
      } else {
        getAsyncStorageDataForNoConnection()
        setConnectionModalStatus(true)
      }
    })
  }

  /** update Journal Name */
  const updateJournalName = () => {
    setLoading(true)
    UpdateJournalName(contextJournalRef, currentJournalName)
      .then((response) => response.json())
      .then(navigation.navigate("Root"))
      .catch((error) => { console.log(error) })
  }


  const renderFileUri = () => {
    if (imageSelected != '') {
      return <Image
        source={{ uri: imageSelected }}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    } else {
      return <Image
        source={require('../../../assets/defaultCover.jpg')}
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
        source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + contextUserUid + "/" + contextCoverImage }}
        style={globalStyles.coverImage_uploadRoundedImage}
      />
    }
  }

  /** function to check if internet connection is enable or not */
  const checkConnection = () => {
    NetInfo.fetch().then(state => {
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
    setCurrentJournalName(contextJournalName)
    checkConnection();
    return () => {
    }
  }, [])

  return (
    <View style={globalStyles.JournalDetails_main_Container}>
      <Spinner
        visible={loading}
        textContent={'Loading...'}
        textStyle={globalStyles.spinnerTextStyle}
      />
      <View style={globalStyles.viewFlex1}>
        <ImageBackground style={globalStyles.settingsPage_Img_background} source={require('../../../assets/journal_background_header.png')} >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <View style={globalStyles.main_headerDiv_backandtitle}>
              <View style={globalStyles.subHeaderViewbackgroundYellow}>
                <View style={globalStyles.headerGlobalLeftRightView}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('JournalSettings')}>
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
      <View style={{ flex: 3, alignItems: 'center' }}>
        {contextAccessStatus == 0 ? (
          <View>
            <TouchableOpacity activeOpacity={0.8} onPress={() => openGallery()}>
              {contextCoverImage == "null" || contextCoverImage == "" ? (
                renderFileUri()
              ) :
                renderFileUriIfCoverExist()
              }
            </TouchableOpacity>
            <Text style={globalStyles.settingsEditJournalProfileLabel}>{editJournalProfile}</Text>

            {imageSelected != "" ? (
              <TouchableOpacity onPress={() => uploadCoverImagetoJournalEdition()}>
                <View style={globalStyles.submit_button_style}>
                  <Text style={globalStyles.Wel_Log_buttonLabel}>{submit}</Text>
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <ScrollView>
          <View style={{ width: '100%', marginTop: 15 }}>
            <Text style={globalStyles.settingsPage_titleInput}>{titleOfJournal}</Text>
            <View style={globalStyles.viewRowFullwidthCenter}>
              <View style={{ width: '80%' }}>
                <View style={globalStyles.login_InputwithImage}>
                  <TextInput style={globalStyles.settingJournalInput} underlineColorAndroid="transparent" value={currentJournalName} onChangeText={(text) => setCurrentJournalName(text)} />
                </View>
              </View>
              <View style={{ width: '20%', justifyContent: 'center' }}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => updateJournalName()}>
                  <Text style={{ color: '#5ec6ca', fontSize: 14 }}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* <Text style={globalStyles.settingsPage_titleInput}>{titlesFonts}</Text>
            <View style={globalStyles.settingsPage_dropdown}>
              <SelectDropdown
                buttonStyle={{ backgroundColor: 'white', borderColor: '#D5D5D5', borderWidth: 0.5, borderRadius: 5, width: '100%', height: 37 }}
                defaultButtonText={selectTitlesfont}
                buttonTextStyle={fontStyle == 'Italic' ? globalStyles.titleFontsItalic : fontStyle == 'Arial' ? globalStyles.titleFontsArial : globalStyles.titleFontsBold}
                data={countries}
                onSelect={(selectedItem, index) => {
                  setFontStyle(selectedItem)
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem
                }}
                rowTextForSelection={(item, index) => {
                  return item
                }}
              />
              <Image style={globalStyles.journalSettings_next_icon} source={require('../../../assets/bottom_arrow.jpeg')} />
            </View> */}
          </View>
        </ScrollView>
      </View>

      {contextAccessStatus == 0 ? (
        <View style={globalStyles.settingDeleteBtnViewStyle}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => setModalStatus(true)}>
            <View style={globalStyles.settingsPage_button}>
              <Text style={globalStyles.Wel_Log_buttonLabel}>{deleteJournal}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null
      }

      <Modal transparent={true} visible={modalStatus}>
        <TouchableOpacity activeOpacity={0} style={globalStyles.viewFlex1} onPress={() => setModalStatus(false)}>
          <View style={globalStyles.modalDivstyle}>
            <View style={globalStyles.settingsModalView}>
              <View style={globalStyles.modalViewfullWidthPadding10}>
                <Text style={globalStyles.deleteJournal_confirmationTitle_desc}>{youaregoingtoremove} {contextJournalName} {removedJournalCannotbeRestored}</Text>
                <View style={globalStyles.flexRow}>
                  <Text style={globalStyles.deleteJournal_confirmationTitle}>{pleaseType}</Text>
                  <Text style={globalStyles.deleteJournal_journalNamewithbackground}>{contextJournalName}</Text>
                  <Text style={globalStyles.deleteJournal_confirmationTitle2}>{toProceedorClose}</Text>
                </View>
                <View style={globalStyles.alignItemsCenter}>
                  <View style={globalStyles.marginTopAuto}>
                    <View style={globalStyles.calendarModal_InputView}>
                      <TextInput style={globalStyles.DeleteJournalModal_textInput} underlineColorAndroid="transparent" onChangeText={(text) => setConfirmJournalName(text)} placeholderTextColor='#A5A5A5' />
                    </View>
                  </View>
                </View>
                <View style={{ alignSelf: 'center' }}>
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
      <ModalConnection visible={connectionModalStatus} noInternetConnection={noInternetConnection} checkConnection={checkConnection} refresh={refresh} />
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