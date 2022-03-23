import React from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, TextInput } from "react-native";
import FastImage from "react-native-fast-image";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class PortraitDescComponent extends React.Component{
    render(){
        return <View style={globalStyles.journal_upload_item_view_portrait_50pourcent_withoutborder}>
        <View style={globalStyles.portrait_width50}>
            <View style={globalStyles.portrait_width100_preview}>
                <FastImage
                    style={{ width: '100%', height: '100%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
        </View>
        <View style={globalStyles.portrait_2ndView50}>
            <View style={globalStyles.portrait_closeView}>
            </View>
            <View>
                <FastImage
                    style={globalStyles.imageRounded40}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={{ marginTop: 15 }}>
                <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
                <Text style={globalStyles.journal_text_styles_date_preview}>{this.props.formattedDate1}</Text>
            </View>
            <View style={globalStyles.portrait_description}>
                <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
            </View>
        </View>
    </View>
    }
}