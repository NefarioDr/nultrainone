import * as React from 'react';
import {Text, View} from 'react-native';

export class MiningScreen extends React.Component {
  static navigationOptions = {};
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>MiningScreen!</Text>
      </View>
    );
  }
}
