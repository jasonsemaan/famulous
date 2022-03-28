import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../03-constants/global";
import { strings } from "../../../../App";


const HowItWorksPage = ({ navigation }) => {
    //Labels
    let [howitworks, sethowItWorks] = useState("How it works");
    let [familyTime_is_a, setfamilyTimeIsA] = useState("FamilyTime is a service that allows you to create a monthly journal that collects photos of your family for yout parents or grandparents who are not comfortable with smartphones, social networks or who simply enjoy a hard copy");
    let [you_or_thePerson, setYouOrThePerson] = useState("You or the person you invote to your journal uploads photos");
    let [atTheEndOfTheMonth, setAtTheEndOfTheMonth] = useState("At the end of the month, we put together the layout and print the journal");
    let [afterProcessing, setAfterProcessing] = useState("After processing the images we deliver the journal to your pre-picked destination");
    let [theJournalIncludes, setTheJournalIncludes] = useState("The journal includes");
    let [oneCoverPhoto, setOneCoverPhoto] = useState("1 Cover photo");
    let [twoPhotosPerPage, setTwoPhotosPerPage] = useState("2 photos per page");
    let [upTo40PhotosPerMonth, setUpTo40PhotosPerMonth] = useState("up to 40 photos per month");
    let [grSemiGlossyPaper, setGrSemiGlossyPaper] = useState("130gr semi-glossy paper");
    let [a5Size, seta5Size] = useState("A5 size");
    let [lastPageContainingAllContr, setLastPageContainingAllContr] = useState("Last page containing all contributors");

    /** get params from async storage */
    const getAsyncStorageData = async () => {
        try {
            strings.setLanguage(global.appLanguage)
            sethowItWorks(strings.howitworks)
            setfamilyTimeIsA(strings.familyTime_is_a)
            setYouOrThePerson(strings.you_or_thePerson)
            setAtTheEndOfTheMonth(strings.atTheEndOfTheMonth)
            setAfterProcessing(strings.afterProcessing)
            setTheJournalIncludes(strings.theJournalIncludes)
            setOneCoverPhoto(strings.oneCoverPhoto)
            setTwoPhotosPerPage(strings.twoPhotosPerPage)
            setUpTo40PhotosPerMonth(strings.upTo40PhotosPerMonth)
            setGrSemiGlossyPaper(strings.grSemiGlossyPaper)
            seta5Size(strings.a5Size)
            setLastPageContainingAllContr(strings.lastPageContainingAllContr)
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
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                    <View style={{ padding: 10 }}>
                                        <Image style={globalStyles.backArrow} source={require('../../../assets/back-icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={globalStyles.headerGlobalMiddleView}>
                                <Text style={globalStyles.main_headerDiv_titlestyle}>{howitworks}</Text>
                            </View>
                            <View style={globalStyles.headerGlobalLeftRightView}></View>
                        </View>
                    </View>
                </View>

                <View style={globalStyles.menuDrawer_Overflow_Div}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <View style={globalStyles.howitworks_single_view}>
                                <Image source={require('../../../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo_Drawer}/>
                            </View>
                            <View style={globalStyles.howitworks_single_view}>
                                <Text style={globalStyles.howitworks_smallText}>
                                    {familyTime_is_a}
                                </Text>
                            </View>
                            <View style={globalStyles.howitworks_single_view}>
                                <Image source={require('../../../assets/howitworks_img1.png')} style={globalStyles.howitworks_images_style}/>
                            </View>
                            <View style={globalStyles.howitworks_single_view_noMargins}>
                                <Text style={globalStyles.howitworks_smallText}>
                                    {you_or_thePerson}
                                </Text>
                            </View>
                            <View style={globalStyles.howitworks_single_view}>
                                <Image source={require('../../../assets/howitworks_img2.png')} style={globalStyles.howitworks_images_style}/>
                            </View>
                            <View style={globalStyles.howitworks_single_view_noMargins}>
                                <Text style={globalStyles.howitworks_smallText}>
                                    {atTheEndOfTheMonth}
                                </Text>
                            </View>
                            <View style={globalStyles.howitworks_single_view}>
                                <Image source={require('../../../assets/howitworks_img3.png')} style={globalStyles.howitworks_images_style}/>
                            </View>
                            <View style={globalStyles.howitworks_single_view_noMargins}>
                                <Text style={globalStyles.howitworks_smallText}>
                                    {afterProcessing}
                                </Text>
                            </View>

                            <View style={{ width: '100%', marginTop: 20, padding: 20 }}>
                                <Text style={{ color: '#9b56a2', fontSize: 20, fontWeight: 'bold' }}>{theJournalIncludes}</Text>
                                <View style={{ flexDirection: 'row', width: '100%', padding: 20 }}>
                                    <View style={{ width: '80%' }}>
                                        <View style={globalStyles.flexRow}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-14.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{oneCoverPhoto}</Text>
                                        </View>
                                        <View style={globalStyles.howitworks_footerRowDiv}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-15.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{twoPhotosPerPage}</Text>
                                        </View>
                                        <View style={globalStyles.howitworks_footerRowDiv}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-16.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{upTo40PhotosPerMonth}</Text>
                                        </View>
                                        <View style={globalStyles.howitworks_footerRowDiv}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-17.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{grSemiGlossyPaper}</Text>
                                        </View>
                                        <View style={globalStyles.howitworks_footerRowDiv}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-18.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{a5Size}</Text>
                                        </View>
                                        <View style={globalStyles.howitworks_footerRowDiv}>
                                            <Image style={globalStyles.howitworks_lefticon} source={require('../../../assets/icons-19.png')} />
                                            <Text style={globalStyles.howitworks_footer_greylabels}>{lastPageContainingAllContr}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: '20%' }}>
                                        <Image source={require('../../../assets/howitworks_img4.png')} style={globalStyles.howitworks_images_style}/>
                                    </View>
                                </View>
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

export default HowItWorksPage;