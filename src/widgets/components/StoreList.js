import React from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Linking
} from 'react-native';
import I18n from "react-native-i18n";
import * as storeService from "../services/store";
import { BaseUrl, ImageUrl } from "../constants/Urls";
import FastImage from "react-native-fast-image";
import Toast, {DURATION} from 'react-native-easy-toast'
import * as Images from "../constants/Images";
import connect from "react-redux/es/connect/connect";

class StoreList extends React.Component{
  constructor(props) {
    super(props)
    this.shareComponent = React.createRef();
    this.state = {
      dataSource: []
    }
  }
  componentWillMount() {
    storeService.getAllLists({
      type: 2
    }).then(res => {
      if (res.state === "success") {
        this.setState({
          dataSource: res.docs
        })
      }
    })
  }
  handleEntryStore = (p) => {
    if (!this.props.loggedIn) {
      this.props.navigation.navigate("Landing");
    } else {
      this.props.onBuy(p)
    }
  }
  renderStore = ({item, index}) => {
    return (
      <View style={[styles.storeContainer, {marginRight: index % 2 ? 0 : 15}]}>
        <TouchableOpacity onPress={() => this.handleEntryStore(item.price)}>
          <View style={styles.picWrapper}>
            <FastImage
              style={[
                styles.storePic
              ]}
              source={{uri: ImageUrl + '/' + item.pic}}
              resizeMode={FastImage.resizeMode.contain}
            />
            {/* <Image source={{uri: BaseUrl + '/' + item.pic}} style={styles.storePic} resizeMode={'contain'}/> */}
          </View>
          <Text style={styles.storeName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.priceWrap}>
            <Image source={{uri:Images.POINT_ICON}} style={styles.storeIcon}/>
            <Text style={styles.storePrice}>{item.price}</Text>
          </View>
          <View style={styles.buyBtn} ><Text style={styles.buyText}>{I18n.t('page.buy')}</Text></View>
        </TouchableOpacity>
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.dataSource}
          keyExtractor={(item, index) => 'storeList' + index}
          renderItem={this.renderStore}
          horizontal={false}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={styles.seperatorLine}/>}
          // showsHorizontalScrollIndicator={false}
        />
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E24',
    paddingBottom: 20,
    justifyContent: 'space-around',
  },
  storeContainer: {
    flex: 1,
    // width: 160,
  },
  picWrapper: {
    // backgroundColor: '#40474F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    // marginRight: 15, 
    borderRadius: 3
  },
  storePic: {
    width: 160,
    height: 160,
  },
  storeName: {
    fontSize: 15,
    lineHeight: 20,
    color: '#fff',
    marginBottom: 10,
    flex: 1
  },
  priceWrap: {
    flexDirection: "row", 
    alignItems: 'flex-start',
    marginBottom: 6
  },
  storeIcon: {
    width: 28,
    height: 28,
  },
  storePrice: {
    fontSize: 18,
    color:'#FFB301',
  },
  buyBtn: {
    width: '100%',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#34343A',
    borderRadius: 15
  },
  buyText: {
    fontSize: 14,
    lineHeight: 17,
    color: '#fff',
    fontWeight: '700'
  },
  seperatorLine: {
    height: 30,
  }
})
const mapStateToProps = state => {
  return {
      userInfo: state.auth.userInfo,
      loggedIn: state.auth.loggedIn,
      registered: state.auth.registered
  };
};
export default connect(mapStateToProps)(StoreList);
