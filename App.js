import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from './src/homescreen/HomeScreen';
import {MiningScreen} from './src/miningscreen/MiningScreen';
import {DappScreen} from './src/dappscreen/DappScreen';
import {MyScreenNaviStack} from './src/myscreen/MyScreen';
import I18n from './resources/languages/I18n';
import * as TabIcons from './resources/img/Images';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, tintColor, size }) => {
            let tabIcon;
            if (route.name === I18n.t('tab_navigator.home')) {
              tabIcon = focused ? TabIcons.HOME_SELECT : TabIcons.HOME;
            } else if (route.name === I18n.t('tab_navigator.mining')) {
              tabIcon = focused ? TabIcons.MINING_SELECT : TabIcons.MINING;
            } else if (route.name === I18n.t('tab_navigator.dapps')) {
              tabIcon = focused ? TabIcons.DAPP_SELECT : TabIcons.DAPP;
            } else if (route.name === I18n.t('tab_navigator.account')) {
              tabIcon = focused ? TabIcons.MINE_SELECT : TabIcons.MINE;
            }

            return (<Image source={{ uri: tabIcon}} style={{ width: 30, height: 30 }}/>)
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'white',
          activeBackgroundColor: 'black',
          inactiveBackgroundColor: 'black',
          style: {},
        }}>
        <Tab.Screen name={I18n.t('tab_navigator.home')} component={HomeScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.mining')} component={MiningScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.dapps')} component={DappScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.account')} component={MyScreenNaviStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
// import * as React from 'react';
// import { Button, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// function DetailsScreen() {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Details!</Text>
//     </View>
//   );
// }

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

// function SettingsScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Settings screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate('Details')}
//       />
//     </View>
//   );
// }

// const HomeStack = createStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator>
//       <HomeStack.Screen name="Home" component={HomeScreen} />
//       <HomeStack.Screen name="Details" component={DetailsScreen} />
//     </HomeStack.Navigator>
//   );
// }

// const SettingsStack = createStackNavigator();

// function SettingsStackScreen() {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen name="Settings" component={SettingsScreen} />
//       <SettingsStack.Screen name="Details" component={DetailsScreen} />
//     </SettingsStack.Navigator>
//   );
// }

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator>
//         <Tab.Screen name="Home" component={HomeStackScreen} />
//         <Tab.Screen name="Settings" component={SettingsStackScreen} />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }
