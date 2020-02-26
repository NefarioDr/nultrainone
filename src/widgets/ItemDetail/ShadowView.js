import React from 'react';
import {StyleSheet, Image, View, Dimensions} from 'react-native';

const maxWidth = Dimensions.get('window').width;
const ShadowView = () => (
  <View style={styles.boxShadow}>
    <Image
      style={{width: '100%', height: 10}}
      source={require('../../img/shadow1.png')}
    />
  </View>
);

const styles = StyleSheet.create({
  boxShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: maxWidth,
    height: 5,
  },
});

export default ShadowView;
