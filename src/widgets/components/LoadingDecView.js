import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions
} from "react-native";
import Spinner from "react-native-loading-spinner-overlay";

const maxheight = Dimensions.get("window").height;
const maxwidth = Dimensions.get("window").width;
const EmptyView = (loading) => (
  <View style={styles.base}>
    <Spinner visible={true} textContent={"Loading..."}
             textStyle={{ color: "#fff" }}>
    </Spinner>
    <Image style={styles.img} source={require("../img/loadDec.png")}/>
  </View>
);

const styles = StyleSheet.create({
  base: {
    flex: 1
  },
  no_data: {
    flex: 1
  },
  img: {
    width: maxwidth,
    height: maxheight
  }
});

export default EmptyView;
