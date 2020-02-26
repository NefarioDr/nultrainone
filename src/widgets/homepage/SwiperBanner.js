import React from 'react';
import {
  StyleSheet,
  Image,
  View,
  DeviceEventEmitter,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {ImageUrl} from '../../constants/Urls';
import {Dimensions} from 'react-native';
import NavigationUtil from '../../commons/NavigationUtil';
import {getWalletInfo} from '../../commons/WalletUtil';
import ComfirmView from '../components/Comfirm';
import I18n from '../../../resources/languages/I18n';

import RNSecureKeyStore from 'react-native-secure-key-store';
import {SCREEN_WIDTH} from '../../constants/Common';

let height = SCREEN_WIDTH * 0.32;
const bannerBaseImg = require('../../../resources/img/bannerBaseImg.png');

class SwiperBanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: true,
      list: [],
      _data: [],
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
      config: null,
      comfirmItem: {},
      comfirmVisible: false,
    };
  }

  async componentDidMount() {
    await this.getWalletInfo();
    DeviceEventEmitter.addListener('changeWalletStatus', async () => {
      await this.getWalletInfo();
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('changeWalletStatus');
  }

  getWalletInfo = async () => {
    const {userInfo, network} = this.props;
    const selectionNetwork = network;
    const walletInfo = await getWalletInfo(
      selectionNetwork === 'TestNet' ? 'TestNet' : 'MainNet',
      userInfo,
    );
    this.setState({
      walletInfo: walletInfo,
    });
  };

  onPressHandler = article => {
    const {loggedIn} = this.props;
    if (article.needLogin && !loggedIn) {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    } else {
      if (!article.outlink || article.outlink === 'notLink') {
        navigate('Web', {article});
      } else {
        if (!article.outlink.includes('/')) {
          NavigationUtil.reset(this.props.navigation, article.outlink);
        } else if (article.outlink.includes('/dapp?')) {
          const dAppsId = this.GetQueryString(
            article.outlink.split('/dapp?')[1],
            'id',
          );
          const data = {
            _id: dAppsId,
          };
          navigate('DAppsDetail', {data});
        } else {
          if (article.needLegalDeclare) {
            this.setState({
              comfirmVisible: true,
              comfirmItem: article,
            });
            return;
          }
          this.bannerJudge(article);
        }
      }
    }
  };
  // 截取参数
  GetQueryString = (link, name) => {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = link.match(reg); //search,查询？后面的参数，并匹配正则
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  };

  submitComfirmView = () => {
    this.setState({
      comfirmVisible: false,
    });
    this.bannerJudge(this.state.comfirmItem);
  };

  _showImportWalletModal() {
    this.setState({
      toastVisible: true,
      dialogSubmitText: I18n.t('btn.confirm'),
      submitComfirm: () => {
        NavigationUtil.go(this.props.navigation, 'ImportWallet', {
          accountName: this.state.walletInfo.accountName,
        });
      },
      dialogCancelText: I18n.t('btn.cancel'),
      cancelBtnAction: () => {
        NavigationUtil.go(this.props.navigation, 'Home');
      },
      dialogTitle: I18n.t('page.prompt'),
      dialogDec: I18n.t('page.noGetWalletInfoTip'),
    });
  }

  async bannerJudge(data) {
    const {dispatch} = this.props.navigation;
    const {config, network, userInfo, loggedIn} = this.props;
    if (data.needAuth) {
      if (!this.state.walletInfo) {
        this.refs.toast.show(
          I18n.t('page.walletComfirm'),
          DURATION.LENGTH_SHORT,
        );
        return;
      }

      let key =
        userInfo.id +
        (this.state.walletInfo.walletId || this.state.walletInfo._id);
      await RNSecureKeyStore.get(key).then(
        res => {
          if (!res) {
            this._showImportWalletModal();
          }
        },
        err => {
          console.log(err);
          this._showImportWalletModal();
        },
      );
    }
    let noShare = false;
    let params = {
      url: data.outlink,
      shareUrl: data.outlink,
      config,
      noShare,
    };
    const connector = data.outlink.includes('?') ? '&' : '?';

    if (data.needLogin && loggedIn) {
      params = {
        url:
          data.outlink +
          connector +
          `userId=${userInfo.id}&phoneNum=${userInfo.phoneNum}&locale=${
            I18n.locale == 'en' ? 'en' : 'zh-CN'
          }`,
        shareUrl: data.outlink,
        config,
        noShare,
      };
    }
    if (data.needAuth) {
      params = {
        url:
          data.outlink +
          connector +
          `accountName=${this.state.walletInfo.accountName}&chainId=${
            data.chainId
          }&userId=${userInfo.id}&phoneNum=${userInfo.phoneNum}&locale=${
            I18n.locale == 'en' ? 'en' : 'zh-CN'
          }`,
        shareUrl: data.outlink,
        data: data,
        network,
        walletInfo: this.state.walletInfo,
        config,
      };
    }
    // TODO(liangqin)
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'WebView',
    //   params,
    // });
    // if (data.needAuth) {
    //   dispatch(navigateAction);
    // } else {
    //   dispatch(navigateAction);
    // }
  }

  renderBanner = () => {
    const {indexAds} = this.props;
    let imgs = [];
    indexAds.map(item => {
      imgs.push(
        <ImageBackground
          resizeMode="contain"
          key={item._id}
          style={styles.backgroundImg}
          source={bannerBaseImg}>
          <TouchableHighlight onPress={() => this.onPressHandler(item)}>
            <Image
              source={{uri: ImageUrl + '/' + item.pic}}
              style={styles.bannerImg}
            />
          </TouchableHighlight>
        </ImageBackground>,
      );
    });
    return imgs;
  };

  render() {
    const {indexAds} = this.props;
    if (indexAds && indexAds.length !== 0) {
      return (
        <View style={styles.swiperWrap}>
          <Swiper
            key={indexAds.length}
            style={styles.swiper} //样式
            height={height} //组件高度
            loop={true} //如果设置为false，那么滑动到最后一张时，再次滑动将不会滑到第一张图片。
            autoplay={true} //自动轮播
            autoplayTimeout={4} //每隔4秒切换
            horizontal={true} //水平方向，为false可设置为竖直方向
            paginationStyle={{
              bottom: 10,
              flexDirection: 'row',
              justifyContent: 'flex-end',
              paddingRight: 40,
            }} //小圆点的位置：距离底部10px
            showsButtons={false} //为false时不显示控制按钮
            showsPagination={true} //为false不显示下方圆点
            dot={
              <View
                style={{
                  //未选中的圆点样式
                  backgroundColor: 'rgba(255,255,255,.3)',
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  marginLeft: 3,
                  marginRight: 3,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  //选中的圆点样式
                  backgroundColor: '#fff',
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  marginLeft: 3,
                  marginRight: 3,
                }}
              />
            }>
            {this.renderBanner()}
          </Swiper>
          <ComfirmView
            visible={this.state.comfirmVisible}
            item={this.state.comfirmItem}
            submitComfirm={this.submitComfirmView}
            cancelComfirm={() => this.setState({comfirmVisible: false})}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  swiperWrap: {
    width: Dimensions.width,
    height: height,
    backgroundColor: '#1E1E24',
    borderRadius: 10,
  },
  line: {
    height: 1,
    width: '90%',
    marginHorizontal: '5%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 19,
  },
  backgroundImg: {
    height: height,
  },
  bannerImg: {
    borderRadius: 10,
    width: '90%',
    height: height,
    marginHorizontal: '5%',
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(SwiperBanner);

export default SwiperBanner;
