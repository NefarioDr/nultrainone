import React from 'react';
import I18n from 'react-native-i18n';
import Banner from './Banner';
import MainContent from './MainContent';

const maxHeight = Dimensions.get('window').height;
const maxWidth = Dimensions.get('window').width;

import * as Images from '../../../resources/img/Images';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  RefreshControl,
  DeviceEventEmitter,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import * as pointsService from '../../services/points';

class StoreContainer extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: I18n.t('title.store'),
    headerStyle: {
      backgroundColor: '#1B1B20',
      borderBottomWidth: 0,
      elevation: 0,
      shadowOpacity: 0,
    },
    headerTitleStyle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
      margin: 5,
    },
    headerTintColor: '#fff',
    headerLeft: (
      <View>
        <TouchableOpacity
          style={{marginLeft: 18}}
          onPress={() => navigation.goBack()}>
          <Image
            source={{uri: Images.GO_BACK_BLACK}}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    ),
  });

  constructor(props) {
    super(props);
    this.storeMainList = React.createRef();
    this.storeBannerList = React.createRef();
    this.state = {
      refreshing: false,
      balance: 0,
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
    };
  }

  _onRefresh = () => {
    this.storeBannerList.current.wrappedInstance._onRefresh();
    this.storeMainList.current.wrappedInstance._onRefresh();
  };

  _onScroll = e => {
    var windowHeight = Dimensions.get('window').height,
      height = e.nativeEvent.contentSize.height,
      offset = e.nativeEvent.contentOffset.y;
    //console.log("windowHeight:" + windowHeight + ", offset:" + offset + ", height:" + height + ': ' + (windowHeight + offset >= height) );
    if (windowHeight + offset >= height) {
      //this.storeMainList.current._fetchMore();
    }
  };

  showTip = e => {
    //console.log(e,this.state.balance)
    this.setState({
      toastVisible: true,
      dialogSubmitText: I18n.t('btn.okay'),
      submitComfirm: () => {},
      dialogTitle: I18n.t('page.prompt'),
      dialogDec: I18n.t('page.notEnoughPointTip'),
    });
    // ToastUtil.showLong(I18n.t('page.notEnoughPointTip'), true)
    //this.refs.toast.show(I18n.t("page.notEnoughPointTip"), DURATION.LENGTH_SHORT);
  };

  componentWillMount() {
    const {userInfo} = this.props;
    if (userInfo && userInfo.wallets && userInfo.wallets.length) {
      let walletId = userInfo.wallets[0]._id;
      pointsService
        .getSignInfo({
          userId: userInfo.id,
          walletId,
        })
        .then(res => {
          if (res.state === 'success') {
            let balance = res.docs.balance;
            this.setState({
              balance,
            });
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
  }

  async componentDidMount() {
    DeviceEventEmitter.addListener('searchMain', keyWord => {
      this.storeMainList.current._fetchData(keyWord);
    });
  }

  render() {
    return (
      //资讯的分页有点特殊,外加scrollview,容易出现滚动一次触发多次请求的情况
      <View style={{flex: 1, position: 'relative'}}>
        <ScrollView
          style={styles.container}
          onScroll={this._onScroll}
          scrollEventThrottle={4000}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <StatusBar barStyle={'light-content'} />
          <Banner
            {...this.props}
            onBuy={this.showTip}
            ref={this.storeBannerList}
          />
          <View style={styles.mainContent}>
            <MainContent
              {...this.props}
              onBuy={this.showTip}
              ref={this.storeMainList}
            />
          </View>
        </ScrollView>
        <Toast
          ref="toast"
          style={{
            position: 'absolute',
            top: 0,
            backgroundColor: '#fff',
            paddingHorizontal: 15,
            paddingVertical: 25,
            borderRadius: 5,
          }}
          position="top"
          positionValue={maxHeight / 2 - 50}
          fadeInDuration={750}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{color: '#000'}}
        />
        <ToastUtils
          visible={this.state.toastVisible}
          dialogSubmitText={this.state.dialogSubmitText}
          submitComfirm={this.state.submitComfirm}
          dialogCancelText={this.state.dialogCancelText}
          cancelBtnAction={this.state.cancelBtnAction}
          dialogTitle={this.state.dialogTitle}
          dialogDec={this.state.dialogDec}
          closeToast={() => this.setState({toastVisible: false})}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B1B20',
  },
  mainContent: {
    backgroundColor: '#1E1E24',
    padding: 20,
  },
  bgWrap: {
    backgroundColor: '#fff',
    width: maxWidth,
    height: maxHeight,
    paddingTop: 156,
    justifyContent: 'flex-start',
    alignItems: 'center',
    shadowColor: '#ccc',
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.3,
    elevation: 5,
  },
});

export default StoreContainer;
