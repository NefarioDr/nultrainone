import React from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import I18n from 'react-native-i18n';
const Footer = () => (
  <View style={styles.footerContainer}>
    <ActivityIndicator size="small" color="#3e9ce9" />
    <Text style={styles.footerText}>{I18n.t('page.Loading')}</Text>
  </View>
);

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 16,
    marginLeft: 10,
  },
});

export default Footer;
