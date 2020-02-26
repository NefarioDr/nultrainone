import React from 'react';
import {StyleSheet, Image, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import I18n from '../../../resources/languages/I18n';

const annulus = require('../../../resources/img/annulus.png');

const propTypes = {
  child: PropTypes.element,
  title: PropTypes.string,
  // show: PropTypes.boolean,
  // noTopBorder: PropTypes.boolean,
};

const CardContainer = ({children, title, show, noTopBorder, style, goMore}) => {
  if (show) {
    return (
      <View
        style={[
          styles.cardContainer,
          {borderTopWidth: noTopBorder ? 0 : 0.5},
          style,
        ]}>
        {title && (
          <View style={styles.cardHeader}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image source={annulus} style={styles.cardHeaderImage} />
              <Text style={styles.cardHeaderTitle}>{title}</Text>
            </View>
            {goMore && (
              <TouchableOpacity activeOpacity={0.8} onPress={() => goMore()}>
                <Text style={styles.more}>{I18n.t('page.more')}</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        {children}
      </View>
    );
  } else {
    return <View />;
  }
};
CardContainer.propTypes = propTypes;

CardContainer.defaultProps = {
  show: true,
  noTopBorder: false,
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingTop: 18,
    paddingBottom: 18,
    // marginLeft: 20,
    // marginRight: 20,
    borderColor: '#2C2C31',
    position: 'relative',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 19,
  },
  cardHeaderImage: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  cardHeaderTitle: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700',
    // fontFamily: 'ArialRoundedMTBold'
  },
  more: {
    fontSize: 12,
    color: '#6D6A68',
  },
});
export default CardContainer;
