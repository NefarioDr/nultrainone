import React from 'react';
import {RefreshControl, StyleSheet, Text, Image, View} from 'react-native';
import I18nn from '../../../resources/languages/I18n';

const EmptyView = ({isRefreshing, onRefresh, top, emptyInfo}) => (
  <View
    style={[styles.container, top === '188' ? {marginTop: 188} : '']}
    refreshControl={
      <RefreshControl
        style={styles.refreshControlBase}
        refreshing={isRefreshing}
        onRefresh={() => onRefresh()}
        title="Loading..."
        colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
      />
    }>
    <Image style={styles.img} source={require('../../img/elephant.png')} />
    <Text style={styles.text}>{emptyInfo || I18nn.t('page.emptyInfo')}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshControlBase: {
    backgroundColor: 'transparent',
  },
  img: {
    width: 150,
    height: 150,
  },
  text: {
    height: 45,
    lineHeight: 45,
    fontSize: 17,
    color: '#BFC0BF',
    fontWeight: '700',
  },
});

export default EmptyView;
