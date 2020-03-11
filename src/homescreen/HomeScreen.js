import * as React from 'react';
import HomePage from '../widgets/homepage';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultScreenOptions} from '../commons/GoBackHeader';
import {LoginPage} from '../widgets/loginpage/';
import {LoginAsEmail} from '../widgets/loginpage/LoginAsEmail';
import {LoginAsPhoneNumber} from '../widgets/loginpage/LoginAsPhoneNumber';
import { HSRouter } from './HSRouter';

const HomeScreenStack = createStackNavigator();
export function HomeScreenNaviStack() {
  return (
    <HomeScreenStack.Navigator
      initialRouteName={HSRouter.HOME_SCREEN}
      headerMode="screen"
      screenOptions={DefaultScreenOptions}>
      <HomeScreenStack.Screen
        name={HSRouter.HOME_SCREEN}
        component={HomeScreen}
        options={{headerShown: false}}
      />
      {/* 登录路由 */}
      <HomeScreenStack.Screen
        name={HSRouter.LOGIN_SCREEN}
        component={LoginPage}
        options={{title: 'Login', headerShown: false}}
      />
      <HomeScreenStack.Screen
        name={HSRouter.EMAIL_LOGIN_SCREEN}
        component={LoginAsEmail}
        options={{headerShown: true}}
      />
      <HomeScreenStack.Screen
        name={HSRouter.PHONE_NUMBER_LOGIN_SCREEN}
        component={LoginAsPhoneNumber}
      />
      {/* {[1].forEach(element => {
        return (
          <HomeScreenStack.Screen
            name="LoginAsPhoneNumber"
            component={LoginAsPhoneNumber}
          />
        );
      })} */}
    </HomeScreenStack.Navigator>
  );
}

export class HomeScreen extends React.Component {
  static navigationOptions = {};

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      //   <Text>HomeScreen!</Text>
      // </View>
      <HomePage {...this.props} />
    );
  }
}
