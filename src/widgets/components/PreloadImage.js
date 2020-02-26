import React, { Component } from "react";
import { Image, Animated, View, StyleSheet } from "react-native";
import FastImage from "react-native-fast-image";

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
let i = 0;
const genKey = () => {
  return `key:${++i}`;
};

export default class PreloadImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      thumbnailOpacity: new Animated.Value(0),
      key: genKey()
    };
  }

  onLoad = () => {
    Animated.timing(this.state.thumbnailOpacity, {
      toValue: 1,
      duration: 500
    }).start();
  };

  render() {
    const { key, thumbnailOpacity } = this.state;
    const { width, height, defaultSource, source, style } = this.props;

    return (
      <View style={{ height: height, width: width }}>

        <FastImage
          style={[
            styles.image, style
          ]}
          source={defaultSource}
          resizeMode={FastImage.resizeMode.cover}
        />

        <AnimatedFastImage
          key={key}
          style={[
            style,
            {
              opacity: thumbnailOpacity
            }
          ]}
          source={source}
          resizeMode={FastImage.resizeMode.cover}
          onLoad={this.onLoad}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    maxWidth: "50%",
    maxHeight: "50%"
  }
});