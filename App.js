import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreenNaviStack} from './src/homescreen/HomeScreen';
import {MiningScreen} from './src/miningscreen/MiningScreen';
import {DappScreen} from './src/dappscreen/DappScreen';
import {MyScreenNaviStack} from './src/myscreen/MyScreen';
import I18n from './resources/languages/I18n';
import * as TabIcons from './resources/img/Images';
import {Image} from 'react-native';
import { GlobalSettings } from './src/services/GlobalSettings';
const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  UNSAFE_componentWillMount() {
    GlobalSettings.init();
  }

  render() {
    return (
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({route}) => ({
            tabBarIcon: ({focused, tintColor, size}) => {
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

              return (
                <Image
                  source={{uri: tabIcon}}
                  style={{width: 30, height: 30}}
                />
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: 'tomato',
            inactiveTintColor: 'white',
            activeBackgroundColor: 'black',
            inactiveBackgroundColor: 'black',
            style: {},
          }}>
          <Tab.Screen
            name={I18n.t('tab_navigator.home')}
            component={HomeScreenNaviStack}
          />
          <Tab.Screen
            name={I18n.t('tab_navigator.mining')}
            component={MiningScreen}
          />
          <Tab.Screen
            name={I18n.t('tab_navigator.dapps')}
            component={DappScreen}
          />
          <Tab.Screen
            name={I18n.t('tab_navigator.account')}
            component={MyScreenNaviStack}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}
