import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableHighlight,
  DeviceEventEmitter,
  Linking,
} from 'react-native';
import I18n from '../../../resources/languages/I18n';
import {ImageUrl} from '../../constants/Urls';

// import {NavigationActions} from 'react-navigation';
import {getWalletInfo} from '../../commons/WalletUtil';
import NavigationUtil from '../../commons/NavigationUtil';

import CacheUtils from '../../commons/CacheUtil';
import { Events } from '../../services/events';

class Shortcuts extends React.Component {
  constructor(props) {
    super(props);
    this.onRefresh = this._onRefresh.bind(this);
    this.state = {
      dataSource: [],
      network: 'MainNet',
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
      subscriptText: '',
    };
  }

  async UNSAFE_componentWillMount() {
    // 或许当前网络链信息
    await CacheUtils.getItem('selectNetwork', (err, ret) => {
      if (err) {
        console.log(err);
        return;
      }
      if (ret) {
        ret = JSON.parse(ret);
        this.setState({
          network: ret.key,
        });
      }
    });
    await this.getWalletInfo();
  }

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef) {
      onRef(this);
    }
    // 监听网络切换
    DeviceEventEmitter.addListener(Events.SELECT_A_CHAIN, network => {
      this.setState({
        network,
      });
    });
    // 监听钱包切换
    DeviceEventEmitter.addListener(Events.WALLET_STATUS_CHANGED, () => {
      this.getWalletInfo();
    });
    this.getDataSource();
  }

  getDataSource = () => {
    const {topping} = this.props;
    let dataSource = [];
    for (let i = 0; i < topping.length; i++) {
      dataSource[i] = {
        icon: ImageUrl + topping[i].pic,
        title: topping[i].title,
        entryUrl: topping[i].link,
        needLogin: topping[i].needLogin,
      };
    }

    this.setState({
      dataSource,
    });
  };

  _onRefresh = async () => {
    this.getDataSource();
  };

  // 获取当前账号钱包信息
  getWalletInfo = async () => {
    const {userInfo} = this.props;
    const walletInfo = await getWalletInfo(this.state.network, userInfo);
    this.setState({
      walletInfo: walletInfo,
    });
  };

  // 跳转到对应的菜单
  onPressHandler = (url, needLogin, title) => {
    const {navigate} = this.props.navigation;
    const {userInfo, loggedIn} = this.props;
    let urlParams = '';
    if (title == '超物系' || title == 'S.I.R.') {
      this.setState({
        subscriptText: '',
      });
    }
    if (needLogin) {
      if (!loggedIn) {
        NavigationUtil.go(this.props.navigation, 'Landing');
        return;
      }
      urlParams = `?userId=${userInfo.id}&phoneNum=${
        userInfo.phoneNum
      }&locale=${I18n.locale == 'en' ? 'en' : 'zh-CN'}`;
    }
    if (url.includes('https://') || url.includes('http://')) {
      let noShare = false;
      let tabColor = '';
      if (url.includes('/playAlliance')) {
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('btn.download'),
          submitComfirm: () => {
            Linking.openURL(
              'https://sirshop.ultrain.info/download/index.html?source=ultrainOne&action=withdraw',
            );
          },
          dialogCancelText: I18n.t('btn.cancel'),
          cancelBtnAction: () => {},
          dialogTitle:
            I18n.locale == 'en'
              ? 'S.I.R. Has Been Launched'
              : '超物系App已上线',
          dialogDec:
            I18n.locale == 'en'
              ? '「S.I.R.」has become an independent app, and all the original data has been migrated. Please download the app in time'
              : '「超物系」已独立为App，原有数据已全部迁移，请及时下载App',
        });
        return;
      }
      // TODO(liangqin) navi to webview
      // const navigateAction = NavigationActions.navigate({
      //   routeName: 'WebView',
      //   params: {
      //     url: url + urlParams,
      //     shareUrl: url,
      //     noShare,
      //     name: title,
      //     tabColor,
      //   },
      // });
      // this.props.navigation.dispatch(navigateAction);
    } else if (url === 'LuckyMoney') {
      // this.refs.toast.show(I18n.t('page.stayTuned'), DURATION.LENGTH_SHORT);
    } else if (url === 'Points') {
      navigate(url);
    } else {
      navigate(url);
    }
  };

  _renderItemList() {
    const list = Object.values(this.state.dataSource).map((item, index) => {
      return (
        <TouchableHighlight
          onPress={() =>
            this.onPressHandler(item.entryUrl, item.needLogin, item.title)
          }
          key={index}>
          <View style={styles.columnItem}>
            <Image
              resizeMode={'contain'}
              source={{uri: item.icon}}
              style={{width: 45, height: 45}}
            />
            <Text style={styles.columnTitle}>{item.title}</Text>
          </View>
        </TouchableHighlight>
      );
    });
    return list;
  }

  render() {
    return (
      <View style={styles.container}>
        {this._renderItemList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1B1B20',
    paddingTop: 19,
    paddingBottom: 17,
  },
  columnItem: {
    position: 'relative',
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnSubscript: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    top: -8,
    left: 20,
    backgroundColor: '#ff0000',
    borderRadius: 5,
    color: '#fff',
    fontSize: 12,
    height: 18,
    width: 60,
    fontWeight: '700',
    textAlign: 'center',
  },
  columnTitle: {
    fontSize: 12,
    marginTop: 8,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: '.SFUIDisplay',
  },
  iconGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 45,
    height: 45,
    backgroundColor: '#48484C',
    borderRadius: 6,
    padding: 2,
    paddingBottom: 1,
    justifyContent: 'space-around',
  },
  columnMinIcon: {
    width: 20,
    height: 20,
    borderRadius: 3,
    marginBottom: 1,
  },
});

export default Shortcuts;
