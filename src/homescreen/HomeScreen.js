import * as React from 'react';
import {Text, View} from 'react-native';
import MainPage from '../widgets/homepage';

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
      <MainPage {...this.props} />
    );
  }
}
