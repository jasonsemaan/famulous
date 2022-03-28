import React from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class ListDefaultImageBackgroundComponent extends React.Component {
    render() {
        return <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground} source={require('../../assets/defaultCover.jpg')} >
            <View style={globalStyles.monthYearView}>
                <Text style={globalStyles.monthYearLabel}>{this.props.month} {this.props.year}</Text>
            </View>
        </ImageBackground>
    }
}

export class ListCoverImageBackgroundComponent extends React.Component {
    render() {
        return <ImageBackground style={globalStyles.homePage_editionItem_ImgBackground}
            source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.signedUserUid + "/" + this.props.coverImage }} >
            <View style={globalStyles.monthYearView}>
                <Text style={globalStyles.monthYearLabel}>{this.props.month} {this.props.year}</Text>
            </View>
        </ImageBackground>
    }
}

export class ContributorsDaysLeftComponent extends React.Component {
    render() {
        return <View style={globalStyles.row_div_homePage_contributorsDaysLeft}>
            <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                <Image source={require('../../assets/group.png')} style={{ width: 18, height: 18, marginRight: 5, marginLeft: 5 }} />
                <Text style={globalStyles.home_listItem_Contributors_Days}>{this.props.contributorsNb} {this.props.contributorss}</Text>
            </View>
            {this.props.accessStatus === 0 ? (
                <View style={globalStyles.row_div_homePage_singleView_DaysLeft_Contributors}>
                    <Text style={globalStyles.home_listitem_bulletpoint}>•</Text>
                    <Image source={require('../../assets/clock.png')} style={{ width: 18, height: 18, marginRight: 5 }} />
                    <Text style={globalStyles.home_listItem_Contributors_Days}>{this.props.daysLeftFromDB} {this.props.daysLeft}</Text>
                </View>
            ) : null}
        </View>
    }
}

export class NoJournalsComponent extends React.Component {
    render() {
        return <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
            <Image source={require('../../assets/emptyJournal.png')} style={globalStyles.noInternetIconwidth60} />
            <Text style={globalStyles.blackBoldLabel}>{this.props.noJournals}</Text>
            <Text style={globalStyles.textColorGrey}>{this.props.addWithBtn}</Text>
        </View>
    }
}

export class ToggleCategoriesComponent extends React.Component {
    render() {
        return <View style={globalStyles.viewFlexRowSpaceBetweenfullWidth}>
            <TouchableOpacity activeOpacity={1} onPress={this.props.toggleJournalsCategorie0}>
                <View style={globalStyles.homepage_categoriesButton}>
                    <Text style={this.props.isVisibleMyJournals ? globalStyles.homePage_categoriesLabelBtn : globalStyles.homePage_categoriesLabelBtnDisable}>{this.props.myJournals}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1} onPress={this.props.toggleJournalsCategorie1}>
                <View style={globalStyles.homepage_categoriesButton}>
                    <Text style={this.props.isVisibleOthers ? globalStyles.homePage_categoriesLabelBtn : globalStyles.homePage_categoriesLabelBtnDisable}>{this.props.otherJournals}</Text>
                </View>
            </TouchableOpacity>
        </View>
    }
}

export class DrawerComponent extends React.Component {
    render() {
        return <View style={globalStyles.home_header_div}>
            <View style={globalStyles.home_header_row_div}>
                <TouchableWithoutFeedback onPress={this.props.openDrawer}>
                    <View style={{ padding: 7, width: 45 }}>
                        <Image source={require('../../assets/home_menu_icon.png')} style={globalStyles.home_menu_logo} />
                    </View>
                </TouchableWithoutFeedback>
                <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.home_famulous_logo} />
                <TouchableOpacity activeOpacity={0.8} style={{ marginRight: 10 }} onPress={this.props.modalTrue}>
                    <Image source={require('../../assets/home_plus_icon.png')} style={globalStyles.home_plus_logo} />
                </TouchableOpacity>
            </View>
        </View>
    }
}