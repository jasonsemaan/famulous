import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from "react-native";
import FastImage from "react-native-fast-image";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class PortraitDescription extends React.Component{
    render(){
        return  <View style={this.props.portraitDescriptionStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
        <View style={globalStyles.viewWidth60}>
            <View style={globalStyles.imageViewFlexFullWidthAlignCenter}>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsImagestyle}/>
            </View>
        </View>
        <View style={globalStyles.viewWidth60left10}>
            <View>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
            </View>
            <View style={globalStyles.viewMarginTop5}>
                <Text style={globalStyles.detailsJaneDoeStyle}>Jane doe</Text>
                <Text style={globalStyles.detailsJaneDoeDateStyle}>1 - 11 - 2021</Text>
            </View>
            <View style={globalStyles.detailsViewSmalllayoutDescriptionPortrait}>
                <Text style={globalStyles.loremTextPortrait}>Lorem ipsum dolor sit amet,consectetur adipiscing elit. Fusce laoreet consequat gravida.</Text>
            </View>
        </View>
    </View>
    }
}

export class PortraitNoDescription extends React.Component{
    render(){
        return  <View style={this.props.portraitStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
        <View style={globalStyles.viewWidth60}>
            <View style={globalStyles.imageViewFlexFullWidthAlignCenter}>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsImagestyle}/>
            </View>
        </View>
        <View style={globalStyles.viewWidth60left10}>
            <View>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
            </View>
            <View style={globalStyles.viewMarginTop5}>
                <Text style={globalStyles.detailsJaneDoeStyle}>Jane doe</Text>
                <Text style={globalStyles.detailsJaneDoeDateStyle}>1 - 11 - 2021</Text>
            </View>
            <View style={globalStyles.detailsViewSmalllayoutDescriptionPortrait}>
            </View>
        </View>
    </View>
    }
}

export class PortraitFullDescription extends React.Component{
    render(){
        return <View style={this.props.portraitFullDescStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
        <View style={globalStyles.viewWidth100}>
            <View style={{ width: '100%', flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={{ width: 100, height: 75, resizeMode: 'contain', }}/>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={globalStyles.loremTextPortraitFull}>Lorem ipsum dolor</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 2 }}>
                <View>
                    <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
                </View>
                <Text style={globalStyles.detailsJaneDoeMarginLeftStyle}>Jane doe</Text>
                <Text style={globalStyles.detailsJaneDoeDateStyleRow}>1 - 11 - 2021</Text>
            </View>

        </View>
    </View>
    }
}

export class PortraitFullNoDescription extends React.Component{
    render(){
        return  <View style={this.props.portraitFullStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
        <View style={globalStyles.viewWidth100}>
            <View style={globalStyles.imageViewFlexFullWidthAlignCenter}>
                <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsImagestyle} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 5 }}>
                <View>
                    <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
                </View>
                <Text style={globalStyles.detailsJaneDoeMarginLeftStyle}>Jane doe</Text>
                <Text style={globalStyles.detailsJaneDoeDateStyleRow}>1 - 11 - 2021</Text>
            </View>
        </View>
    </View>
    }
}

export class LandscapeDescription extends React.Component{
    render(){
        return  <View style={this.props.landscapeDescriptionStatus ? globalStyles.imageLayout_landscapeWithDesc_Selected : globalStyles.imageLayout_landscapeWithDesc}>
        <View style={globalStyles.viewWidth100FlexRow}>
            <View style={{ width: '65%', height: 60 }}>
                <Image source={require('../../assets/landscape_image2.jpeg')} style={globalStyles.detailsImagestyle} />
            </View>
            <View style={{ width: 60, marginLeft: 5, marginTop: 10 }}>
                <View>
                    <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
                </View>
                <View style={globalStyles.viewMarginTop5}>
                    <Text style={globalStyles.detailsJaneDoeStyle}>Jane doe</Text>
                    <Text style={globalStyles.detailsJaneDoeDateStyle}>1 - 11 - 2021</Text>
                </View>

            </View>
        </View>

        <View style={globalStyles.loremTextLandscapeView}>
            <Text style={globalStyles.loremTextLandscape}>Lorem ipsum dolor sit amet, consecter adipiscing elit. Fusce laoreet consequat gravida.</Text>
        </View>
    </View>
    }
}

export class LandscapeNoDescription extends React.Component{
    render(){
        return  <View style={this.props.landscapeStatus ? globalStyles.imageLayouts_mainDiv_Selected : globalStyles.imageLayouts_mainDiv}>
        <View style={globalStyles.viewWidth100}>
            <View style={globalStyles.imageViewFlexFullWidthAlignCenter}>
                <Image source={require('../../assets/landscape_image2.jpeg')} style={globalStyles.detailsImagestyle} />
            </View>
            <View style={globalStyles.detailsUserDateView}>
                <View>
                    <Image source={require('../../assets/portrait_image2.jpeg')} style={globalStyles.detailsSmalllRoundedImage} />
                </View>
                <Text style={globalStyles.detailsJaneDoeMarginLeftStyle}>Jane doe</Text>
                <Text style={globalStyles.detailsJaneDoeDateStyleRow}>1 - 11 - 2021</Text>
            </View>
        </View>
    </View>
    }
}

export class ModalDetailsComponent extends React.Component{
    render(){
        return  <Modal transparent={true} visible={this.props.connectionModalStatus}>
        <TouchableOpacity activeOpacity={1} style={globalStyles.viewFlex1}>
            <View style={globalStyles.modalDivstyle}>
                <View style={globalStyles.modalSubDivstyle}>
                    <View style={globalStyles.modalSubDivstyle2}>
                        <View style={globalStyles.modalSubDivstyle3}>
                            <View style={globalStyles.viewRowAlignCenter}>
                                <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIcon} />
                                <Text style={globalStyles.noInternetConnectionLabelStyle}>{this.props.noInternetConnection}</Text>
                            </View>
                            <TouchableOpacity activeOpacity={0.8} onPress={this.props.checkConnection}>
                                <View style={{ padding: 10 }}>
                                    <Text style={globalStyles.refreshLabelStyle}>{this.props.refresh}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    </Modal>
    }
}

export class MainLandscapeDescView extends React.Component{
    render(){
        return  <View style={globalStyles.landscape_rightView}>
        <View style={globalStyles.landscape_closeView}>
        </View>
        <View style={{ marginTop: 40 }}>
            <FastImage
                style={globalStyles.journal_details_userprifile_rounded}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.signedUserUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={globalStyles.journalDetails_ViewUserandDateMargins}>
            <Text style={globalStyles.journal_text_styles}>{this.props.signedUserName}</Text>
            <Text style={globalStyles.journal_text_styles_date}>{this.props.currentDate}</Text>
        </View>

    </View>
    }
}

export class MainPortraitNoDescView extends React.Component{
    render(){
        return <View style={globalStyles.portrait_2ndView50}>
        <View style={globalStyles.portrait_closeView}>
        </View>
        <View style={{ marginTop: 20 }}>
            <FastImage
                style={globalStyles.journal_details_userprifile_rounded}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.signedUserUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={globalStyles.journalDetails_ViewUserandDateMargins}>
            <Text style={globalStyles.journal_text_styles}>{this.props.signedUserName}</Text>
            <Text style={globalStyles.journal_text_styles_date}>{this.props.currentDate}</Text>
        </View>
        <View style={globalStyles.portrait_description}>
        </View>
    </View>
    }
}

export class MainPortraitFullView extends React.Component{
    render(){
        return <View style={globalStyles.viewFlexRowCenterWithMargin}>
        <View>
            <FastImage
                style={globalStyles.journal_details_userprifile_rounded}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.signedUserUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={globalStyles.titlesMarginLeft10}>
            <Text style={globalStyles.journal_text_styles}>{this.props.signedUserName}</Text>
        </View>
        <View style={globalStyles.titlesMarginLeft15}>
            <Text style={globalStyles.detailsCurrentDateStyle}>{this.props.currentDate}</Text>
        </View>
    </View>
    }
}

export class MainLandscapeNoDescView extends React.Component{
    render(){
        return <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <View>
            <FastImage
                style={globalStyles.journal_details_userprifile_rounded}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.signedUserUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={globalStyles.titlesMarginLeft10}>
            <Text style={globalStyles.journal_text_styles}>{this.props.signedUserName}</Text>
        </View>
        <View style={globalStyles.titlesMarginLeft15}>
            <Text style={globalStyles.detailsCurrentDateStyle}>{this.props.currentDate}</Text>
        </View>
    </View>
    }
}