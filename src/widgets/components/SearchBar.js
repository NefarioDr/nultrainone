import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Dimensions, DeviceEventEmitter
} from "react-native";
import FastImage from "react-native-fast-image";
import I18n from "react-native-i18n";

const searchImg = require("../img/search.png");
const locationImg = require("../img/location.png");
const maxWidth = Dimensions.get("window").width;
var Geolocation = require("Geolocation");
import toastUtil from "../utils/ToastUtil";
import { NavigationActions } from "react-navigation";

class SearchBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      keyWord: I18n.t("page.PleaseInputKeyWord"),
      city: "..."
    };
  }

  componentDidMount() {
    //this.getLocation();
    DeviceEventEmitter.addListener("keepKeyWord", (keyWord) => {
      this.setState({
        keyWord: keyWord
      });
    });
  }

  getLocation = () => {
    Geolocation.getCurrentPosition(location => {

        const url = "https://maps.google.cn/maps/api/geocode/json?latlng="
          + location.coords.latitude + ","
          + location.coords.longitude
          + "&language=" + (I18n.locale === "zh" ? "CN" : "EN");

        fetch(url).then((response) => response.json())
          .then((responseData) => {

            if (responseData.results && responseData.results.length) {
              let l = responseData.results.length - 1;

              for (l; l >= 0; l--) {
                let fullInfo = responseData.results[l];
                if (fullInfo.types.indexOf("locality") > -1 && fullInfo.types.indexOf("political") > -1) {
                  console.log(fullInfo);
                  const city = fullInfo.address_components[0];
                  this.setState({
                    city: city.long_name
                  });
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
        //.done();
      },
      error => {
        toastUtil.showLong(error, true);
      }
    );
  };
  handlePosition = () => {
    console.log("click position");
  };
  handleSearch = () => {
    const navigateAction = NavigationActions.navigate({
      routeName: "SearchBarDetail",
      params: {
        callbackRoute: this.props.user,
        keyWord: this.state.keyWord === I18n.t("page.PleaseInputKeyWord") ? "" : this.state.keyWord
      }
    });
    this.props.navigation.dispatch(navigateAction);
  };

  render() {
    return (
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          {/*<TouchableOpacity
            onPress={() => this.handlePosition()} style={styles.position}>
            <FastImage
              style={[
                styles.positionIcon
              ]}
              source={locationImg}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text numberOfLines={1} ellipsizeMode='tail' style={styles.positionText}>{this.state.city}</Text>
          </TouchableOpacity>*/}
          <TouchableOpacity style={styles.inputWrap} onPress={() => this.handleSearch()}>
            <FastImage
              style={[
                styles.searchIcon
              ]}
              source={searchImg}
              resizeMode={FastImage.resizeMode.cover}
            />
            <Text style={styles.inputText}>{this.state.keyWord}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  hide: {
    display: "none"
  },
  searchBarWrap: {
    backgroundColor: "#1B1B20",
    height: 32,
    marginTop: Platform.OS === "android" ? 10 : 32,
    marginBottom: 10,
    paddingLeft: 14,
    paddingRight: 13
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  position: {
    flexDirection: "row",
    height: "100%",
    alignItems: "center"
  },
  positionIcon: {
    width: 13,
    height: 16
  },
  positionText: {
    marginLeft: 5,
    marginRight: 14,
    fontSize: 15,
    color: "#505050",
    flexWrap: "nowrap",
    maxWidth: (maxWidth - 100) / 2
  },
  inputWrap: {
    flex: 1,
    height: 32,
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14
  },
  searchIcon: {
    width: 14,
    height: 14,
    marginRight: 8
  },
  inputText: {
    fontSize: 12,
    color: "#bfbfbf"
  }
});

export default SearchBar;
