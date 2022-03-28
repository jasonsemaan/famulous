import React from "react";
import { View, Text, SafeAreaView, Image, TouchableOpacity, Modal } from "react-native";
import { globalStyles } from '../../03-constants/global';
import { constants } from "../../03-constants/Constants";

export class ModalConnection extends React.Component{
    render(){
        return  <Modal transparent={true} visible={this.props.visible}>
        <TouchableOpacity activeOpacity={1} style={globalStyles.viewFlex1}>
            <View style={globalStyles.modalDivstyle}>
                <View style={globalStyles.modalSubDivstyle}>
                    <View style={globalStyles.modalSubDivstyle2}>
                        <View style={globalStyles.modalSubDivstyle3}>
                            <View style={globalStyles.viewRowAlignCenter}>
                                <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIcon}/>
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

export class NoInternetConnection extends React.Component{
    render(){
        return  <SafeAreaView style={globalStyles.flexWithBackgroundWhite}>
        <View style={globalStyles.checkEmptyResultFlexAlignCenter}>
            <Image source={require('../../assets/no-internet.png')} style={globalStyles.noInternetIconwidth60} />
            <Text style={globalStyles.blackBoldLabel}>{this.props.noInternetConnection}</Text>
            <Text style={globalStyles.textColorGrey}>{this.props.checkyourconnection}</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={this.props.checkConnection}>
                <View style={globalStyles.resetPassword_button}>
                    <Text style={globalStyles.Wel_Log_buttonLabel}>{this.props.refresh}</Text>
                </View>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    }
}
