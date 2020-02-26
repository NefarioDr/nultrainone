import React from 'react';
import PropTypes from 'prop-types';
import { ViewPropTypes, Text, TouchableOpacity } from 'react-native';

const propTypes = {
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
  isHigh: PropTypes.bool,
  style: Text.propTypes.style,
  containerStyle: ViewPropTypes.style,
  text: PropTypes.string,
  activeOpacity: PropTypes.number
};

const Button = ({
  onPress,
  disabled,
  isHigh,
  style,
  containerStyle,
  text,
  activeOpacity
}) => (
  <TouchableOpacity
    style={containerStyle}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={activeOpacity}
    isHigh={isHigh}
  >
    <Text style={style}>{text}</Text>
  </TouchableOpacity>
);

Button.propTypes = propTypes;

Button.defaultProps = {
  onPress() {},
  disabled: false,
  isHigh: false,
  activeOpacity: 0.8
};

export default Button;
