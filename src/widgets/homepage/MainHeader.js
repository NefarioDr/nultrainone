import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  DeviceEventEmitter,
  Modal,
  Dimensions,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import NavigationUtil from '../../commons/NavigationUtil';
import NetworkList from './NetworkList';
import WalletList from './WalletList';
import CacheUtil from '../../commons/CacheUtil';
import I18n from '../../../resources/languages/I18n';
import * as authService from '../../services/auth';
import {getWalletInfo} from '../../commons/WalletUtil';
// import {createU3} from 'u3.js';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../../constants/Common';

const authorizationIcon = require('../../../resources/img/authorizationIcon.png');
const selectIcon = require('../../../resources/img/selectIcon.png');
const scanning = require('../../../resources/img/scanning.png');
const goNext = require('../../../resources/img/goNext.png');
const revceiveIcon = require('../../../resources/img/revceiveIcon.png');
const sendIcon = require('../../../resources/img/sendIcon.png');
const openEyeW = require('../../../resources/img/openEyeW.png');
const closeEyeW = require('../../../resources/img/closeEyeW.png');
const closeIcon = require('../../../resources/img/closeIcon.png');

class MainHeader extends React.Component {
  constructor(props) {
    super(props);

    this.onRefresh = this._onRefresh.bind(this);
    this.state = {
      walletInfo: null,
      showNetworkList: false,
      selectionNetwork: 'MainNet',
      networkList: {},
      address: '',
      price: null,
      showWalletList: false,
      selectionWallet: '',
      toggleWallet: false,
      isAddWallet: false,
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
      config: null,
      countNum: 0,
      visible: false,
      digitalTwins: [],
    };
  }

  componentDidMount() {
    const {onRef} = this.props;
    if (onRef) {
      onRef(this);
    }

    // 监听钱包状态获取当前账号是否导入或者删除钱包，更改钱包状态
    DeviceEventEmitter.addListener('changeWalletStatus', async () => {
      await this.ugasPrice();
      this._fetchData();
    });
  }

  // 跳转到当前账号代币信息页面
  goTotalAssets() {
    this._onRefresh();
    NavigationUtil.go(this.props.navigation, 'TotalAssets', {
      accountName: this.state.walletInfo.accountName,
    });
  }

  componentWillUnmount() {
    DeviceEventEmitter.removeAllListeners('changeWalletStatus');
  }

  async componentWillMount() {
    await this._fetchData();
    await CacheUtil.getItem('eye1', (err, ret) => {
      if (err) {
        console.log(err);
        return;
      }
      if (ret) {
        const info = JSON.parse(ret);
        this.setState({
          toggleWallet: info.toggleWallet,
        });
      }
    });
    if (this.state.walletInfo) {
      this.checkBackupStatus();
    }
  }

  _onRefresh = async () => {
    await this.ugasPrice();
    this._fetchData();
  };

  _fetchData = async () => {
    const {chainInfo, network} = this.props;
    // 切换网络获取当前网络状态
    await CacheUtil.getItem('selectNetwork', (err, ret) => {
      if (err) {
        console.log(err);
        return;
      }
      if (ret) {
        ret = JSON.parse(ret);
        this.setState({
          config: ret,
          selectionNetwork: ret.key === 'TestNet' ? 'TestNet' : 'MainNet',
        });
      }
    });
    // 储存选择的链信息
    this.getNetworkList();
    await this.getWalletInfo();
    if (this.state.walletInfo && this.state.walletInfo.accountName) {
      try {
        const ugasBalance = await authService.getCurrencyBalance({
          accountName: this.state.walletInfo.accountName,
          symbol: 'UGAS',
          code: 'utrio.token',
          chainId: chainInfo.chainId,
          network,
        });
        if (ugasBalance.state == 'success') {
          let ugasNum = ugasBalance.data[0] ? ugasBalance.data[0] : '0 UGAS';
          this.setState({
            countNum: ugasNum.replace(' UGAS', ''),
          });
        }
      } catch (error) {
        console.log(error);
      }
      this.getDigitalTwinsByAccount();
    }
  };

  // 获取当前链信息
  getNetworkList = () => {
    const {chainInfo, network} = this.props;
    let networkData = chainInfo;
    networkData = Object.assign({}, networkData, {
      key: network,
    });
    CacheUtil.saveItem('selectNetwork', networkData);
  };

  // 获取当时法币汇率
  ugasPrice = async () => {
    await authService
      .ugasPrice()
      .then(result => {
        if (result.state === 'success') {
          this.setState({
            price: result.price[I18n.locale == 'en' ? 'usd' : 'cny'],
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  _selectNetwork = network => {
    this.setState({
      showNetworkList: false,
      selectionNetwork: network,
    });
    this.getWalletInfo(network);
    let networkData = {};
    if (this.state.networkList) {
      if (network === 'TestNet') {
        networkData = this.state.networkList.TestNet;
      } else {
        networkData = this.state.networkList.MainNet;
      }
    }
    networkData = Object.assign({}, networkData, {
      key: network === 'TestNet' ? 'TestNet' : 'MainNet',
    });
    CacheUtil.saveItem('selectNetwork', networkData);
    DeviceEventEmitter.emit(
      'selectNetwork',
      network === 'TestNet' ? 'TestNet' : 'MainNet',
    );
  };

  handleCreatClick = () => {
    const {loggedIn} = this.props;
    if (loggedIn) {
      NavigationUtil.go(this.props.navigation, 'CreateWallet', {
        goBack: 'Home',
      });
    } else {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    }
  };
  handleImportClick = () => {
    const {loggedIn} = this.props;
    if (loggedIn) {
      NavigationUtil.go(this.props.navigation, 'ImportWallet', {
        goBack: 'Home',
      });
    } else {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    }
  };

  // 获取当前账号钱包信息
  getWalletInfo = async network => {
    const {chainInfo, userInfo} = this.props;
    const selectionNetwork = network || this.state.selectionNetwork;
    const walletInfo = await getWalletInfo(
      selectionNetwork === 'TestNet' ? 'TestNet' : 'MainNet',
      userInfo,
    );
    const selectionWallet = walletInfo ? walletInfo.accountName : '';
    // if (!!userInfo && !!userInfo.id && !!walletInfo) {
    //   const key = userInfo.id + (walletInfo.walletId || walletInfo._id)
    //   clearWallet(chainInfo, walletInfo.accountName, key)
    // }
    this.setState({
      walletInfo: walletInfo,
      selectionWallet,
    });
  };

  goScanning = () => {
    const {userInfo, loggedIn} = this.props;
    if (loggedIn) {
      NavigationUtil.reset(this.props.navigation, 'Scanner');
    } else {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    }
  };

  goSend = () => {
    NavigationUtil.reset(this.props.navigation, 'Send');
  };

  goRevceive = () => {
    NavigationUtil.reset(this.props.navigation, 'Revceive');
  };

  goAuthorization = () => {
    NavigationUtil.reset(this.props.navigation, 'Authorization');
  };

  _selectWallet = async wallet => {
    const {userInfo, chainInfo} = this.props;
    this.setState({
      showWalletList: false,
      selectionWallet: wallet.accountName,
    });
    let openInfo = {
      walletId: wallet._id,
      userId: userInfo.id,
      accountName: wallet.accountName,
    };
    // const u3 = createU3(chainInfo);
    // const acc_info = await u3.getAccountByName(wallet.accountName);
    // openInfo.public_key = acc_info.activePk;

    let str = 'walletInfo_' + userInfo.id;
    CacheUtil.saveItem(str, openInfo);
    // const key = userInfo.id + wallet._id
    // clearWallet(chainInfo, wallet.accountName, key)
    this._fetchData();
    DeviceEventEmitter.emit('changeWalletStatus');
  };

  isShowWalletList = async () => {
    const {chainInfo, network} = this.props;
    try {
      await Promise.all(
        this.state.walletInfo.walletList.map(async wallet => {
          const ugasBalance = await authService.getCurrencyBalance({
            accountName: wallet.accountName,
            symbol: 'UGAS',
            code: 'utrio.token',
            chainId: chainInfo.chainId,
            network,
          });
          if (ugasBalance.state == 'success') {
            let ugasNum = ugasBalance.data[0] ? ugasBalance.data[0] : '0 UGAS';
            wallet.ugasNum = ugasNum;
          }
        }),
      );

      this.setState({
        showWalletList: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  checkBackupStatus = () => {
    let walletArr = [];
    this.state.walletInfo.walletList &&
      this.state.walletInfo.walletList.map(wallet => {
        walletArr.push(wallet._id);
      });
    authService
      .checkBackupStatus({walletIds: walletArr.toString()})
      .then(result => {
        if (result.state === 'success') {
          for (let backup of result.docs) {
            if (!backup.backedUp) {
              this.setState({
                visible: true,
                dialogSubmitText: I18n.t('wallet.backupNow'),
                submitComfirm: () => {
                  this.setState({visible: false}, () => {
                    setTimeout(() => {
                      NavigationUtil.go(this.props.navigation, 'MoreWallet');
                    }, 500);
                  });
                },
                dialogCancelText: I18n.t('wallet.backupLater'),
                cancelBtnAction: () => {},
                dialogTitle: I18n.t('wallet.walletBackupRequired'),
                dialogDec: I18n.t('wallet.walletBackupRequiredTips'),
              });
              break;
            }
          }
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  toggleEye = status => {
    CacheUtil.saveItem('eye1', JSON.stringify({toggleWallet: status}));
    this.setState({toggleWallet: status});
  };

  getDigitalTwinsByAccount = async () => {
    const {userInfo} = this.props;
    try {
      const digitalTwins = await authService.getDigitalTwinsByAccount({
        accountName: this.state.walletInfo.accountName,
        userId: userInfo.id,
      });
      if (digitalTwins.state == 'success') {
        this.setState({
          digitalTwins: digitalTwins.docs,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const {ugasPrice} = this.props;
    let price = this.state.price;
    if (ugasPrice) {
      price =
        this.state.price || ugasPrice[I18n.locale == 'en' ? 'usd' : 'cny'];
    }
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.8}}
          colors={['#3DA1F6', '#2E5BF7']}
          style={styles.containerBg}>
          <View style={styles.containerBgParts} />
        </LinearGradient>
        <View style={styles.containerBox}>
          <View style={styles.containerTop}>
            {this.state.walletInfo && this.state.walletInfo.accountName ? (
              <TouchableOpacity
                activeOpacity={0.6}
                style={styles.topNameBox}
                onPress={() => this.isShowWalletList()}>
                <Text style={styles.topName}>
                  {this.state.walletInfo.accountName}
                </Text>
                <Image
                  style={{width: 11, height: 6, marginLeft: 6, marginTop: 3}}
                  source={selectIcon}
                />
              </TouchableOpacity>
            ) : (
              <View style={styles.topNameBox}>
                <Text style={styles.topName} />
              </View>
            )}

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() => this.goScanning()}>
              <Image
                style={{width: 20, height: 20, marginLeft: 40}}
                source={scanning}
              />
            </TouchableOpacity>
          </View>
          {this.state.walletInfo ? (
            <View style={styles.haveWallet}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.goTotalAssets()}>
                <View style={styles.walletInfor}>
                  <View style={styles.walletAssets}>
                    {this.state.toggleWallet ? (
                      <View style={styles.numBox}>
                        <Text style={styles.num}>
                          {price &&
                          this.state.countNum &&
                          this.state.countNum != 0
                            ? (price * this.state.countNum).toFixed(2)
                            : 0}
                        </Text>
                        <Text style={styles.company}>
                          {I18n.locale == 'en' ? 'USD' : 'CNY'}
                        </Text>
                        <TouchableOpacity
                          style={styles.desensitization}
                          activeOpacity={0.8}
                          onPress={() => this.toggleEye(false)}>
                          <Image
                            style={{width: 20, height: 14, marginTop: 6}}
                            source={openEyeW}
                          />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.numBox}>
                        <Text style={styles.num}>*****</Text>
                        <TouchableOpacity
                          style={styles.desensitization}
                          activeOpacity={0.8}
                          onPress={() => this.toggleEye(true)}>
                          <Image
                            style={{width: 20, height: 9}}
                            source={closeEyeW}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <Text style={styles.assets}>
                      ( {I18n.t('page.totalAssets')} )
                    </Text>
                  </View>
                  <View style={styles.goNextBox}>
                    {(this.state.walletInfo.hasTwins ||
                      this.state.digitalTwins.length > 0) && (
                      <Text style={styles.goNextText}>查看数字孪生</Text>
                    )}
                    <Image style={{width: 8, height: 11}} source={goNext} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.topBar}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    this.state.selectionNetwork == 'TestNet' && {width: '50%'},
                  ]}
                  onPress={() => this.goSend()}>
                  <View style={[styles.topBarCard]}>
                    <Image
                      style={[
                        {
                          width: 20,
                          height: 20,
                          marginRight: 8,
                        },
                        this.state.selectionNetwork == 'TestNet' && {
                          marginRight: 12,
                        },
                      ]}
                      source={sendIcon}
                    />
                    <Text style={styles.barText}>{I18n.t('page.send')}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    this.state.selectionNetwork == 'TestNet' && {width: '50%'},
                  ]}
                  onPress={() => this.goRevceive()}>
                  <View style={[styles.topBarCard, styles.leftBorder]}>
                    <Image
                      style={[
                        {
                          width: 20,
                          height: 20,
                          marginRight: 8,
                        },
                        this.state.selectionNetwork == 'TestNet' && {
                          marginRight: 12,
                        },
                      ]}
                      source={revceiveIcon}
                    />
                    <Text style={styles.barText}>
                      {I18n.t('page.revceive')}
                    </Text>
                  </View>
                </TouchableOpacity>
                {this.state.selectionNetwork == 'MainNet' && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.goAuthorization()}>
                    <View style={[styles.topBarCard, styles.leftBorder]}>
                      <Image
                        style={{width: 20, height: 20, marginRight: 8}}
                        source={authorizationIcon}
                      />
                      <Text style={styles.barText}>
                        {I18n.t('page.authorizationText')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ) : (
            <View style={styles.noWallet}>
              <View style={styles.btnBox}>
                <Button
                  containerStyle={[styles.btnStyle]}
                  style={styles.btnText}
                  text={I18n.t('page.createWallet')}
                  onPress={this.handleCreatClick}
                />
                <Button
                  containerStyle={[styles.btnStyle]}
                  style={styles.btnText}
                  text={I18n.t('page.importWallet')}
                  onPress={this.handleImportClick}
                />
              </View>
              <Text style={styles.createTips}>
                {I18n.t('page.createAccountTips')}
              </Text>
            </View>
          )}
        </View>
        <NetworkList
          visible={this.state.showNetworkList}
          selectionNetwork={this.state.selectionNetwork}
          selectNetwork={this._selectNetwork}
          {...this.props}
        />
        {this.state.showWalletList && (
          <WalletList
            visible={this.state.showWalletList}
            walletList={this.state.walletInfo.walletList}
            selectionWallet={this.state.selectionWallet}
            selectWallet={this._selectWallet}
            isAddWallet={this.state.isAddWallet}
            config={this.state.config}
            closeWallet={() => {
              this.setState({
                showWalletList: false,
              });
            }}
            goWalletMessage={() => {
              this.setState(
                {
                  showWalletList: false,
                },
                () => {
                  setTimeout(() => {
                    NavigationUtil.go(this.props.navigation, 'MoreWallet');
                  }, 500);
                },
              );
            }}
            props={this.props}
          />
        )}
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
        <Modal
          visible={this.state.visible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => this.setState({visible: false})}>
          <View style={styles.bg}>
            <View style={styles.dialog}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 20,
                  top: 16,
                }}
                activeOpacity={0.8}
                onPress={() => this.setState({visible: false})}>
                <Image
                  source={closeIcon}
                  style={{
                    width: 16,
                    height: 16,
                  }}
                />
              </TouchableOpacity>
              <Text style={styles.dialogTitle}>{this.state.dialogTitle}</Text>
              <View style={styles.backupsTips}>
                <Text style={styles.backupsTipsColor}>
                  {I18n.t('wallet.notStoreKey')}
                </Text>
              </View>
              <View style={styles.dialogDecs}>
                <View style={styles.dialogDecsLine}>
                  <View style={styles.lineOrder} />
                  <Text style={styles.lineText}>
                    {I18n.t('wallet.backupsList')[0]}
                  </Text>
                </View>
                <View style={styles.dialogDecsLine}>
                  <View style={styles.lineOrder} />
                  <Text style={styles.lineText}>
                    {I18n.t('wallet.backupsList')[1]}
                  </Text>
                </View>
                <View style={styles.dialogDecsLine}>
                  <View style={styles.lineOrder} />
                  <Text style={styles.lineText}>
                    {I18n.t('wallet.backupsList')[2]}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={[styles.dialogBtn, styles.dialogSubmitBtn]}
                onPress={this.state.submitComfirm}>
                <Text style={styles.submitBtnText}>
                  {this.state.dialogSubmitText}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: 245,
  },
  containerBg: {
    height: 245,
  },
  containerBgParts: {
    width: 178,
    height: 178,
    backgroundColor: 'rgba(56,42,221,0.20);',
    transform: [{rotate: '-27deg'}, {translateX: -50}, {translateY: -60}],
  },
  containerBox: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 245,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 38,
  },
  containerTop: {
    position: 'relative',
    width: '90%',
    height: 24,
    marginRight: -8,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  selectNetwork: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 60,
  },
  networkText: {
    fontSize: 12,
    color: '#fff',
  },
  topNameBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 24,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFF',
    textAlign: 'center',
  },
  noWallet: {
    marginTop: 50,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  btnBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnStyle: {
    width: 130,
    height: 35,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginLeft: 15,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
  },
  createTips: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 216,
    marginTop: 22,
    textAlign: 'center',
    fontSize: 11,
    lineHeight: 16,
    color: 'rgba(255,255,255,0.80)',
  },
  haveWallet: {
    marginTop: 24,
    width: '100%',
  },
  walletInfor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    width: '100%',
    paddingLeft: 20,
    paddingRight: 20,
  },
  walletAssets: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  numBox: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  num: {
    fontSize: 38,
    fontWeight: '500',
    color: '#FFF',
  },
  company: {
    fontSize: 15,
    fontWeight: '500',
    color: '#FFF',
    marginLeft: 8,
    marginBottom: 6,
  },
  desensitization: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    marginLeft: 15,
  },
  assets: {
    fontSize: 15,
    color: '#FFF',
    marginTop: 6,
  },
  topBar: {
    marginTop: 28,
    width: '100%',
    height: 62,
    backgroundColor: 'rgba(216,216,216,0.20)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 10,
  },
  topBarCard: {
    paddingLeft: 15,
    paddingRight: 15,
    minWidth: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  barText: {
    fontSize: 15,
    color: '#fff',
  },
  leftBorder: {
    borderColor: 'rgba(255,255,255,0.50);',
    borderLeftWidth: 0.5,
    height: 20,
  },
  bg: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 23,
  },
  dialog: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingBottom: 8,
    position: 'relative',
  },
  dialogTitle: {
    color: '#3A424C',
    marginVertical: 20,
    fontSize: 24,
    lineHeight: 29,
    textAlign: 'center',
    fontWeight: '700',
  },
  backupsTips: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 30,
    backgroundColor: 'rgba(255,60,84,.1)',
  },
  backupsTipsColor: {
    textAlign: 'center',
    color: '#FF3C54',
    fontSize: 12,
  },
  dialogDecs: {
    flexDirection: 'column',
    paddingHorizontal: 16,
    marginTop: 10,
    width: '100%',
  },
  dialogDecsLine: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  lineOrder: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#000',
    marginRight: 6,
    marginTop: 3,
  },
  lineText: {
    fontSize: 12,
  },
  dialogBtn: {
    marginTop: 20,
    height: 57,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  dialogSubmitBtn: {
    backgroundColor: '#00AEEF',
  },
  submitBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  goNextBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goNextText: {
    fontSize: 12,
    color: '#fff',
    marginRight: 12,
  },
});

// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(MainHeader);
export default MainHeader;
