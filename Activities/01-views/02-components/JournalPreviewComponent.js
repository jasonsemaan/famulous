import React from "react";
import { View, Text, ImageBackground, Image } from "react-native";
import FastImage from "react-native-fast-image";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class PortraitDescComponentTop extends React.Component{
    render(){
        return <View style={globalStyles.journal_upload_item_view_portrait_50pourcent_withoutborder}>
        <View style={globalStyles.portrait_width50}>
            <View style={globalStyles.portrait_width100_preview}>
                <FastImage
                    style={globalStyles.viewWidthHeigth100}
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
                <Text style={globalStyles.journal_text_styles_date_preview}>{this.props.formattedDate}</Text>
            </View>
            <View style={globalStyles.portrait_description}>
                <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
            </View>
        </View>
    </View>
    }
}

export class LandscapeDescComponentTop extends React.Component{
    render(){
        return  <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
        <View style={globalStyles.landscape_width50}>
            <View style={globalStyles.landscape_width100_preview}>
                <FastImage
                    style={{ width: '100%', height: '70%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={globalStyles.landscape_rightView}>
                <View style={globalStyles.landscape_closeView}>
                </View>
                <View style={{ marginTop: 40 }}>
                    <FastImage
                        style={globalStyles.imageRounded40}
                        source={{
                            uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={{ marginTop: 15, alignSelf: 'center' }}>
                    <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
                    <Text style={globalStyles.journal_text_styles_date_preview}>{this.props.formattedDate}</Text>
                </View>
            </View>
        </View>
        <View style={globalStyles.landscape_description_preview}>
            <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
        </View>
    </View>
    }
}

export class LandscapeNoDescComponentTop extends React.Component{
    render(){
        return <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
        <View style={globalStyles.landscape_width50_column_withoutDesc}>
            <View style={globalStyles.landscape_width100_preview_withoutDesc}>
                <FastImage
                    style={{ width: '100%', height: '85%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', bottom: 45 }}>
            <View>
                <FastImage
                    style={globalStyles.imageRounded40}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={globalStyles.titlesMarginLeft10}>
                <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
            </View>
            <View style={globalStyles.titlesMarginLeft15}>
                <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{this.props.formattedDate}</Text>
            </View>
        </View>
    </View>
    }
}

export class PortraitDescComponentBottom extends React.Component{
    render(){
        return   <View style={globalStyles.journal_upload_item_view_portrait_50pourcent_withoutborder}>
        <View style={globalStyles.portrait_width50}>
            <View style={globalStyles.portrait_width100_preview}>
                <FastImage
                    style={{ width: '100%', height: 230, top: 70 }}
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
                <Text style={globalStyles.journal_text_styles_date_preview}>{this.props.formattedDate}</Text>
            </View>
            <View style={globalStyles.portrait_description}>
                <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
            </View>
        </View>
    </View>
    }
}

export class LandscapeDescComponentBottom extends React.Component{
    render(){
        return <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
        <View style={globalStyles.landscape_width50}>
            <View style={globalStyles.landscape_width100_preview}>
                <FastImage
                    style={{ width: '100%', height: '70%', marginTop: 10 }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={globalStyles.landscape_rightView}>
                <View style={globalStyles.landscape_closeView}>
                </View>
                <View style={{ marginTop: 40 }}>
                    <FastImage
                        style={globalStyles.imageRounded40}
                        source={{
                            uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={{ marginTop: 15, alignSelf: 'center' }}>
                    <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
                    <Text style={globalStyles.journal_text_styles_date_preview}>{this.props.formattedDate}</Text>
                </View>
            </View>
        </View>
        <View style={globalStyles.landscape_description_preview}>
            <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
        </View>
    </View>
    }
}

export class LandscapeNoDescComponentBottom extends React.Component{
    render(){
        return  <View style={globalStyles.journal_upload_item_view_landscape_50pourcent_withoutborder}>
        <View style={globalStyles.landscape_width50_column_withoutDesc}>
            <View style={globalStyles.landscape_width100_preview_withoutDesc}>
                <FastImage
                    style={{ width: '100%', height: '85%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>

        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', bottom: 45 }}>
            <View>
                <FastImage
                    style={globalStyles.imageRounded40}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={globalStyles.titlesMarginLeft10}>
                <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
            </View>
            <View style={globalStyles.titlesMarginLeft15}>
                <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{this.props.formattedDate}</Text>
            </View>
        </View>
    </View>
    }
}

export class PortraitFullNoDescComponent extends React.Component{
    render(){
        return  <View style={{ width: '100%', height: '97%' }}>
        <View style={globalStyles.journal_Preview_portraitFullScreen}>
            <View style={{ height: 500 }}>
                <FastImage
                    style={{ width: '100%', height: '82%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID  + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 75 }}>
                <View >
                    <FastImage
                        style={globalStyles.imageRounded40}
                        source={{
                            uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID  + "/" + this.props.profilePhotoPath,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={globalStyles.titlesMarginLeft10}>
                    <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
                </View>
                <View style={globalStyles.titlesMarginLeft10}>
                    <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{this.props.formattedDate}</Text>
                </View>
            </View>
        </View>
    </View>
    }
}

export class PortraitFullDescComponent extends React.Component{
    render(){
        return  <View style={{ width: '100%', height: '97%' }}>
        <View style={globalStyles.journal_Preview_portraitFullScreen}>
            <View style={{ height: 500 }}>
                <FastImage
                    style={{ width: '100%', height: '75%' }}
                    source={{
                        uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.ImgPath,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 110 }}>
                <Text style={globalStyles.journal_text_styles_description_grey}>{this.props.imgDescription}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', bottom: 85 }}>
                <View>
                    <FastImage
                        style={globalStyles.imageRounded40}
                        source={{
                            uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributorUID + "/" + this.props.profilePhotoPath,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                </View>
                <View style={globalStyles.titlesMarginLeft10}>
                    <Text style={globalStyles.journal_text_styles}>{this.props.UserName}</Text>
                </View>
                <View style={globalStyles.titlesMarginLeft10}>
                    <Text style={globalStyles.journal_text_styles_date_preview_fullScreen}>{this.props.formattedDate}</Text>
                </View>
            </View>
        </View>
    </View>
    }
}

export class ImageBackgroundDefault extends React.Component{
    render(){
        return  <ImageBackground style={globalStyles.journalPreview_MainPage_ImgBackground} source={require('../../assets/defaultCover.jpg')}>
        <View style={globalStyles.previewCoverView}>
            <Text style={globalStyles.labelWhiteBold}>{this.props.selectedMonthYear}</Text>
        </View>
    </ImageBackground>
    }
}

export class ImageBackgroundCover extends React.Component{
    render(){
        return  <ImageBackground style={globalStyles.journalPreview_MainPage_ImgBackground} source={{ uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.admin + "/" + this.props.coverImage }}>
        <View style={globalStyles.previewCoverView}>
            <Text style={globalStyles.labelWhiteBold}>{this.props.selectedMonthYear}</Text>
        </View>
    </ImageBackground>
    }
}

export class SinglePageFooterComponent extends React.Component{
    render(){
        return  <View style={globalStyles.previewSinglePageFooterView}>
        <Text style={globalStyles.purpleBoldLable}>{this.props.journalName}</Text>
        <Text style={globalStyles.purpleBoldLable}>{this.props.pageNb}</Text>
        <View>
            <Image source={require('../../assets/famulous_logo.png')} style={globalStyles.JournalPreview_famulous_logo}/>
        </View>
    </View>
    }
}

export class PreviewFooterListItem extends React.Component{
    render(){
        return  <View style={{ marginTop: 10, width: '50%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
            <FastImage
                style={globalStyles.imageRounded40}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.ownerUid + "/profile.jpg",
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={{ fontSize: 10, color: 'black', marginRight: 20, marginLeft: 10 }}>{this.props.UserName}</Text>
        </View>
    </View>
    }
}