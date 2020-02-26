import React from "react";
import { ActivityIndicator, Text, StyleSheet, View, ImageBackground } from "react-native";
import I18n from "react-native-i18n";
const LoadingView = () => (
  <View style={styles.loading}>
    <ImageBackground source={require("../img/loadDec.png")} style={styles.bg}>
      <ActivityIndicator size="large" color="#fff"/>
    </ImageBackground>
    {/* <Text style={styles.loadingText}>{I18n.t("page.Loading")}</Text> */}
  </View>
);

const styles = StyleSheet.create({
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B1B20",
  },
  loadingText: {
    marginTop: 10,
    textAlign: "center"
  },
  bg: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }
});

export default LoadingView;
