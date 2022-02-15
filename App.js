import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import WelcomePage from './01-app/01-views/01-pages/WelcomePage';
import CreateAccountPage from './01-app/01-views/01-pages/CreateAccountPage';
import LoginPage from './01-app/01-views/01-pages/LoginPage';
import HomePage from './01-app/01-views/01-pages/HomePage';
import JournalDetails from './01-app/01-views/01-pages/JournalDetails';
import JournalSettings from './01-app/01-views/01-pages/01-settings/JournalSettings';
import Contributors from './01-app/01-views/01-pages/01-settings/Contributors';
import SettingsPage from './01-app/01-views/01-pages/01-settings/SettingsPage';
import NotificationsPage from './01-app/01-views/01-pages/01-settings/NotificationsPage';
import PreviewPage from './01-app/01-views/01-pages/01-settings/PreviewPage';
import ShippingAddressPage from './01-app/01-views/01-pages/01-settings/ShippingAddressPage';
import LinksSharingPage from './01-app/01-views/01-pages/02-JournalFooterPages/LinksSharingPage';
import UploadImagesPage from './01-app/01-views/01-pages/02-JournalFooterPages/UploadImagesPage';
import ChatPage from './01-app/01-views/01-pages/02-JournalFooterPages/ChatPage';
import CalendarPage from './01-app/01-views/01-pages/02-JournalFooterPages/CalendarPage';
import MyProfilePage from './01-app/01-views/01-pages/menuPages/MyProfilePage';
import JoinJournalsPage from './01-app/01-views/01-pages/menuPages/JoinJournalsPage';
import SubscriptionPage from './01-app/01-views/01-pages/menuPages/SubscriptionPage';
import HowItWorksPage from './01-app/01-views/01-pages/menuPages/HowItWorksPage';
import SupportPage from './01-app/01-views/01-pages/menuPages/SupportPage';
import DeliveryPage from './01-app/01-views/01-pages/menuPages/DeliveryPage';
import PaymentPage from './01-app/01-views/01-pages/menuPages/PaymentPage';
import JournalPreview from './01-app/01-views/01-pages/JournalPreview';
import JournalSorting from './01-app/01-views/01-pages/JournalSorting';
import ForgotPasswordPage from './01-app/01-views/01-pages/ForgotPasswordPage';
import DrawerNav from './01-app/02-navigation/DrawerNav';

import LocalizedStrings from 'react-native-localization';
import english from './01-app/04-translation/en'
import french from './01-app/04-translation/fr'
export const strings = new LocalizedStrings({
    en: english,
    fr: french,
});


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();



const Root = () => {
  return (
    <Drawer.Navigator initialRouteName="HomePage"
     drawerContent={(props) => <DrawerNav {...props} />}>
      <Drawer.Screen name="Home Page" component={HomePage} options={{headerShown: false}}/>
    </Drawer.Navigator>
  );
}

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="WelcomePage" component={WelcomePage} options={{ headerShown: false }} />
        <Stack.Screen name="CreateAccountPage" component={CreateAccountPage} options={{ headerShown: false }} />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
        <Stack.Screen
          name="Root"
          component={Root}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="JournalDetails" component={JournalDetails} options={{ headerShown: false }} />
        <Stack.Screen name="JournalSettings" component={JournalSettings} options={{ headerShown: false }} />
        <Stack.Screen name="Contributors" component={Contributors} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown: false }} />
        <Stack.Screen name="NotificationsPage" component={NotificationsPage} options={{ headerShown: false }} />
        <Stack.Screen name="PreviewPage" component={PreviewPage} options={{ headerShown: false }} />
        <Stack.Screen name="ShippingAddressPage" component={ShippingAddressPage} options={{ headerShown: false }} />
        <Stack.Screen name="LinksSharingPage" component={LinksSharingPage} options={{ headerShown: false }} />
        <Stack.Screen name="UploadImagesPage" component={UploadImagesPage} options={{ headerShown: false }} />
        <Stack.Screen name="ChatPage" component={ChatPage} options={{ headerShown: false }} />
        <Stack.Screen name="CalendarPage" component={CalendarPage} options={{ headerShown: false }}/>
        <Stack.Screen name="MyProfilePage" component={MyProfilePage} options={{ headerShown: false }} />
        <Stack.Screen name="JoinJournalsPage" component={JoinJournalsPage} options={{ headerShown: false }} />
        <Stack.Screen name="SubscriptionPage" component={SubscriptionPage} options={{ headerShown: false }} />
        <Stack.Screen name="HowItWorksPage" component={HowItWorksPage} options={{ headerShown: false }} />
        <Stack.Screen name="SupportPage" component={SupportPage} options={{ headerShown: false }} />
        <Stack.Screen name="DeliveryPage" component={DeliveryPage} options={{ headerShown: false }} />
        <Stack.Screen name="PaymentPage" component={PaymentPage} options={{ headerShown: false }} />
        <Stack.Screen name="JournalPreview" component={JournalPreview} options={{ headerShown: false }} />
        <Stack.Screen name="JournalSorting" component={JournalSorting} options={{ headerShown: false }} />
        <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} options={{ headerShown: false }} />

      </Stack.Navigator>

      {/* <Drawer.Navigator>
        <Drawer.Screen name="HomePage" component={HomePage} />
      </Drawer.Navigator> */}

    </NavigationContainer>


  )
}


export default MyStack;
