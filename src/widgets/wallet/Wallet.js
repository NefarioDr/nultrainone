import * as React from 'react';
import { Text, View } from 'react-native';

export class Wallet extends React.Component {
  static navigationOptions = {};
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This my Wallet!</Text>
      </View>
    );
  }
}
