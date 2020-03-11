import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Platform,
  DeviceEventEmitter,
  StatusBar,
} from 'react-native';
import BriefWallet from './BriefWallet';
import Shortcuts from './Shortcuts';
import UltrainNews from './UltrainNews';
import UpdateApp from './UpdateApp';
import DAppAdsBanner from './DAppAdsBanner';
import * as authService from '../../services/auth';
import NavigationUtil from '../../commons/NavigationUtil';
import Loading from '../components/Loading';
import DeviceInfo from 'react-native-device-info';
import I18n from '../../../resources/languages/I18n';
import CacheUtil from '../../commons/CacheUtil';
import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import { Events } from '../../services/events';
import { UserManager } from '../loginpage/UserManager';
import { GlobalSettings } from '../../services/GlobalSettings';
import { Tracker } from '../tracker/Tracker';
import { useNavigation } from '@react-navigation/native';

function versionCompare(v1, v2) {
  if (typeof v1 === 'number') {
    v1 = '0' + v1;
    v1 = v1.substr(1, v1.length - 1);
  }
  if (typeof v2 === 'number') {
    v2 = '0' + v2;
    v2 = v2.substr(1, v2.length - 1);
  }

  if (v1 === v2) {
    return 0;
  }
  var v1Arry = v1.split('.'),
    v2Arry = v2.split('.');

  for (var i = 0; i < v1Arry.length; i++) {
    if (i > v2Arry.length) {
      return 1;
    } else {
      if (parseInt(v1Arry[i]) > parseInt(v2Arry[i])) {
        return 1;
      } else if (parseInt(v1Arry[i]) < parseInt(v2Arry[i])) {
        return -1;
      }
    }
  }

  return -1;
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      showUpdateApp: false,
      changeLog: [],
      updateUrl: '',
      time: 0,
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
      loading: false,
      topping: [],
      network: 'MainNet',
      // network: 'TestNet',
    };
  }

  componentDidMount() {
    // 检测语言变动
    DeviceEventEmitter.addListener(Events.SYS_LANGUAGE_CHANGED, () => {
      const { setParams } = this.props.navigation;
      setParams({
        tabBarLabel: I18n.t('tab_navigator.home'),
      });
      this.headerData && this.headerData._onRefresh();
      this.columnData && this.columnData._onRefresh();
    });
    // DeviceEventEmitter.addListener('showToast', toastText => {
    //   this.refs.toast.show(toastText, DURATION.LENGTH_SHORT);
    // });
    DeviceEventEmitter.addListener(Events.WITHDRAW_LUCKY_UGAS, () => {
      this.triggerRedPackageWithdraw();
    });

    DeviceEventEmitter.addListener(Events.SYS_GLOBAL_CONFIG_UPDATED, this._onGlobalSettingsUpdated);
  }

  UNSAFE_componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners(Events.SYS_LANGUAGE_CHANGED);
    DeviceEventEmitter.removeAllListeners(Events.WITHDRAW_LUCKY_UGAS);
    DeviceEventEmitter.removeListener(Events.SYS_GLOBAL_CONFIG_UPDATED, this._onGlobalSettingsUpdated);
  }

  UNSAFE_componentWillMount() {
    this.loadGlobalSettings();
    this.triggerRedPackageWithdraw();
  }

  _onGlobalSettingsUpdated(value) {
    if (value) {
      let data = JSON.parse(value);
      this.setState({
        ugasPrice: data.ugasPrice,
        chainInfo: data.chainInfo,
        indexAds: data.contentData.indexAds,
        topContent: data.contentData.topContent,
        store: data.contentData.store,
        loading: false,
      });
    }
  }

  loadGlobalSettings() {
    GlobalSettings.config().then(result => {
      console.log('FFFF', JSON.stringify(result));
      if (result) {
        this.setState({
          ugasPrice: result.docs.ugasPrice,
          chainInfo: result.docs.chainInfo,
          topContent: result.docs.contentData.topContent,
          indexAds: result.docs.contentData.indexAds,
          store: result.docs.contentData.store,
          loading: false,
        });

        // 决定是否显示Top广告位区的DAPP
        if (!result.docs.openDappModule) {
          let topping = result.docs.contentData.topping.filter(a => {
            return a.title !== 'DAPP';
          });
          this.setState({ topping });
        } else {
          this.setState({
            topping: result.docs.contentData.topping,
          });
        }

        if (
          result.docs.version.version &&
          (versionCompare(
            DeviceInfo.getVersion(),
            result.docs.version.version,
          ) === -1 ||
            DeviceInfo.getVersion() - 0 < result.docs.version.version - 0)
        ) {
          this.setState({
            showUpdateApp: true,
            updateUrl: result.docs.version.updateUrl,
            changeLog:
              I18n.locale === 'en'
                ? result.docs.version.changeLogEn
                : result.docs.version.changeLogCn,
          });
        }
      }
    }).catch(e => {
      Tracker.exception('HomePage', JSON.stringify(e));
    });


    // setTimeout(() => {
    // const loggedIn = UserManager.isLogedIn;
    // const userInfo = UserManager.currentUser();
    //   if (
    //     loggedIn &&
    //     userInfo.wallets.length === 0 &&
    //     !this.state.showUpdateApp
    //   ) {
    //     this.setState({
    //       toastVisible: true,
    //       dialogSubmitText: I18n.t('page.createWallet'),
    //       submitComfirm: () => {
    //         NavigationUtil.go(this.props.navigation, HSRouter.CREATE_WALLET, {
    //           goBack: 'noBack',
    //         });
    //       },
    //       dialogCancelText: I18n.t('page.importWallet'),
    //       cancelBtnAction: () => {
    //         NavigationUtil.go(this.props.navigation, HSRouter.IMPORT_WALLET, {
    //           goBack: 'noBack',
    //         });
    //       },
    //       dialogTitle: I18n.t('wallet.finishWalletAccount'),
    //       dialogDec: '',
    //     });
    //   }
    // }, 0);
  }

triggerRedPackageWithdraw = () => {
  setTimeout(() => {
    const loggedIn = UserManager.isLogedIn;
    const userInfo = UserManager.currentUser();
    if (loggedIn && userInfo.wallets.length > 0) {
      authService.triggerRedPackageWithdraw({
        phoneNum: userInfo.phoneNum,
        recive: userInfo.wallets[0].accountName,
      });
    }
  }, 0);
};

onHeaderRef = ref => {
  this.headerData = ref;
};
onColumnRef = ref => {
  this.columnData = ref;
};

_onRefresh = () => {
  // this.loadGlobalSettings();
  this.headerData && this.headerData._onRefresh();
  this.columnData && this.columnData._onRefresh();
};

_fetchData = () => { };

render() {
  return (
    // 资讯的分页有点特殊,外加scrollview,容易出现滚动一次触发多次请求的情况
    <ScrollView
      style={styles.container}
      scrollEventThrottle={4000}
      refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={'transparent'}
        translucent={false}
      />
      {/* 账号及持币信息 */}
      {/* {this.state.chainInfo && ( */}
      <BriefWallet
        navigation={this.props.navigation}
        network={this.state.network}
        ugasPrice={this.state.ugasPrice}
        chainInfo={this.state.chainInfo}
        onRef={this.onHeaderRef}
      />
      {/* )} */}
      {/* 快捷App菜单 */}
      {this.state.topping && this.state.topping.length > 0 && (
        <Shortcuts
          navigation={this.props.navigation}
          topping={this.state.topping}
          onRef={this.onColumnRef}
        />
      )}
      {/* DApp推荐 */}
      <DAppAdsBanner
        navigation={this.props.navigation}
        network={this.state.network}
        config={this.state.chainInfo}
        indexAds={this.state.indexAds}
      />
      {/* 新闻列表 */}
      <UltrainNews navigation={this.props.navigation} topContent={this.state.topContent} />

      {/* <Loading visible={this.state.loading} /> */}
      {/*{!this.state.showUpdateApp && !this.state.loading}
        {this.state.showUpdateApp && !this.state.loading && (
          <UpdateApp
            {...this.props}
            changeLog={this.state.changeLog}
            updateUrl={this.state.updateUrl}
            visible={this.state.showUpdateApp}
            closeUpdateApp={() => {
              this.setState({showUpdateApp: false});
            }}
          />
        )} */}
    </ScrollView>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#1B1B20',
  },
  barAnimated: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.5)',
  },
});

export default HomePage;
// export default function (props) {
//   const navigation = useNavigation();
//   console.log('XXXXXXX', JSON.stringify(navigation));
//   return <HomePage {...props} navigation={navigation} />;
// }
