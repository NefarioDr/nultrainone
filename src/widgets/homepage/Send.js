import React from 'react';
import {connect} from 'react-redux';
import I18n from 'react-native-i18n';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  StatusBar,
  DeviceEventEmitter,
} from 'react-native';
import * as Images from '../../../resources/img/Images';
import * as authService from '../../../services/auth';
import Button from '../components/Button';
import StorageHelper from '../../constants/commons/StorageHelper';

const scanning = require('../../../resources/img/scanning.png');

const SCREEN_HEIGHT = Dimensions.get('window').height;
const TOASTTOP = SCREEN_HEIGHT / 2 - 180;
const SEMBOLD = '700';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Loading from '../components/Loading';
import CacheUtils from '../../constants/commons/CacheUtil';
import SelectCurrency from './SelectCurrency';
import TransactionDetail from './TransactionDetail';
import WalletPassword from './WalletPassword';
import {BaseUrl, ImageUrl} from '../../../constants/Urls';
import {getWalletInfo} from '../../constants/commons/WalletUtil';
import NavigationUtil from '../../constants/commons/NavigationUtil';
import {createU3} from 'u3.js';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import moment from 'moment';

const headLogo = require('../../../resources/img/headLogo2.png');
const goNext = require('../../../resources/img/goNext.png');
const amountReg = /^\d+(\.\d+)?$/;
const numReg = /^\d+(\.)?$/;

class Send extends React.Component {
  static navigationOptions = ({navigation}) => ({
    headerTitle: I18n.t('page.send'),
    headerLeft: (
      <View>
        <TouchableOpacity
          style={{marginLeft: 18}}
          onPress={() => navigation.navigate('Home')}>
          <Image
            source={{uri: Images.GO_BACK_BLACK}}
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>
      </View>
    ),
    headerStyle: {
      backgroundColor: '#1E1E24',
      borderBottomWidth: 0.5,
      borderBottomColor: '#1E1E24',
    },
    headerTintColor: '#fff',
  });

  constructor(props) {
    super(props);
    let toName = '';
    if (
      this.props.navigation &&
      this.props.navigation.state &&
      this.props.navigation.state.params
    ) {
      toName = this.props.navigation.state.params.toName || '';
      //console.log(this.props.navigation.state.params.toName,123456789);
    }
    this.state = {
      isLoading: false,
      toName: toName,
      amount: '',
      memo: '',
      walletInfo: {},
      isfocusToName: false,
      isfocusAmount: false,
      isfocusMemo: false,
      isDisabled: true,
      warnTipToName: false,
      warnTipAmount: false,
      network: 'MainNet',
      config: null,
      showCurrency: false,
      currency: null,
      showDetail: false,
      showWalletPassword: false,
      warnInputValue: '',
      inputValue: '',
      bizId: '',
      toastVisible: false,
      dialogSubmitText: '',
      submitComfirm: null,
      dialogCancelText: '',
      cancelBtnAction: null,
      dialogTitle: '',
      dialogDec: '',
      transFee: '0.2000 UGAS',

      showPwdInput: true,
    };
  }

  async componentDidMount() {
    DeviceEventEmitter.addListener('scanTransfer', toName => {
      this.setState({
        toName: toName,
      });
    });
  }

  async componentWillMount() {
    this.getTransFee();
    let result = await StorageHelper.get('selectNetwork');
    this.setState({
      network: result.key,
      config: result,
    });
    await this.getWalletInfo();
    await this.fetchCurrency(result);
  }

  fetchCurrency = async chainInfo => {
    const ugasBalance = await authService.getCurrencyBalance({
      accountName: this.state.walletInfo.accountName,
      symbol: 'UGAS',
      code: 'utrio.token',
      chainId: chainInfo.chainId,
      network: chainInfo.key,
    });
    if (ugasBalance.state === 'success') {
      let ugasNum = ugasBalance.data[0] ? ugasBalance.data[0] : '0 UGAS';
      this.setState({
        currency: {
          balance: ugasNum,
          chain: {
            httpEndpoint: chainInfo.httpEndpoint,
            httpEndpointHistory: chainInfo.httpEndpointHistory,
            chainId: chainInfo.chainId,
            name: chainInfo.name,
            network: chainInfo.key,
          },
          decimals: 4,
          symbol: 'UGAS',
          tokenAccount: 'utrio.token',
          tokenLogo: '/images/default_token.png',
        },
      });
    }
  };

  goScanning = () => {
    const {userInfo, loggedIn} = this.props;
    if (loggedIn) {
      NavigationUtil.reset(this.props.navigation, 'Scanner');
    } else {
      NavigationUtil.reset(this.props.navigation, 'Landing');
    }
  };

  getWalletInfo = async () => {
    const {userInfo} = this.props;
    const walletInfo = await getWalletInfo(this.state.network, userInfo);
    let key = userInfo.id + (walletInfo.walletId || walletInfo._id);
    await RNSecureKeyStore.get(key).then(
      res => {
        if (!res) {
          this.setState({
            toastVisible: true,
            dialogSubmitText: I18n.t('btn.confirm'),
            submitComfirm: () => {
              NavigationUtil.go(this.props.navigation, 'ImportWallet', {
                accountName: walletInfo.accountName,
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
      },
      err => {
        console.log(err);
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('btn.confirm'),
          submitComfirm: () => {
            NavigationUtil.go(this.props.navigation, 'ImportWallet', {
              accountName: walletInfo.accountName,
            });
          },
          dialogCancelText: I18n.t('btn.cancel'),
          cancelBtnAction: () => {
            NavigationUtil.go(this.props.navigation, 'Home');
          },
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: I18n.t('page.noGetWalletInfoTip'),
        });
      },
    );
    this.setState({
      walletInfo: walletInfo,
    });
  };

  getTransFee = () => {
    CacheUtils.getItem('transFee', (err, value) => {
      if (value) {
        this.setState({
          transFee: value,
        });
      }
    });
  };

  focus = fname => {
    if (fname === 'toName') {
      this.setState({
        isfocusToName: true,
      });
    }
    if (fname === 'amount') {
      this.setState({
        isfocusAmount: true,
      });
    }
    if (fname === 'memo') {
      this.setState({
        isfocusMemo: true,
      });
    }
  };

  blur = fname => {
    if (fname === 'amount') {
      let amount = this.state.amount;
      if (this.state.currency) {
        amount = (amount - 0).toFixed(this.state.currency.decimals);
        if (
          !amountReg.test(amount) ||
          parseFloat(amount) >
            parseFloat(this.state.currency ? this.state.currency.balance : 0)
        ) {
          this.setState({
            isfocusAmount: false,
            warnTipAmount: true,
            amount,
          });
        } else {
          this.setState({
            isfocusAmount: false,
            warnTipAmount: false,
            amount,
          });
        }
      } else {
        this.setState({
          isfocusAmount: false,
          warnTipAmount: true,
          amount: '',
        });
      }
    }
    if (fname === 'memo') {
      this.setState({
        isfocusMemo: false,
      });
    }
  };

  showCurrency = () => {
    this.setState({showCurrency: true});
  };

  selectCurrency = currency => {
    this.setState({
      showCurrency: false,
      currency,
      amount: '',
    });
    setTimeout(() => {
      if (
        !this.state.warnTipToName &&
        !this.state.warnTipAmount &&
        this.state.amount &&
        this.state.toName
      ) {
        this.setState({
          isDisabled: false,
        });
      } else {
        this.setState({
          isDisabled: true,
        });
      }
    }, 0);
  };

  handleSubmit = async () => {
    this.setState({isLoading: true});

    //先判断是否在主链
    const u3__ = createU3(this.state.config);
    try {
      await u3__.getAccountInfo({
        account_name: this.state.toName,
      });
    } catch (error) {
      this.setState({isLoading: false});
      this.refs.toast.show(
        I18n.t('page.transactionNotExistAccount'),
        DURATION.LENGTH_SHORT,
      );
      return;
    }

    //如果发生在侧链，再判断是否已同步到侧链
    if (
      this.state.currency.chain.key !== 'MainNet' ||
      this.state.currency.chain.name !== 'ultrainio'
    ) {
      const u3_ = createU3(this.state.currency.chain);
      try {
        await u3_.getAccountInfo({
          account_name: this.state.toName,
        });
      } catch (error) {
        this.setState({isLoading: false});
        this.refs.toast.show(
          I18n.t('page.transactionNotAuthorized'),
          DURATION.LENGTH_SHORT,
        );
        return;
      }
    }

    // 判断账号是否异常提示
    try {
      if (this.state.walletInfo.accountName === this.state.toName) {
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('btn.okay'),
          submitComfirm: () => {},
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: I18n.t('page.sameAccount'),
        });
        return;
      }
      const payingResult = await authService.checkWallet({
        accountName: this.state.walletInfo.accountName,
        network: this.state.network,
        accountType: 'paying',
      });
      if (payingResult.state === 'success') {
      } else {
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('btn.okay'),
          submitComfirm: () => {},
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: payingResult.message,
          isLoading: false,
        });
        return;
      }
      const receivingResult = await authService.checkWallet({
        accountName: this.state.toName,
        network: this.state.network,
        accountType: 'receiving',
      });
      if (receivingResult.state === 'success') {
      } else {
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('btn.okay'),
          submitComfirm: () => {},
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: receivingResult.message,
          isLoading: false,
        });
        // toastUtil.showLong(I18n.t("page.ReceivingAbnorma"), true);
        return;
      }
      this.setState({isLoading: false});
    } catch (error) {
      this.setState({isLoading: false});
      console.log(error);
    }

    if (this.state.warnTipAmount || this.state.warnTipToName) {
      return false;
    }
    this.setState({showDetail: true});
  };

  closeWalletPassword = (status, item) => {
    if (this.state.showWalletPassword === true) {
      this.setState({showWalletPassword: false});
    }

    if (status === 'success') {
      if (item) {
        this.setState({
          toastVisible: true,
          dialogSubmitText: I18n.t('page.ViewTx'),
          submitComfirm: () => {
            NavigationUtil.go(this.props.navigation, 'TransactionDetail', {
              item,
            });
          },
          dialogCancelText: I18n.t('page.ContinueTransfer'),
          cancelBtnAction: () => {},
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: I18n.t('page.transferTxHasSend'),
        });
      } else {
        this.setState({
          toastVisible: true,
          dialogSubmitText: '',
          submitComfirm: () => {},
          dialogCancelText: I18n.t('page.ContinueTransfer'),
          cancelBtnAction: () => {},
          dialogTitle: I18n.t('page.prompt'),
          dialogDec: I18n.t('page.transferTxHasSend'),
        });
      }
    }
  };

  detailSubmit = async () => {
    let freeInputExpireAt = await StorageHelper.get('freeInputExpireAt');
    const showPwdInput =
      freeInputExpireAt === null || moment().isAfter(moment(freeInputExpireAt));
    this.setState({
      showDetail: false,
      showWalletPassword: true,
      showPwdInput,
    });

    if (showPwdInput === false) {
      this.walletPassword.walletPasswordSubmit();
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView style={{backgroundColor: '#1E1E24'}}>
        <StatusBar backgroundColor="#1E1E24" translucent={false} />

        <View style={styles.container}>
          <View style={styles.contain}>
            <View>
              <View style={[styles.containItem]}>
                <View style={[styles.containRight]}>
                  <Text
                    style={[
                      styles.title,
                      this.state.isfocusToName ? styles.highTitle : '',
                    ]}>
                    {I18n.t('page.to')}
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => this.goScanning()}>
                    <Image style={{width: 20, height: 20}} source={scanning} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  onFocus={() => {
                    this.focus('toName');
                  }}
                  onBlur={() => {
                    this.blur('toName');
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  style={[
                    styles.inputStyle,
                    this.state.isfocusToName ? styles.highLine : '',
                  ]}
                  underlineColorAndroid="transparent"
                  onChangeText={toName => {
                    this.setState({toName});
                    this.setState({
                      isDisabled:
                        !toName || !this.state.amount || this.state.amount == 0,
                    });
                  }}
                  value={this.state.toName}
                />
                {this.state.warnTipToName && (
                  <Text
                    style={[
                      styles.inputTips,
                      this.state.warnTipToName ? styles.inputErrorTips : '',
                    ]}>
                    {I18n.t('validator.sendName')}
                  </Text>
                )}
              </View>

              <View style={[styles.containItem]}>
                <View style={styles.selectWrap}>
                  <Text
                    style={[
                      styles.title,
                      this.state.isfocusAmount ? styles.highTitle : '',
                    ]}>
                    {I18n.t('page.amount')}
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.select]}
                    onPress={this.showCurrency}>
                    {this.state.currency &&
                    this.state.currency.symbol == 'UGAS' ? (
                      <Image
                        resizeMode="contain"
                        style={{width: 20, height: 23}}
                        source={headLogo}
                      />
                    ) : (
                      <Image
                        source={{
                          uri: this.state.currency
                            ? ImageUrl + this.state.currency.tokenLogo
                            : '',
                        }}
                        style={{
                          width: 20,
                          height: 23,
                        }}
                      />
                    )}

                    <Text
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        marginHorizontal: 8,
                      }}>
                      {this.state.currency
                        ? this.state.currency.symbol
                        : I18n.t('page.SelectToken')}
                    </Text>
                    <Image
                      source={goNext}
                      style={{
                        width: 6,
                        height: 12,
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <TextInput
                  onFocus={() => {
                    this.focus('amount');
                  }}
                  onBlur={() => {
                    this.blur('amount');
                  }}
                  style={[
                    styles.inputStyle,
                    this.state.isfocusAmount ? styles.highLine : '',
                  ]}
                  underlineColorAndroid="transparent"
                  onChangeText={amount => {
                    if (
                      amountReg.test(amount) ||
                      numReg.test(amount) ||
                      amount === ''
                    ) {
                      this.setState({amount});
                      this.setState({
                        isDisabled:
                          !amount ||
                          amount == 0 ||
                          parseFloat(amount) >
                            parseFloat(
                              this.state.currency
                                ? this.state.currency.balance
                                : 0,
                            ) ||
                          !this.state.toName,
                      });
                    }
                  }}
                  value={this.state.amount}
                />
                <Text
                  style={[
                    styles.inputTips,
                    this.state.warnTipAmount ? styles.inputErrorTips : '',
                  ]}>
                  {I18n.t('page.remainingAssetAmount')}:{' '}
                  {this.state.currency ? this.state.currency.balance : 0}
                </Text>

                {this.state.currency &&
                this.state.currency.symbol === 'UGAS' ? (
                  <Text
                    style={[
                      styles.inputTips,
                      this.state.warnTipAmount ? styles.inputErrorTips : '',
                    ]}>
                    {I18n.t('page.fee')}: {this.state.transFee}
                  </Text>
                ) : null}
              </View>
              <View style={[styles.containItem]}>
                <Text
                  style={[
                    styles.title,
                    this.state.isfocusMemo ? styles.highTitle : '',
                  ]}>
                  {I18n.t('page.memo')}
                </Text>
                <TextInput
                  onFocus={() => {
                    this.focus('memo');
                  }}
                  onBlur={() => {
                    this.blur('memo');
                  }}
                  placeholder={I18n.t('page.optional')}
                  placeholderTextColor="rgba(255,255,255,.2)"
                  style={[
                    styles.inputStyle,
                    this.state.isfocusMemo ? styles.highLine : '',
                  ]}
                  underlineColorAndroid="transparent"
                  onChangeText={memo => {
                    this.setState({memo});
                  }}
                  value={this.state.memo}
                />
              </View>
            </View>

            <Button
              containerStyle={[
                styles.btn,
                this.state.isDisabled ? styles.btnBgDisabled : styles.btnBg,
              ]}
              style={[
                styles.btnText,
                this.state.isDisabled ? styles.btnTextDisabled : '',
              ]}
              text={I18n.t('login.Next')}
              disabled={this.state.isDisabled}
              onPress={this.handleSubmit}
            />
          </View>
        </View>

        <SelectCurrency
          accountName={this.state.walletInfo.accountName}
          network={this.state.network}
          config={this.state.config}
          visible={this.state.showCurrency}
          currency={this.state.currency}
          selectCurrency={this.selectCurrency}
          {...this.props}
        />

        {this.state.currency && (
          <TransactionDetail
            visible={this.state.showDetail}
            walletInfo={this.state.walletInfo.accountName}
            transFee={this.state.transFee}
            sendExhibitionData={[
              {
                currency: this.state.currency,
                accountName: this.state.walletInfo.accountName,
                toName: this.state.toName,
                amount: this.state.amount,
                unit: this.state.currency ? this.state.currency.symbol : null,
                memo: this.state.memo,
                action: I18n.t('page.Transfer'),
              },
            ]}
            closeDetail={() => {
              this.setState({showDetail: false});
            }}
            detailSubmit={this.detailSubmit}
            {...this.props}
          />
        )}

        {this.state.showWalletPassword && (
          <WalletPassword
            showPwdInput={this.state.showPwdInput}
            sendData={{
              formData: {
                payer: this.state.walletInfo.accountName,
                receiver: this.state.toName,
                quantity: this.state.amount,
                memo: this.state.memo,
              },
              action: 'transfer',
              bizId: new Date().getTime(),
              type: 'transfer',
              currency: this.state.currency,
            }}
            walletInfo={this.state.walletInfo}
            visible={this.state.showWalletPassword}
            closeWalletPassword={(status, item) =>
              this.closeWalletPassword(status, item)
            }
            onRef={ref => (this.walletPassword = ref)}
            {...this.props}
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
        <Toast
          ref="toast"
          style={{
            backgroundColor: '#fff',
            width: 200,
            paddingHorizontal: 15,
            paddingVertical: 25,
            borderRadius: 5,
          }}
          position="top"
          positionValue={TOASTTOP}
          fadeInDuration={750}
          fadeOutDuration={1200}
          opacity={1}
          textStyle={{
            color: '#4A4A4A',
            fontSize: 12,
            lineHeight: 17,
            textAlign: 'center',
            fontWeight: SEMBOLD,
          }}
        />
        {this.state.isLoading ? <Loading visible={true} /> : null}
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#1E1E24',
    height: '100%',
  },
  contain: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: 25,
    paddingBottom: 60,
  },
  containItem: {
    width: '100%',
    height: 'auto',
    marginBottom: 23,
    flexDirection: 'column',
  },
  containRight: {
    position: 'relative',
    width: '100%',
    height: 24,
    marginRight: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },
  highLine: {
    borderColor: 'rgba(2,159,218,.9)',
  },
  selectWrap: {
    height: 17,
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    height: 17,
    fontSize: 12,
    width: '100%',
    color: '#fff',
  },
  highTitle: {
    color: 'rgba(255,255,255,.5)',
  },
  select: {
    width: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -90,
  },
  inputStyle: {
    padding: 0,
    height: 40,
    width: '100%',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: SEMBOLD,
    color: '#fff',
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,.1)',
  },
  btn: {
    width: '100%',
    height: 57,
    marginTop: 160,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnBg: {
    backgroundColor: '#00AEEF',
  },
  btnBgDisabled: {
    backgroundColor: '#105F7F',
  },
  btnText: {
    fontSize: 15,
    fontWeight: SEMBOLD,
    color: '#fff',
  },
  btnTextDisabled: {
    color: '#8E8E91',
  },
  inputTips: {
    fontSize: 13,
    color: '#029FDA',
    marginTop: 9,
  },
  inputErrorTips: {
    color: '#FF3C54',
  },
});
// const mapStateToProps = state => {
//   return {
//     userInfo: state.auth.userInfo,
//     loggedIn: state.auth.loggedIn,
//     registered: state.auth.registered,
//   };
// };
// export default connect(mapStateToProps)(Send);

export default Send;
