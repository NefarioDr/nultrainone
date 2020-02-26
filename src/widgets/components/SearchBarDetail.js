import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform, DeviceEventEmitter
} from "react-native";
import I18n from "react-native-i18n";
import FastImage from "react-native-fast-image";
import { NavigationActions } from "react-navigation";

class SearchBar extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      keyWord: this.props.navigation.getParam("keyWord") || "",
      _keyWord: this.props.navigation.getParam("keyWord") || "",
      cancelOrSearch: I18n.t("btn.cancel"),

      isfocusKeyWord: false
    };
  }

  handleDelete = () => {
    this.setState({
      keyWord: "",
      _keyWord: ""
    });
    let from = this.props.navigation.getParam("callbackRoute");
    DeviceEventEmitter.emit("keepKeyWord", "");
    if (from === "Home") {
      DeviceEventEmitter.emit("searchMain", "");
    } else if (from === "Event") {
      DeviceEventEmitter.emit("searchActivity", "");
    }
  };

  handleCancelOrSearch = () => {
    if (this.state.keyWord !== "") {
      let from = this.props.navigation.getParam("callbackRoute");
      const navigateAction = NavigationActions.navigate({
        routeName: from,
        params: { "keyWord": this.state.keyWord }
      });
      this.props.navigation.dispatch(navigateAction);

      DeviceEventEmitter.emit("keepKeyWord", this.state.keyWord);
      if (from === "Home") {
        DeviceEventEmitter.emit("searchMain", this.state.keyWord);
      } else if (from === "Event") {
        DeviceEventEmitter.emit("searchActivity", this.state.keyWord);
      }
    } else {
      this.props.navigation.goBack();
    }
  };

  focus = (fname) => {
    if (fname === "keyWord") {
      this.setState({
        isfocusKeyWord: true
      });
    }
  };

  //即时修改走change
  change = (fname) => {
    if (fname === "keyWord") {
      this.setState({
        isfocusKeyWord: false
      });
      setTimeout(() => {
        DeviceEventEmitter.emit("keepKeyWord", this.state.keyWord);
        if (this.state.keyWord !== "") {
          this.setState({
            cancelOrSearch: I18n.t("page.Search")
          });
        } else {
          this.setState({
            cancelOrSearch: I18n.t("btn.cancel")
          });
        }
      }, 30);
    }
  };

  changeText = () => {
    if (this.state._keyWord !== "") {
      this.setState({
        cancelOrSearch: I18n.t("page.Search"),
        keyWord: this.state._keyWord
      });
    } else {
      this.setState({
        cancelOrSearch: I18n.t("btn.cancel"),
        keyWord: this.state._keyWord
      });
    }
  };

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarWrap}>
          <View style={styles.searchBar}>
            <View style={styles.inputWrap} onPress={() => this.handleSearch()}>

              <TextInput
                onFocus={() => {
                  this.focus("keyWord");
                }}
                placeholder={I18n.t("page.PleaseInputKeyWord")}
                maxLength={40}
                style={[styles.inputStyle]}
                underlineColorAndroid="transparent"
                onChangeText={(keyWord) => {
                  this.setState({ keyWord });
                  this.change("keyWord");
                }}
                onChange={() => {
                  this.changeText();
                }}
                defaultValue={this.state.keyWord}
              />

              <TouchableOpacity style={styles.closeIcon} onPress={() => this.handleDelete()}>
                <FastImage
                  style={[
                    styles.closeIcon
                  ]}
                  source={require("../img/close.png")}
                  resizeMode={FastImage.resizeMode.cover}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => this.handleCancelOrSearch()} style={styles.position}>
              <Text style={styles.closeText}>
                {this.state.cancelOrSearch}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.boxShadow}>
          <Image
            style={{ width: "100%", height: 10 }}
            source={require("../img/shadow1.png")}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1B20",
    position: "relative"
  },
  searchBarWrap: {
    backgroundColor: "#1B1B20",
    height: 32,
    marginTop: Platform.OS === "android" ? 10 : 32,
    marginBottom: 10,
    paddingHorizontal: 20
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  inputWrap: {
    flex: 1,
    height: 32,
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14
  },
  inputStyle: {
    flex: 1,
    alignItems: "center",
    margin: 10,
    height: 60,
    fontSize: 12,
    color: "#4A4A4A"
  },
  closeIcon: {
    width: 16,
    height: 16
  },
  closeText: {
    marginLeft: 20,
    fontSize: 16,
    color: "#19B6F0"
  },
  boxShadow: {
    position: "absolute",
    top: Platform.OS === "android" ? 50 : 72,
    left: 0,
    right: 0,
    width: "100%",
    height: 5
  }
});

export default SearchBar;
