import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HomeScreen} from './src/homescreen/HomeScreen';
import {MiningScreen} from './src/miningscreen/MiningScreen';
import {DappScreen} from './src/dappscreen/DappScreen';
import {MyScreen} from './src/myscreen/MyScreen';

import I18n from './resources/languages/I18n';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={I18n.t('tab_navigator.home')} component={HomeScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.mining')} component={MiningScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.dapps')} component={DappScreen} />
        <Tab.Screen name={I18n.t('tab_navigator.account')} component={MyScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
