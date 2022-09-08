import React from "react";
import { View, Text, ImageBackground, Image, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import FastImage from "react-native-fast-image";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class SingleImageEnable extends React.Component{
    render(){
        return   <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5 }}>
        <View style={{ width: '20%' }}>
        {this.props.isDesc === true ? (
            <FastImage
                style={globalStyles.sorting_ItemImg}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributerUid + "/" + this.props.imgPath,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            ) :                   
             <Image source={require('../../assets/note-pad.png')}  style={globalStyles.sorting_ItemImg}  resizeMode={FastImage.resizeMode.center}/>
    }
        </View>
        <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 10, marginTop: 3, color: 'black' }}>{this.props.by} {this.props.contributorName}</Text>
            <Text style={{ fontSize: 10, color: 'grey', marginTop: 3 }}>{this.props.description}</Text>
            <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{this.props.imageDate}</Text>
            {/* {this.props.fullScreen == true ? (
                <View style={globalStyles.flexRowMargintop5}>
                    <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                    <Text style={globalStyles.journalSortGreyLabel}>{this.props.fullScreenLabel} / {this.props.imgOrientation}</Text>
                </View>
            ) : <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                <Text style={globalStyles.journalSortGreyLabel}>{this.props.imgOrientation}</Text>
            </View>
            } */}
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginRight: 5 }}>
            {this.props.imgDescriptionVisible === true ?
                <TouchableOpacity onPress={()=>this.props.openUpdateDescModal()}>
                    <Image source={require('../../assets/edit.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                : <Image source={require('../../assets/editOff.png')} style={{ width: 25, height: 25 }} />
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <TouchableOpacity onPress={()=>this.props.alertRemove()}>
                <Image source={require('../../assets/delete.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    </View>
    }
}

export class FullScreenImageEnable extends React.Component{
    render(){
        return   <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5 }}>
        <View style={{ width: '20%' }}>
            {this.props.isDesc === true ? (
            <FastImage
                style={globalStyles.sorting_ItemImg_fullScreen}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributerUid + "/" + this.props.imgPath,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
            ) :                   
             <Image source={require('../../assets/note-pad.png')}  style={globalStyles.sorting_ItemImg_fullScreen}  resizeMode={FastImage.resizeMode.center}/>

    }
        </View>
        <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 10, marginTop: 3, color: 'black' }}>{this.props.by} {this.props.contributorName}</Text>
            <Text style={{ fontSize: 10, color: 'grey', marginTop: 3 }}>{this.props.description}</Text>
            <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{this.props.imageDate}</Text>
            {/* {this.props.fullScreen == true ? (
                <View style={globalStyles.flexRowMargintop5}>
                    <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                    <Text style={globalStyles.journalSortGreyLabel}>{this.props.fullScreenLabel} / {this.props.imgOrientation}</Text>
                </View>
            ) : <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                <Text style={globalStyles.journalSortGreyLabel}>{this.props.imgOrientation}</Text>
            </View>
            } */}
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginRight: 5 }}>
            {this.props.imgDescriptionVisible === true ?
                <TouchableOpacity onPress={()=>this.props.openUpdateDescModal()}>
                    <Image source={require('../../assets/edit.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                : <Image source={require('../../assets/editOff.png')} style={{ width: 25, height: 25 }} />
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <TouchableOpacity onPress={()=>this.props.alertRemove()}>
                <Image source={require('../../assets/delete.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    </View>
    }
}


export class SingleImageDisable extends React.Component{
    render(){
        return   <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5, backgroundColor:'grey' }}>
        <View style={{ width: '20%' }}>
            <FastImage
                style={globalStyles.sorting_ItemImg}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributerUid + "/" + this.props.imgPath,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 10, marginTop: 3, color: 'black' }}>{this.props.by} {this.props.contributorName}</Text>
            <Text style={{ fontSize: 10, color: 'grey', marginTop: 3 }}>{this.props.description}</Text>
            <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{this.props.imageDate}</Text>
            {this.props.fullScreen == true ? (
                <View style={globalStyles.flexRowMargintop5}>
                    <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                    <Text style={globalStyles.journalSortGreyLabel}>{this.props.fullScreenLabel} / {this.props.imgOrientation}</Text>
                </View>
            ) : <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                <Text style={globalStyles.journalSortGreyLabel}>{this.props.imgOrientation}</Text>
            </View>
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginRight: 5 }}>
            {this.props.imgDescriptionVisible === true ?
                <TouchableOpacity onPress={()=>this.props.openUpdateDescModal()}>
                    <Image source={require('../../assets/edit.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                : <Image source={require('../../assets/editOff.png')} style={{ width: 25, height: 25 }} />
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <TouchableOpacity onPress={()=>this.props.alertRemove()}>
                <Image source={require('../../assets/delete.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    </View>
    }
}

export class FullScreenImageDisable extends React.Component{
    render(){
        return   <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', margin: 2, borderBottomWidth: 0.5, borderColor: '#D5D5D5', padding: 10, marginBottom: 5, backgroundColor:'grey' }}>
        <View style={{ width: '20%' }}>
            <FastImage
                style={globalStyles.sorting_ItemImg_fullScreen}
                source={{
                    uri: constants.apiIP + "download/byuser/bypath?path=" + this.props.contributerUid + "/" + this.props.imgPath,
                }}
                resizeMode={FastImage.resizeMode.cover}
            />
        </View>
        <View style={{ width: '60%' }}>
            <Text style={{ fontSize: 10, marginTop: 3, color: 'black' }}>{this.props.by} {this.props.contributorName}</Text>
            <Text style={{ fontSize: 10, color: 'grey', marginTop: 3 }}>{this.props.description}</Text>
            <Text style={{ fontSize: 9, color: 'grey', marginTop: 3 }}>{this.props.imageDate}</Text>
            {this.props.fullScreen == true ? (
                <View style={globalStyles.flexRowMargintop5}>
                    <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                    <Text style={globalStyles.journalSortGreyLabel}>{this.props.fullScreenLabel} / {this.props.imgOrientation}</Text>
                </View>
            ) : <View style={{ flexDirection: 'row', marginTop: 3 }}>
                <Image source={require('../../assets/star.png')} style={{ width: 10, height: 10 }} />
                <Text style={globalStyles.journalSortGreyLabel}>{this.props.imgOrientation}</Text>
            </View>
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10, marginRight: 5 }}>
            {this.props.imgDescriptionVisible === true ?
                <TouchableOpacity onPress={()=>this.props.openUpdateDescModal()}>
                    <Image source={require('../../assets/edit.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
                : <Image source={require('../../assets/editOff.png')} style={{ width: 25, height: 25 }} />
            }
        </View>
        <View style={{ width: '10%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <TouchableOpacity onPress={()=>this.props.alertRemove()}>
                <Image source={require('../../assets/delete.png')} style={{ width: 25, height: 25 }} />
            </TouchableOpacity>
        </View>
    </View>
    }
}