import { StyleSheet } from 'react-native';
import { back } from 'react-native/Libraries/Animated/Easing';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    safeAreaContainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    main_Container: {
        flex: 1,
        padding: 10,
        backgroundColor: 'white'
    },
    JournalDetails_main_Container: {
        height: '100%',
        backgroundColor: 'white',
    },
    Welc_image_div: {
        flex: 2,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    Login_image_div: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    CreateAcc_image_div: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    image_WelcomePage: {
        width: '70%',
        height: '70%',
        resizeMode: 'contain'
    },
    image_LoginPage: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    image_ResetPassword: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
        marginTop: 100
    },
    image_CreateAcc: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
        marginTop: 10
    },
    Welc_Midle_div: {
        flex: 2,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Login_Midle_div: {
        flex: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    Welc_Log_footer_div: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20
    },
    CreateAcc_Log_footer_div: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    main_boldText: {
        fontSize: 25
    },
    main_Login_boldText: {
        fontSize: 20,
        marginTop: 15,
        fontWeight: 'bold',
        color: 'black'
    },
    main_Welcome_smallText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'grey',
    },
    howitworks_smallText: {
        fontSize: 14,
        textAlign: 'center',
        color: 'grey',
        width: '90%'
    },
    main_rowdiv: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5
    },
    row_div: {
        display: 'flex',
        flexDirection: 'row',
    },
    row_div_homePage_contributorsDaysLeft: {
        display: 'flex',
        flexDirection: 'row',
        padding: 5
    },
    row_div_homePage_singleView_DaysLeft_Contributors: {
        display: 'flex',
        flexDirection: 'row',

    },
    home_header_row_div: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',

    },
    Welc_Log_button: {
        display: 'flex',
        width: 300,
        backgroundColor: '#5ec6ca',
        padding: 18,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccount_button: {
        display: 'flex',
        width: 300,
        backgroundColor: '#5ec6ca',
        padding: 18,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    contributors_button: {
        display: 'flex',
        width: 180,
        backgroundColor: '#F25278',
        padding: 7,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    resetPassword_button: {
        display: 'flex',
        width: 180,
        backgroundColor: '#5ec6ca',
        padding: 7,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    resetPassword_button_disable: {
        display: 'flex',
        width: 180,
        backgroundColor: '#D3D3D3',
        padding: 7,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50
    },
    Wel_Log_buttonLabel: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
        textAlign: 'center'
    },
    homePage_categoriesLabelBtn: {
        fontSize: 13,
        color: '#E3242B',
        fontWeight: 'bold'
    },
    homePage_categoriesLabelBtnDisable: {
        fontSize: 12,
        color: 'grey',
    },
    login_inputText: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 1,
        padding: 10,
        height: 40
    },
    forgotPassword: {
        marginLeft: 25,
        marginTop: 20,
        color: '#E3242B',
        fontSize: 12
    },
    login_footer_logos: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
        margin: 5
    },
    Welc_Log_redlabel: {
        color: '#E3242B',
        fontSize: 14,
        marginLeft: 5
    },
    home_header_div: {
        flex: 1,
    },
    home_list_div: {
        flex: 8,
    },
    home_menu_logo: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    home_famulous_logo: {
        width: '60%',
        height: 30,
        resizeMode: 'contain'
    },
    home_famulous_logo_Drawer: {
        width: '70%',
        height: 30,
        resizeMode: 'contain',
    },
    home_famulous_logo_Drawer_byDefault: {
        width: '70%',
        height: 80,
        resizeMode: 'contain',
    },
    home_plus_logo: {
        width: 32,
        height: 32,
        resizeMode: 'contain',
    },
    Drawer_close_logo: {
        width: 45,
        height: 45,
        resizeMode: 'contain',
    },
    Drawer_icons: {
        width: 24,
        height: 24,
        resizeMode: 'contain',
    },
    list_item: {
        margin: 10,
        padding: 10,
        height: 180, //220 before
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 25,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        shadowOpacity: 0.6,
        elevation: 8,
    },
    home_listitem_name: {
        color: '#E3242B',
        fontSize: 14
    },
    home_listItem_Contributors_Days: {
        color: 'grey',
        fontSize: 11,
        marginTop: 3
    },
    list_yellow_logo: {
        width: 30,
        height: 30,
        resizeMode: 'contain'
    },
    home_listitem_bulletpoint: {
        color: 'grey',
        fontSize: 12,
        marginTop: 3,
        marginLeft: 10,
        marginRight: 10
    },
    home_listitem_image_sortablegrid: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 80,
        width: 80,
        borderRadius: 3
    },
    home_listitem_image: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 70,
        width: 70,
        borderRadius: 3
    },
    journalDetails_listitem_image: {
        justifyContent: 'flex-end',
        height: 100,
        width: 100,
        margin: 10
    },
    CreateAcc_titleInput: {
        color: 'grey',
        marginLeft: 25,
        marginTop: 12,
        fontSize: 11
    },
    weakpassword_label: {
        color: 'red',
        marginLeft: 10,
        marginTop: 13,
        fontSize: 10
    },
    incorrectPassword: {
        color: 'red',
        marginLeft: 10,
        marginTop: 11,
        fontSize: 10
    },

    home_journalMonth: {
        fontSize: 12,
        color: 'grey',
        marginLeft: 10,
        marginRight: 20
    },
    home_journalMonth_selected: {
        fontSize: 13,
        color: '#E3242B',
        marginLeft: 10,
        marginRight: 20,
        fontWeight: '600'
    },
    journalDetails_Img_background: {
        height: 250,
        resizeMode: 'contain',
        display: 'flex',
        alignItems: 'center'
    },
    journalSettings_Img_background: {
        height: '110%',
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    LinksSharing_Img_background: {
        height: '120%',
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    contributors_Img_background: {
        height: '120%',
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    journalPreview_MainPage_ImgBackground: {
        height: 200,
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    homePage_editionItem_ImgBackground: {
        height: 150,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover',
    },
    bottomNav_Img_background: {
        flex: 1,
        resizeMode: 'contain',

    },
    journalDetails_footer_tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', height: 55,
        justifyContent: 'center',
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        shadowOpacity: 0.4,
        elevation: 20,
        position: 'absolute',
        bottom: 0
    },
    journalDetails_footer_tabs_icons: {
        width: 25,
        height: 25,
    },
    journalDetails_footer_tabs_singleDiv: {
        width: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    journalSettings_next_icon: {
        width: 15,
        height: 15,
        marginLeft: 'auto',
        marginRight: 20
    },
    journalSettings_label: {
        color: 'grey',
        marginLeft: 10,
        fontSize: 14
    },
    journalSettings_lefticon: {
        width: 30,
        height: 30,
        marginLeft: 10
    },
    howitworks_lefticon: {
        width: 30,
        height: 30,
    },
    contributors_footer_tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', height: 140,
        justifyContent: 'center',
        flexDirection: 'column',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        shadowOpacity: 0.26,
        elevation: 8,
    },
    settingsPage_footer_tabs: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white', height: 100,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    settingsPage_button: {
        display: 'flex',
        width: 180,
        backgroundColor: '#F25278',
        padding: 7,
        borderRadius: 30,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsPage_Img_background: {
        height: '115%',
        resizeMode: 'contain',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsPage_titleInput: {
        color: 'grey',
        marginLeft: 25,
        marginTop: 15,
        fontSize: 12
    },
    deleteJournal_confirmationTitle_desc: {
        color: '#E3242B',
        marginLeft: 15,
        marginTop: 30,
        fontSize: 12,
        marginBottom: 5
    },
    deleteJournal_journalNamewithbackground: {
        color: '#E3242B',
        marginLeft: 5,
        marginTop: 2,
        fontSize: 12,
        marginBottom: 5,
        backgroundColor: '#ffcccb', padding: 2
    },
    deleteJournal_confirmationTitle: {
        color: 'grey',
        marginLeft: 15,
        marginTop: 5,
        fontSize: 12,
        marginBottom: 5
    },
    deleteJournal_confirmationTitle2: {
        color: 'grey',
        marginLeft: 5,
        marginTop: 5,
        fontSize: 12,
        marginBottom: 5,
    },
    myProfile_titleInput: {
        color: 'grey',
        marginLeft: 25,
        marginTop: 10,
        fontSize: 11
    },
    settingsPage_inputText: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 37,
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 2,
        padding: 10,
        color: 'black',
        fontSize: 12
    },
    settingsPage_dropdown: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 37,
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 2,
        color: 'black',
        flexDirection: 'row',
    },
    ShippingAddress_header_Pluslogo: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginRight: 30
    },
    ShippingAddress_AllinfoView: {
        flex: 1, marginLeft: 30, marginRight: 30, borderRadius: 10, shadowColor: 'black', marginTop: 20, marginBottom: 20,
        shadowOffset: { width: 0, height: 1 }, shadowRadius: 2,
        shadowOpacity: 0.6, elevation: 4, 
        backgroundColor: 'white',
        padding: 15,
    },
    ShippingAddress_titleInput: {
        color: 'grey',
        marginLeft: 15,
        fontSize: 14,
        marginTop: 20,
    },
    ShippingAddress_titleInput_header: {
        color: 'grey',
        marginLeft: 15,
        fontSize: 14,
        marginTop: 5
    },
    ShippingAddress_inputText: {
        alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, fontSize: 12, color: 'black',
    },
    ShippingAddress_inputText_3sur4: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        width: '65%',
        borderRadius: 5,
        marginLeft: 5,
        marginTop: 10,
        padding: 0,
        color: 'black',
        fontSize: 12,
        height: 35
    },
    ShippingAddress_inputText_street_3sur4: {
        display: 'flex',
        justifyContent: 'center',
        width: '45%',
        alignSelf: 'center',
        height: 35,
        padding: 0,
        alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, fontSize: 12, color: 'black',
    },
    ShippingAddress_inputText_1sur4: {
        display: 'flex',
        justifyContent: 'center',
        width: '44%',
        alignSelf: 'center',
        height: 35,
        padding: 0,
        alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, fontSize: 12, color: 'black',
    },
    ShippingAddress_upload_icon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginTop: 10
    },
    ShippingAddress_Flag_icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    ShippingAddress_search_icon: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        alignSelf: 'center', marginRight: 5
    },
    ShippingAddress_Upload_label: {
        color: 'grey',
        fontSize: 14,
        marginLeft: 10,
        marginTop: 10
    },
    InputwithImage: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        width: '65%',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 10,
        marginTop: 10,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 40
    },
    login_InputwithImage: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
        padding: 0,
    },
    shippingView_textinput: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
        padding: 0
    },
    myprofile_Input: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 1,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35
    },
    payment_Input: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35
    },
    payment_Input3sur4: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
        width: '60%'
    },
    payment_Input1sur4: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 35,
        width: '30%'
    },
    textInputWithIcon: {
        width: 250, alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black'
    },
    textInputSettingJournalName: {
        width: 250, alignSelf: 'center', height: 35, padding: 0, color: 'black'
    },
    textInputWithoutIcon: {
        display: 'flex',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between', width: 300
    },
    phonenumber_InputwithImage: {
        display: 'flex',
        justifyContent: 'center',
        borderColor: 'grey',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 15,
        marginRight: 25,
        marginTop: -10
    },
    InputwithImageFlag: {
        display: 'flex',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 35,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 20,
        color: 'black',
        flexDirection: 'row',
    },
    Preview_div_rect: {
        flex: 1,
        marginTop: 15,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 5,
        height: 500,
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5, shadowOpacity: 0.26, elevation: 8,
    },
    ShippingAddress_delete_icon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginLeft: 'auto',
        bottom: 30,
        left: 15
    },
    imageOverflow_Div: {
        alignItems: 'flex-end',
        backgroundColor: '#0000001a',
        padding: 3
    },
    UploadImage_LinkSharing_Overflow_Div: {
        height: '85%',
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    menuDrawer_Overflow_Div: {
        height: '85%',
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    chat_Overflow_Div: {
        height: '100%',
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    LinksSharing_inputText: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        width: '90%',
        borderColor: '#D5D5D5',
        height: 55,
        borderRadius: 40,
        marginBottom: 20,
        padding: 20,
        fontSize: 16
    },
    uploadImages_imageUploaded: {
        flex: 1.5,
        width: '100%',
        resizeMode: 'contain',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    },
    landscape_fill_div: {
        width: '100%',
        height: '50%',
        backgroundColor: '#AAAAAA',
        marginTop: 'auto'
    },
    portrait_fill_div: {
        width: '50%',
        height: '70%',
        backgroundColor: '#AAAAAA',
        marginTop: 'auto',

    },
    small_fill_div: {
        width: '30%',
        height: '30%',
        backgroundColor: '#AAAAAA',
        marginTop: 'auto'
    },
    imageSize_label: {
        marginTop: 'auto',
        color: 'grey',
        fontSize: 12
    },
    landscape_greyBorder: {
        borderWidth: 2,
        borderColor: '#AAAAAA',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
    },
    landscape_yellowBorder: {
        borderWidth: 2,
        borderColor: '#FFBA01',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        padding: 10,
    },
    portrait_greyBorder: {
        borderWidth: 2,
        borderColor: '#AAAAAA',
        width: 80,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        padding: 10,
    },
    portrait_yellowBorder: {
        borderWidth: 2,
        borderColor: '#FFBA01',
        width: 80,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        padding: 10,
    },
    small_greyBorder: {
        borderWidth: 2,
        borderColor: '#AAAAAA',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        padding: 10,
    },
    small_yellowBorder: {
        borderWidth: 2,
        borderColor: '#FFBA01',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginLeft: 15,
        padding: 10,
    },
    Chat_Overflow_Div: {
        flex: 2.5,
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    chat_touchableStyle: {
        marginLeft: 15
    },
    chat_white_name: {
        textAlign: 'center',
        color: 'white',
        marginTop: 5,
        fontSize: 11
    },
    chat_inputText: {
        display: 'flex',
        borderWidth: 0.5,
        width: '90%',
        borderColor: '#D5D5D5',
        height: 55,
        borderRadius: 40,
        marginBottom: 20,
        padding: 20,
        color: 'black',
        fontSize: 16,
        flexDirection: 'row'

    },
    chatAttach_input_icon: {
        width: 28,
        height: 28,
        alignSelf: 'center'
    },
    chatCamera_input_icon: {
        width: 25,
        height: 25,
        alignSelf: 'center',
        marginRight: 20
    },
    titleFontsItalic: {
        textAlign: 'left', fontFamily: 'Didot-Italic', fontSize: 12
    },
    titleFontsBold: {
        textAlign: 'left', fontFamily: 'Bold Regular', fontSize: 12
    },
    titleFontsArial: {
        textAlign: 'left', fontFamily: 'Arial', fontSize: 12
    },
    calendar_button: {
        display: 'flex',
        width: 100,
        backgroundColor: '#F25278',
        padding: 10,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    drawer_row_item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    drawer_titles: {
        color: 'grey',
        marginLeft: 15,
        fontSize: 13
    },
    drawer_row_div: {
        width: '100%',
        marginTop: 5,
    },
    drawer_sub_menu_icon: {
        width: 20,
        height: 20,
        marginLeft: 20
    },
    myProfile_textInput: {
        width: 300, alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, fontSize: 12, color: 'black'
    },
    payment_textInput: {
        alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black'
    },
    drawerMenu_button: {
        display: 'flex',
        width: 200,
        backgroundColor: '#5ec6ca',
        padding: 7,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    SortingSave_button: {
        display: 'flex',
        width: 200,
        backgroundColor: '#febf2e',
        padding: 7,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homepage_categoriesButton: {
        display: 'flex',
        width: 150,
        backgroundColor: 'white',
        padding: 5,
        borderRadius: 30,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, shadowRadius: 3,
        shadowOpacity: 0.3, elevation: 4,
    },
    purple_default_text: {
        color: '#9b56a2',
        fontSize: 16,
    },
    purple_default_text_calendar: {
        color: '#9b56a2',
        fontSize: 14,
        marginTop: 20
    },
    joinJournal_square_textInput: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 40,
        borderRadius: 5,
        margin: 2,
        width: 40,
        color: 'black',
        fontSize: 14
    },
    howitworks_single_view: {
        width: '100%', marginTop: 20, alignItems: 'center'
    },
    howitworks_single_view_noMargins: {
        width: '100%', alignItems: 'center'
    },
    howitworks_images_style: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    howitworks_footer_greylabels: {
        alignSelf: 'center',
        color: 'grey',
        marginLeft: 5
    },
    howitworks_footerRowDiv: {
        flexDirection: 'row',
        marginTop: 5
    },
    linksharing_input: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 45,
        borderRadius: 20,
        padding: 13,
        width: 300
    },
    chat_input: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 45,
        borderRadius: 20,
        padding: 13,
        width: '70%',
        marginLeft: 10
    },
    menuModal_style: {
        backgroundColor: '#ffffff',
        padding: 5,
        height: '100%',
        alignItems: 'center',
    },
    subscription_itemStyle: {
        flex: 1,
        width: 250,
        padding: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5, shadowOpacity: 0.26, elevation: 8,
        margin: 10,
        borderRadius: 10
    },
    subscription_imageItem_style: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
    },
    payment_singleGreenDiv: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#5ec6ca',
        marginLeft: 20,
        marginRight: 20,
        padding: 6
    },
    payment_singleGreenDiv_column: {
        borderWidth: 1,
        borderColor: '#5ec6ca',
        marginLeft: 20,
        marginRight: 20,
        padding: 15
    },
    payment_singleGreenDiv_total: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#5ec6ca',
        marginLeft: 20,
        marginRight: 20,
        padding: 6,
        backgroundColor: '#5ec6ca'
    },
    payment_inputText: {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 40,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 10
    },
    payment_textInputwithImage: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        color: 'black',
        flexDirection: 'row',
    },
    payment_inputText_3sur4: {
        alignSelf: 'center', height: 35, marginLeft: 10, padding: 0

    },
    payment_inputText_1sur4: {
        display: 'flex',
        width: '34%',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 40,
        borderRadius: 5,
        marginLeft: 5,
        marginTop: 10,
        padding: 10
    },
    payment_InputwithImage: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        height: 37,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        padding: 0,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    payment_creditcard_image: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginRight: 10
    },
    warningicon: {
        width: 12,
        height: 12,
        marginTop: 12,
        marginLeft: 5
    },
    namewarningicon: {
        width: 12,
        height: 12,
        marginTop: 20,
        marginLeft: 5
    },
    login_password_warningicon: {
        width: 12,
        height: 12,
        alignSelf: 'center',
        marginRight: 15,
    },
    login_password_showHidePass: {
        width: 25,
        height: 25,
        alignSelf: 'center',
        marginRight: 15,
    },
    login_password_warningicon_newPassword: {
        width: 12,
        height: 12,
        alignSelf: 'center',
        marginRight: 15,
    },
    login_password_warningicon_Phone: {
        width: 12,
        height: 12,
        alignSelf: 'center',
        marginRight: 10
    },
    side_menu_footer: {
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1,
        shadowOpacity: 0.1,
        elevation: 1
    },
    side_menu_style: {
        flex: 1,
        display: 'flex',
    },
    side_menu_circleImage: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
    },
    side_menu_arrow: {
        width: 15,
        height: 15
    },
    drawer_icon_close: {
        width: 15,
        height: 15
    },
    main_headerDiv_backandtitle: {
        width: '100%', flexDirection: 'row', marginTop: '7%'
    },
    main_headerDiv_titlestyle: {
        color: 'white', fontSize: 20, fontWeight: '600'
    },
    header_globalbackicon: {
        width: 25, height: 25, marginLeft: 20
    },
    journal_upload_item_view_portrait: {
        flex: 1,
        marginTop: 15,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 5,
        height: 350,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#febf2e',
        flexDirection: 'row'
    },
    journal_upload_item_view_portraitFullScreen: {
        flex: 1,
        marginTop: 15,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 5,
        height: 480,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#febf2e',
    },
    portrait_width50: {
        width: '55%',
    },

    portrait_width100: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 1, shadowOpacity: 0.1, elevation: 1,
    },
    portrait_width100_preview: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    portrait_2ndView50: {
        width: '45%', marginLeft: 20
    },
    portrait_closeView: {
        marginTop: 10, alignItems: 'flex-end', width: '80%'
    },
    portrait_description: {
        marginTop: 15, width: '80%'
    },
    portrait_image_style: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    journal_upload_item_view_landscape: {
        flex: 1,
        marginTop: 15,
        marginRight: 20,
        marginLeft: 20,
        marginBottom: 5,
        height: 350,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#febf2e',
    },
    landscape_width50: {
        width: '100%',
        height: 220,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    landscape_width50_column_withoutDesc: {
        width: '100%',
        height: 220,
    },
    landscape_width100: {
        width: '75%',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 }, shadowRadius: 2,
        shadowOpacity: 0.1, elevation: 1,
    },
    landscape_width100_preview: {
        width: '75%',
    },
    landscape_width100_preview_withoutDesc: {
        width: 300,
    },
    landscape_image_style: {
        width: '100%',
        height: '85%',
        resizeMode: 'contain',
        marginTop: 10
    },
    landscape_closeView: {
        alignItems: 'flex-end', marginRight: 15,
    },
    landscape_rightView: {
        marginTop: 10, width: '20%'
    },
    landscape_description: {
        width: '100%',
        marginLeft: 5,
        marginTop: 10
    },
    landscape_description_preview: {
        width: '100%',
        marginTop: -48
    },
    journal_text_styles: {
        fontSize: 9,
        color: '#222222'
    },
    journal_text_styles_description_grey: {
        fontSize: 9,
        color: 'grey'
    },
    journal_text_styles_date: {
        fontSize: 9,
        color: '#222222',
        marginTop: 5
    },
    journal_text_styles_date_preview: {
        fontSize: 9,
        color: '#222222',
        marginTop: 5
    },
    journal_text_styles_date_preview_fullScreen: {
        fontSize: 9,
        color: '#222222',
    },
    JournalPreview_pageStyle: {
        alignSelf: 'center',
        width: '90%',
        height: 550,
        padding: 30,
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5, shadowOpacity: 0.26, elevation: 3,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10
    },
    JournalPreview_pageStyle_MainPage: {
        alignSelf: 'center',
        width: '90%',
        height: 550,
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5, shadowOpacity: 0.26, elevation: 3,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10
    },
    JournalPreview_pageStyle_FooterPage: {
        alignSelf: 'center',
        width: '90%',
        height: 550,
        alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 5, shadowOpacity: 0.26, elevation: 3,
        borderRadius: 5,
        marginTop: 15,
        marginBottom: 10
    },
    journal_upload_item_view_portrait_50pourcent: {
        height: '47%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#febf2e',
        flexDirection: 'row', margin: 2
    },
    journal_upload_item_view_portrait_50pourcent_withoutborder: {
        height: '47%',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    journal_upload_item_view_landscape_50pourcent: {
        height: '47%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#5ec6ca',
        marginBottom: 5,
        marginTop: 5
    },
    journal_upload_item_view_landscape_50pourcent_withoutborder: {
        height: '47%',
        backgroundColor: 'white',
        marginBottom: 5,
        marginTop: 5,
    },
    JournalPreview_main_Container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    JournalPreview_famulous_logo: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    JournalPreview_famulous_logo_MainPage: {
        width: 100,
        height: 100,
        resizeMode: 'contain',
    },
    upload_button_style: {
        display: 'flex',
        width: 120,
        height: 40,
        backgroundColor: '#5ec6ca',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    upload_button_style_disable: {
        display: 'flex',
        width: 120,
        height: 40,
        backgroundColor: '#D3D3D3',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'flex-start',
        marginLeft: 20
    },
    addevent_button_style: {
        display: 'flex',
        width: 120,
        height: 35,
        backgroundColor: '#9b56a2',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        alignSelf: 'flex-end',
    },
    addJournal_button_style: {
        display: 'flex',
        width: 120,
        height: 35,
        backgroundColor: '#5ec6ca',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        alignSelf: 'flex-end',
    },
    changeDesc_button_style: {
        display: 'flex',
        width: 120,
        height: 35,
        backgroundColor: '#febf2e',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    deleteJournal_button_style: {
        display: 'flex',
        width: 120,
        height: 35,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'flex-end',
        backgroundColor: '#F25278',
    },
    backArrow: { width: 25, height: 25, marginLeft: 10 },
    sorting_ItemImg: {
        width: 60, height: 60, borderRadius: 2
    },
    sorting_ItemImg_fullScreen: {
        width: 60, height: 90, borderRadius: 2
    },
    JournalSorting_main_Container: {
        flex: 1,
        width: '100%',
        marginTop: 20
    },
    journalSorting_text_styles: {
        fontSize: 10,
        color: 'grey',
    },
    sorting_header: {
        flexDirection: 'row',
        padding: 10, backgroundColor: 'white', shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 }, shadowRadius: 1,
        shadowOpacity: 0.1, elevation: 3,
    },
    JournalDetails_header: {
        width: '100%',
        flexDirection: 'row',
        padding: 15, backgroundColor: 'white', shadowColor: 'black',
        shadowOffset: { width: 0, height: 1 }, shadowRadius: 1,
        shadowOpacity: 0.1, elevation: 3,
    },
    calendarModal_textInput: {
        width: 320, alignSelf: 'center', height: 37, fontSize: 12, color: 'black'
    },
    DeleteJournalModal_textInput: {
        width: '100%', alignSelf: 'center', height: 37, fontSize: 12, color: 'black'
    },
    calendarModal_InputView: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 1,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 37,
    },
    changeDescModal_InputView: {
        display: 'flex',
        justifyContent: 'center',
        borderWidth: 0.5,
        borderColor: '#D5D5D5',
        borderRadius: 5,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 50,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 37,
    },
    placeholder_image_style: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    createAccount_uploadRoundedImage: {
        width: 100,
        height: 100,
        borderRadius: 100 / 2,
        alignSelf: 'center'
    },
    coverImage_uploadRoundedImage: {
        width: 80,
        height: 80,
        borderRadius: 80 / 2,
        alignSelf: 'center',
        marginTop: -20
    },
    createAccount_profileImage: {
        backgroundColor: 'white', width: 100, height: 100, borderRadius: 100 / 2,
        marginTop: 10, alignItems: 'center', justifyContent: 'center'
    },
    imageLayouts_mainDiv: {
        flex: 1, width: 120, height: 120, padding: 5, alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8, shadowOpacity: 0.6, elevation: 3,
        margin: 20,
        borderRadius: 2, flexDirection: 'row'
    },
    imageLayout_landscapeWithDesc: {
        flex: 1, width: 120, height: 120, padding: 5, alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8, shadowOpacity: 0.6, elevation: 3,
        margin: 20,
        borderRadius: 2,
        justifyContent: 'center', alignItems: 'center'
    },
    imageLayout_landscapeWithDesc_Selected: {
        flex: 1, width: 120, height: 120, padding: 5, alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, 
        shadowRadius: 4, shadowOpacity: 0.1, elevation: 2,
        margin: 20,
        borderRadius: 2,
        justifyContent: 'center', alignItems: 'center',
        borderColor: '#febf2e',
        borderWidth: 1
    },
    imageLayouts_mainDiv_Selected: {
        flex: 1, width: 120, height: 120, padding: 5, alignItems: 'center',
        backgroundColor: 'white',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 4, shadowOpacity: 0.1, elevation: 2,
        margin: 20,
        borderRadius: 2, flexDirection: 'row',
        borderColor: '#febf2e',
        borderWidth: 1
    },

    journalDetails_imageFullScreen_div: {
        width: '75%',
        height: 395,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        alignSelf: 'center',
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, shadowRadius: 2,
        shadowOpacity: 0.1, elevation: 1, marginTop: 10
    },
    journalDetails_PortraitImageFullScreen_divDesc: {
        width: '75%', 
        height: 360, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white', 
        alignSelf: 'center', 
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 }, 
        shadowRadius: 2, shadowOpacity: 0.1, elevation: 1, marginTop: 10
    },

    journalDetails_LandscapeImageFullScreen_divDesc: {
        width: '95%', 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'white',
        alignSelf: 'center', 
        shadowColor: 'black', shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2, shadowOpacity: 0.1, elevation: 1, margin: 10
    },

    journal_Preview_portraitFullScreen: {
        height: '100%',
    },
    journal_details_userprifile_rounded: {
        width: 48, height: 48, borderRadius: 48 / 2
    },
    journalDetails_ViewUserandDateMargins: {
        marginTop: 15, marginLeft: 3
    },
    journalDetails_prev_sort_btn: {
        marginLeft: 20, color: '#9b56a2', fontWeight: 'bold', padding: 5
    },
    calendarRight_FixIcon: {
        alignSelf: 'flex-end', position: 'absolute', bottom: 25, right: 25
    },
    noInternetConnectionLabelStyle: {
        fontSize: 12, marginLeft: 20, color: 'black'
    },
    modalDivstyle: {
        backgroundColor: '#000000aa', flex: 1, display: 'flex', justifyContent: 'flex-end'
    },
    modalSubDivstyle: {
        backgroundColor: '#ffffff', padding: 5, height: '10%', borderRadius: 10, alignItems: 'center', marginBottom: 50, marginLeft: 10, marginRight: 10
    },
    modalSubDivstyle2: {
        flex: 1, width: '100%', justifyContent: 'center', padding: 10, alignItems: 'center'
    },
    modalSubDivstyle3: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%'
    },
    viewRowAlignCenter: {
        flexDirection: 'row', alignItems: 'center'
    },
    noInternetIcon: {
        width: 30, height: 30, marginLeft: 10
    },
    noInternetIconwidth60: {
        width: 60, height: 60, marginBottom: 30
    },
    refreshLabelStyle: {
        fontSize: 14, fontWeight: 'bold', color: '#5ec6ca', marginRight: 20
    },
    alignItemsCenter: {
        alignItems: 'center'
    },
    modalViewCenter: {
        flex: 1, width: '100%', justifyContent: 'center', padding: 10,alignItems:'center'
    },
    
    marginTopAuto: {
        marginTop: 'auto'
    },
    checkEmptyResultFlexAlignCenter: {
        flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5'
    },
    blackBoldLabel: {
        marginBottom: 10, fontSize: 16, fontWeight: 'bold', color: 'black'
    },
    flexWithBackgroundWhite: {
        flex: 1, backgroundColor: 'white'
    },
    textColorGrey: {
        color: 'grey'
    },
    monthYearLabel: {
        color: 'white', fontWeight: 'bold', fontSize: 12
    },
    monthYearView: {
        backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '40%', marginTop: 'auto', top: 12, borderRadius: 5
    },
    safeAreaViewFlexCenterbackgroundWhite: {
        flex: 1, justifyContent: 'center', backgroundColor: 'white'
    },
    shareKeyModalMainView: {
        backgroundColor: '#ffffff', padding: 5, height: '40%', borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'center', alignItems: 'center'
    },
    greyTextFont16: {
        color: 'grey', fontSize: 16
    },
    greyTextFont14: {
        textAlign: 'center', color: 'grey', fontSize: 14
    },
    purpleKeyTextFont24: {
        color: '#9b56a2', fontSize: 24
    },
    viewFlexRowSpaceBetweenfullWidth: {
        flexDirection: 'row', width: '100%', justifyContent: 'space-between'
    },
    viewHorizontalListJouranal: {
        justifyContent: 'center', height: 50, backgroundColor: '#F5F5F5', marginTop: 10, borderRadius: 5
    },
    viewSubmitButton: {
        left: 0, right: 0, bottom: 0, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 15
    },
    viewLoginButton: {
        left: 0, right: 0, bottom: 0, height: 100, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 50
    },
    imageViewFlexFullWidthAlignCenter: {
        width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'
    },
    detailsImagestyle: {
        width: '100%', height: '100%', resizeMode: 'contain'
    },
    viewWidth60left10: {
        width: 60, marginLeft: 10
    },
    detailsSmalllRoundedImage: {
        width: 15, height: 15, borderRadius: 15 / 2
    },
    detailsJaneDoeStyle:{
         fontSize: 5, color: '#222222' 
    },
    detailsJaneDoeMarginLeftStyle:{
         fontSize: 5, color: '#222222', marginLeft: 5 
   },
    detailsJaneDoeDateStyle:{
         fontSize: 5, color: '#222222', marginTop: 1 
    },
    detailsJaneDoeDateStyleRow:{
         fontSize: 5, color: '#222222', marginTop: 1, marginLeft: 5 
    },
    detailsUserDateView:{
         flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 1 
    },
    detailsViewSmalllayoutDescriptionPortrait:{
         width: '80%', marginTop: 5 
    },
    loremTextPortrait:{
         height: 30, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 5, color: 'grey', textAlignVertical: 'top', width: 35 
    },
    loremTextLandscape:{
         height: 30, alignItems: 'flex-start', justifyContent: 'flex-start', width: 'auto', fontSize: 5, color: 'grey', textAlignVertical: 'top', width: '100%'   
    },
    loremTextPortraitFull:{
         fontSize: 5, color: 'grey' 
    },
    loremTextLandscapeView:{
         marginTop: 1, width: '95%', marginRight: 'auto' 
    },
    viewWidth60:{
         width: 60 
    },
    viewWidth100:{
         width: '100%' 
    },
    detailsYellowFullScreenLabel:{
         fontSize: 7, color: '#febf2e', marginTop: -12, fontWeight: 'bold' 
    },
    viewWidth100FlexRow:{
         width: '100%', flexDirection: 'row' 
    },
    viewMarginTop5:{
         marginTop: 5 
    },
    spinnerTextStyle:{
         fontSize: 12, color: 'white' 
    },
    detailsCurrentDateStyle:{
         fontSize: 9, color: '#222222' 
    },
    detailsSelectedmonthTitle:{
         fontSize: 16, color: '#5ec6ca', fontStyle:'italic' 
    },
    detailsSelectedJournalNameTitle:{
         fontSize: 22, fontStyle: 'italic', color: '#9b56a2',textAlign:'center' 
    },
    detailsHeaderMiddleView:{
         width: '60%', alignItems: 'center' 
    },
    detailsSettingsIcon:{
         width: 26, height: 26, marginRight: 20 
    },
    detailsHeaderRightView:{
         width: '20%', alignItems: 'flex-end', height: 40, justifyContent: 'center' 
    },
    detailsLeftArrowIcon:{
         width: 80, height: 40, justifyContent: 'center' 
    },
    detailsHeaderLeftView:{
         width: '20%', alignItems: 'flex-start' 
    },
    detailsCalendarIcon:{
        width: 25, height: 25, alignSelf: 'center'
    },
    viewFlex1:{
         flex: 1 
    },
    titlesMarginLeft10:{
         marginLeft: 10 
    },
    titlesMarginLeft15:{
         marginLeft: 15 
    },
    mainFlexbackgroundYellow:{ 
        flex: 1, backgroundColor: '#febf2e' },
    
    subHeaderViewbackgroundYellow:{
         width: '100%', alignItems: 'center', display: 'flex', flexDirection: 'row' 
    },
    headerGlobalLeftRightView:{
         width: '15%', justifyContent: 'center', alignItems: 'center' 
    },
    headerGlobalMiddleView:{
         width: '70%', justifyContent: 'center', alignItems: 'center' },

    viewHeight15AlignCenter:{ 
        height: '15%', alignItems: 'center' },

    contributorListItemMainView:{
        flex: 1, flexDirection: 'row', padding: 20, alignItems: 'center'
    }, 
    contributorListImageRounded:{
        width: 60, height: 60, borderRadius: 60 / 2 
    },
    contributorListUserName:{
        marginLeft: 20, color: 'grey', fontSize: 12
    },
    contributorListIsAdminLabel:{
        color: '#F25278', marginLeft: 'auto', marginRight: 10, fontSize: 12 
    },
    contributorListIsnotAdmin:{
        color: '#F25278', marginLeft: 'auto', marginRight: 10, fontSize: 12, marginTop: 10
    },
    settingsEditJournalProfileLabel:{
         color: 'grey', fontSize: 14, alignSelf: 'center', marginTop: 15 
    },
    settingsSubmitLabel:{
        color: 'green', fontSize: 18, alignSelf: 'center', marginTop: 10
    },
    settingJournalInput:{
        width: '90%', alignSelf: 'center', height: 35, marginLeft: 10, padding: 0, color: 'black' 
    },
    viewRowFullwidthCenter:{ 
        flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' 
    },
    settingDeleteBtnViewStyle:{
         left: 0, right: 0, bottom: 0, height: 70, justifyContent: 'center', alignItems: 'center' 
    },
    settingsModalView:{
         backgroundColor: '#ffffff', padding: 5, height: '40%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center'
    },
    flexRow:{
         flexDirection: 'row' 
    },
    shippingSaveLabel:{
         color: '#F25278', fontSize: 16, marginTop: 10, fontWeight: '600', textAlign: 'center' 
    },
    calendarMainModalView:{ 
        backgroundColor: '#ffffff', padding: 5, height: '30%', borderTopLeftRadius: 30, borderTopRightRadius: 30, alignItems: 'center' 
    },
    calendarMainModalView2:{
        flex: 1, width: '100%', justifyContent: 'center', padding: 10, marginTop: 30 ,alignItems:'center'
    },
    viewFlexRowCenterWithMargin:{
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', margin: 10
    },
    imageRounded40:{ 
        width: 40, height: 40, borderRadius: 40 / 2 
    },
    purpleBoldLable:{
         color: '#9b56a2', fontWeight: '600', fontSize: 12 
    },
    viewWidthHeigth100:{
         width: '100%', height: '100%' 
    },
    labelWhiteBold:{
         color: 'white', fontWeight: 'bold' 
    },
    previewCoverView:{
         backgroundColor: '#5ec6ca', padding: 5, justifyContent: 'center', alignItems: 'center', width: '60%', marginTop: 'auto', top: 15, borderRadius: 5 
    },
    previewSinglePageFooterView:{
        width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30, position: 'absolute', bottom: 15 
    },
    previewFooterPageItemListView:{
        width: 250, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 30, position: 'absolute', bottom: 15
    },
    flexRowMargintop5:{
         flexDirection: 'row', marginTop: 5 
    },
    journalSortGreyLabel:{
        fontSize: 9, color: 'grey', marginLeft: 3 
    }

})