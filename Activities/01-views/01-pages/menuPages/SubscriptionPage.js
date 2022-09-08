import React, { useEffect, useState, useContext } from "react";
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity, FlatList} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { globalStyles } from "../../../03-constants/global";
import { strings } from "../../../../App";
import { JournalContext } from "../../04-context/Context";

var jsonData = [
    { id: 1, name: "Me", admin: true },
    { id: 2, name: "Jane Doe", admin: false },
    { id: 3, name: "Jhon Doe", admin: false },

]

const SubscriptionPage = ({ navigation }) => {
    const myContext = useContext(JournalContext);
    let [contextAppLanguage, setContextAppLanguage] = useState(myContext.appLanguage)

     //Labels
     let [subscription, setSubscription] = useState("Subscription");
     let [subscribe_to_a_plan, setSubscribeToaPlan] = useState("Subscribe to a plan and invite a friend to subscribe too and get a unique code that gives you both a discount on Famulous");
     let [you_will_get_the_code, setYouWillGetTheCode] = useState("You will get the code after subscribing");
     let [choose_a_plan, setChooseAPlan] = useState("Choose a plan");
     let [monthlybundle, setMonthlyBundle] = useState("monthly Bundle 1");
     let [price_per_month, setPricePerMonth] = useState("Price per month");
     let [subscription_for_journal, setSubscriptionFroJournal] = useState("Subscription for 1 Journal");
     let [submit, setSubmit] = useState("Submit");


    /** get params from async storage */ 
     const getAsyncStorageData = () => {
        try {
            strings.setLanguage(contextAppLanguage)
            setSubscription(strings.subscription)
            setSubscribeToaPlan(strings.subscribeTo_a_Plan)
            setYouWillGetTheCode(strings.youWillgetTheCode)
            setChooseAPlan(strings.choose_a_plan)
            setMonthlyBundle(strings.monthlybundle)
            setPricePerMonth(strings.price_per_month)
            setSubscriptionFroJournal(strings.subscription_for_1_journal)
            setSubmit(strings.submit)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        getAsyncStorageData();
        return () => {
        }
    }, [])

    /** render the horizontal flatlist items view  */ 
    let _renderItem = ({ item }) => {
        return (
            <View style={globalStyles.subscription_itemStyle}>
                <Image source={require('../../../assets/howitworks_img4.png')} style={globalStyles.subscription_imageItem_style}/>
                <View style={{ flex: 1, width: '100%', borderWidth: 1, borderColor: '#5ec6ca', borderRadius: 10, margin: 5, justifyContent: 'center', alignItems: 'center', padding: 10 }}>
                    <Text style={{ color: '#9b56a2', marginTop: 15, fontSize: 14 }}>{monthlybundle}</Text>
                    <Text style={{ fontSize: 16, marginTop: 10 }}>$14.99</Text>
                    <Text style={{ color: 'grey', textAlign: 'center', fontSize: 12, marginTop: 10 }}>{price_per_month}</Text>
                    <Text style={{ color: 'grey', textAlign: 'center', fontSize: 12, marginBottom:5 }}>{subscription_for_journal}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={globalStyles.JournalDetails_main_Container}>
            <View style={globalStyles.mainFlexbackgroundYellow}>
                <View style={globalStyles.viewHeight15AlignCenter}>
                    <View style={globalStyles.main_headerDiv_backandtitle}>
                        <View style={globalStyles.subHeaderViewbackgroundYellow}>
                            <View style={globalStyles.headerGlobalLeftRightView}>
                                <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('Root')}>
                                    <View style={{ padding: 10 }}>
                                        <Image style={globalStyles.backArrow2} source={require('../../../assets/back-icon.png')} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={globalStyles.headerGlobalMiddleView}>
                                <Text style={globalStyles.main_headerDiv_titlestyle2}>{subscription}</Text>
                            </View>
                            <View style={globalStyles.headerGlobalLeftRightView}></View>
                        </View>
                    </View>

                </View>
                <View style={globalStyles.menuDrawer_Overflow_Div}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginTop: 10, alignItems: 'center', borderBottomColor: '#5ec6ca', borderBottomWidth: 1, marginRight: 20, marginLeft: 20, padding: 20 }}>
                            <Text style={{ color: '#9b56a2', textAlign: 'center', fontSize: 14 }}>
                               {subscribe_to_a_plan}
                            </Text>
                            <Text style={{ color: 'grey', marginTop: 15, fontSize: 10 }}>{you_will_get_the_code}</Text>
                        </View>
                        <Text style={{ color: '#9b56a2', marginTop: 15, fontSize: 14, marginLeft: 40 }}>{choose_a_plan}</Text>
                        <SafeAreaView style={{ flex: 1, height: 300, justifyContent: 'center', backgroundColor: 'white', marginTop: 10 }}>
                            <FlatList showsHorizontalScrollIndicator={false} data={jsonData} renderItem={_renderItem} horizontal={true} />
                        </SafeAreaView>
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate('DeliveryPage')}>
                                <View style={globalStyles.drawerMenu_button}>
                                    <Text style={globalStyles.Wel_Log_buttonLabel}>{submit}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

})

export default SubscriptionPage;