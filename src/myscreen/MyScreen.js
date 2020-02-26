import * as React from 'react';
import {Text, View, Button} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {Wallet} from '../widgets/wallet/Wallet';
import {DefaultScreenOptions} from '../commons/GoBackHeader';
import {ToastLong} from '../commons/Toast';
import {HomeScreen} from '../homescreen/HomeScreen';

const MyStack = createStackNavigator();
export function MyScreenNaviStack() {
  return (
    <MyStack.Navigator
      initialRouteName="My"
      headerMode="screen"
      screenOptions={DefaultScreenOptions}>
      <MyStack.Screen
        name="My"
        component={MyScreen}
        options={{headerShown: false}}
      />

      <MyStack.Screen
        name="Wallet"
        component={Wallet}
        options={{title: 'Awsome RN'}}
      />

      <MyStack.Screen
        name="home"
        component={HomeScreen}
        options={{title: 'Awsome Home'}}
      />
    </MyStack.Navigator>
  );
}

export class MyScreen extends React.Component {
  static navigationOptions = {};
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>My Screen!</Text>
        <Button
          title="Go to Wallet"
          onPress={() => this.props.navigation.navigate('Wallet')}
        />

        <Button
          title="toast"
          onPress={() => {
            ToastLong('hello');
          }}
        />

        <Button
          title="toast"
          onPress={() => {
            this.props.navigation.navigate('home');
          }}
        />
      </View>
    );
  }
}
