import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Image,
  TextInput,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import Button from '../components/Button';
import I18n from '../../../resources/languages/I18n';
import * as authService from '../../../services/auth';
import RNSecureKeyStore from 'react-native-secure-key-store';
import {createU3, U3Utils} from 'u3.js';
import Toast from 'react-native-root-toast';
import Loading from '../components/Loading';
import NavigationUtil from '../../commons/NavigationUtil';
import StorageHelper from '../../commons/StorageHelper';
import moment from 'moment';
import crypto from 'react-native-crypto';
import {ENCRYPT_KEY} from '../../../Common';
import {SCREEN_HEIGHT} from '../../Common';

const closeIcon = require('../../../resources/img/closeIcon.png');
const closeEye = require('../../../resources/img/closeEye.png');
const openEye = require('../../../resources/img/openEye.png');

const height80 = SCREEN_HEIGHT * 0.8;
const height20 = SCREEN_HEIGHT * 0.2;
const height30 = SCREEN_HEIGHT * 0.3;

class WalletPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warnInputValue: '',
      inputValue: '',
      isDisabled: false,
      isLoading: false,
      network: '',
      dappLink: '',
      shareLink: '',
      dappName: '',
      chainId: '',
      eyeStatus: 'close',

      visible: true,
      freeInput: false, //是否开启免输入
    };
  }

  async UNSAFE_componentWillMount() {
    let result = await StorageHelper.get('selectNetwork');
    this.setState({
      networkName: result.key,
    });
  }

  componentDidMount() {
    this.props.onRef(this);
  }

  handleCheckBoxClick = async () => {
    this.setState({
      freeInput: !this.state.freeInput,
    });
  };

  walletPasswordSubmit = async () => {
    const {
      showPwdInput,
      userInfo,
      sendData,
      sendMessage,
      dAppsData,
      source,
      walletInfo,
      contractData,
      original,
      closeWalletPassword,
    } = this.props;
    let storedWalletPwd = await StorageHelper.get('walletPwd');
    // formData 表单数据
    // currency token信息
    // sendMessage h5返回回调 参数 Data

    let walletPwdOriginal =
      showPwdInput === false ? storedWalletPwd : this.state.inputValue;

    const md5_ = crypto.createHash('md5');
    md5_.update(walletPwdOriginal + ENCRYPT_KEY);
    const walletPwd = md5_.digest('hex');

    let params = {
      userId: userInfo.id,
      walletPwd: walletPwd,
      network: this.state.networkName,
    };
    authService
      .checkWalletPwd(params)
      .then(result => {
        if (result.state === 'success') {
          if (this.state.freeInput) {
            StorageHelper.save('freeInputExpireAt', moment().add(1, 'days'));
            StorageHelper.save('walletPwd', walletPwdOriginal);
          }
          closeWalletPassword('success');
          if (original) {
            // do nothing
          } else if (dAppsData) {
            this.handleDApp(dAppsData);
          } else if (sendData) {
            this.handleSend(sendData);
          } else if (contractData) {
            this.handleContract(contractData);
          }
        } else {
          this.setState({
            isDisabled: false,
            isLoading: false,
            warnInputValue: result.message,
            inputValue: '',
          });
          Toast.show(result.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      })
      .catch(e => {
        this.setState({isDisabled: false, isLoading: false});
        console.log(e);
        Toast.show(e.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: false,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      });
  };

  handleDApp = dAppsData => {
    const {userInfo, source, walletInfo} = this.props;
    // 授权
    let link = '';
    let shareLink = '';
    if (source && source === 'Points') {
      shareLink = '';
      link = '';
    } else {
      const connector = dAppsData.dappItem.link.includes('?') ? '&' : '?';
      shareLink = dAppsData.dappItem.link;
      link =
        dAppsData.dappItem.link +
        connector +
        `accountName=${dAppsData.accountName}&chainId=${
          dAppsData.chainId
        }&userId=${userInfo.id}&phoneNum=${userInfo.phoneNum}` +
        '&t=' +
        new Date().getTime();
    }
    const params = {
      dappLink: link,
      shareLink,
      dappName: dAppsData.dappItem.name,
      chainId: dAppsData.chainId,
    };
    //授权
    let key = userInfo.id + (walletInfo.walletId || walletInfo._id);
    RNSecureKeyStore.get(key).then(
      async res => {
        if (res) {
          let info = JSON.parse(res);

          try {
            const u3_ = createU3(dAppsData.config.sideChain);
            const existed = await u3_.getAccountInfo({
              account_name: dAppsData.accountName,
            });
            if (existed && existed.account_name) {
              this.saveDappAuth(params);
            }
          } catch (e) {
            console.log(e);
            const u3 = createU3(dAppsData.config.mainChain);
            const c = await u3.contract('ultrainio'); //系统合约名
            await c
              .empoweruser(
                {
                  user: dAppsData.accountName,
                  chain_name: dAppsData.config.sideChain.name,
                  owner_pk: info.public_key,
                  active_pk: info.public_key,
                  updateable: 1,
                },
                {
                  keyProvider: info.private_key,
                  authorization: [dAppsData.accountName + '@owner'],
                },
              )
              .then(tr => {
                this.saveDappAuth(params);
              })
              .catch(e => {
                console.log(e);
                Toast.show(
                  I18n.t('page.authorizationFailure') + ':' + e.message,
                  {
                    duration: Toast.durations.LONG,
                    position: Toast.positions.CENTER,
                    shadow: false,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                  },
                );
              });
          }
        }
      },
      err => {
        console.log(err);
        Toast.show(I18n.t('page.authorizationFailure') + ':' + err.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: false,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      },
    );
  };

  handleSend = sendData => {
    const {
      userInfo,
      sendMessage,
      sendMessageToWebView2,
      walletInfo,
    } = this.props;
    let key = userInfo.id + (walletInfo.walletId || walletInfo._id);
    RNSecureKeyStore.get(key).then(
      async res => {
        if (res) {
          try {
            let info = JSON.parse(res);
            if (!Array.isArray(sendData)) {
              sendData = [sendData];
            }
            if (Array.isArray(sendData)) {
              global.t1 = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

              //dapp交互走特定webview2中转
              if (sendMessageToWebView2) {
                sendMessageToWebView2({
                  data: sendData,
                  pvt: info.private_key,
                });
              } else {
                const u3 = createU3(sendData[0].currency.chain);
                const transaction = await u3.transaction(
                  sendData[0].currency.tokenAccount,
                  c => {
                    sendData.forEach(sData => {
                      c.transfer(
                        {
                          from: sData.formData.payer,
                          to: sData.formData.receiver,
                          quantity:
                            sData.formData.quantity +
                            ' ' +
                            sData.currency.symbol,
                          memo: sData.formData.memo,
                        },
                        {authorization: [sData.formData.payer + '@owner']},
                      );
                    });
                  },
                  {keyProvider: info.private_key},
                );

                await Promise.all(
                  sendData.map(async send => {
                    await this.saveTransaction(send, transaction);
                  }),
                );
              }
            }
          } catch (e) {
            console.log(e);
            if (sendMessage) {
              sendMessage(
                JSON.stringify({
                  success: false,
                  type: sendData[0].type,
                  bizId: sendData[0].bizId,
                  msg: e.message,
                }),
              );
            }
            if (
              e.includes &&
              e.includes('but overdrawn balance') &&
              I18n.locale == 'zh'
            ) {
              Toast.show(
                I18n.t('page.transferFailure') +
                  ':' +
                  '可转账金额不足，每笔转账0.2UGAS转账手续费',
                {
                  duration: Toast.durations.LONG,
                  position: Toast.positions.CENTER,
                  shadow: false,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                },
              );
            } else {
              Toast.show(I18n.t('page.transferFailure') + ':' + e.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.CENTER,
                shadow: false,
                animation: true,
                hideOnPress: true,
                delay: 0,
              });
            }
            //toast
          }
        }
      },
      e => {
        console.log(e);
        if (sendMessage) {
          sendMessage(
            JSON.stringify({
              success: false,
              type: sendData[0].type,
              bizId: sendData[0].bizId,
              msg: e.message,
            }),
          );
        }
        if (
          e.includes &&
          e.includes('but overdrawn balance') &&
          I18n.locale == 'zh'
        ) {
          Toast.show(
            I18n.t('page.transferFailure') +
              ':' +
              '可转账金额不足，每笔转账0.2UGAS转账手续费',
            {
              duration: Toast.durations.LONG,
              position: Toast.positions.CENTER,
              shadow: false,
              animation: true,
              hideOnPress: true,
              delay: 0,
            },
          );
        } else {
          Toast.show(I18n.t('page.transferFailure') + ':' + e.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      },
    );
  };

  handleContract = contractData => {
    const {userInfo, sendMessage, walletInfo} = this.props;
    let key = userInfo.id + (walletInfo.walletId || walletInfo._id);
    RNSecureKeyStore.get(key).then(
      async res => {
        if (res) {
          try {
            let info = JSON.parse(res);
            if (!Array.isArray(contractData)) {
              contractData = [contractData];
            }
            if (Array.isArray(contractData)) {
              const startTime = moment().format('YYYY-MM-DD hh:mm:ss');
              const u3 = createU3(contractData[0].currency.chain);
              const transaction = await u3.transaction(
                contractData[0].contract,
                c => {
                  contractData.forEach(cd => {
                    c[cd.action](cd.data, {
                      authorization: [info.accountName + '@owner'],
                    });
                  });
                },
                {keyProvider: info.private_key},
              );

              if (sendMessage) {
                if (contractData[0].fast) {
                  let txt = {};
                  let tx = {};
                  const fun = async () => {
                    //强确认
                    if (contractData[0].strong) {
                      tx = await u3.getTxByTxId(transaction.transaction_id);
                      if (tx && tx.irreversible) {
                        const endTime = moment().format('YYYY-MM-DD hh:mm:ss');
                        txt = await u3.getTxTraceByTxid(
                          transaction.transaction_id,
                        );
                        sendMessage(
                          JSON.stringify({
                            success: true,
                            type: contractData[0].type,
                            bizId: contractData[0].bizId,
                            transactionId: transaction.transaction_id,
                            returnValue:
                              txt.action_traces[0].return_value || '',
                            timeConsuming:
                              moment(endTime).diff(
                                moment(startTime),
                                'seconds',
                              ) + 's',
                            msg: '',
                          }),
                        );
                        return true;
                      }
                    } else {
                      txt = await u3.getTxTraceByTxid(
                        transaction.transaction_id,
                      );
                      if (txt && txt.block_num > 0) {
                        const endTime = moment().format('YYYY-MM-DD hh:mm:ss');
                        sendMessage(
                          JSON.stringify({
                            success: true,
                            type: contractData[0].type,
                            bizId: contractData[0].bizId,
                            transactionId: transaction.transaction_id,
                            returnValue:
                              txt.action_traces[0].return_value || '',
                            timeConsuming:
                              moment(endTime).diff(
                                moment(startTime),
                                'seconds',
                              ) + 's',
                            msg: '',
                          }),
                        );
                        return true;
                      }
                    }
                  };
                  await U3Utils.test.waitUntil(fun, 60000, 1000);
                } else {
                  const endTime = moment().format('YYYY-MM-DD hh:mm:ss');
                  sendMessage(
                    JSON.stringify({
                      success: true,
                      type: contractData[0].type,
                      bizId: contractData[0].bizId,
                      transactionId: transaction.transaction_id,
                      returnValue:
                        transaction.processed.action_traces[0].return_value ||
                        '',
                      timeConsuming:
                        moment(endTime).diff(moment(startTime), 'seconds') +
                        's',
                      msg: '',
                    }),
                  );
                }
              }
              await Promise.all(
                contractData.map(async send => {
                  await this.saveTransaction(send, transaction);
                }),
              );

              //如果是修改私钥，则清除本地旧私钥
              if (
                contractData[0].contract === 'ultrainio' &&
                contractData[0].action === 'updateauth'
              ) {
                await RNSecureKeyStore.remove(key).then(
                  res => {
                    console.log(res);
                  },
                  err => {
                    console.log(err);
                  },
                );
              }
            }
          } catch (e) {
            console.log(e);
            if (sendMessage) {
              sendMessage(
                JSON.stringify({
                  success: false,
                  type: contractData[0].type,
                  bizId: contractData[0].bizId,
                  msg: e.message,
                }),
              );
            }

            Toast.show(
              I18n.t('page.executeContractFailure') + ':' + e.message,
              {
                duration: Toast.durations.LONG,
                position: Toast.positions.CENTER,
                shadow: false,
                animation: true,
                hideOnPress: true,
                delay: 0,
              },
            );
            //toast
          }
        }
      },
      err => {
        console.log(err);
        if (sendMessage) {
          sendMessage(
            JSON.stringify({
              success: false,
              type: contractData[0].type,
              bizId: contractData[0].bizId,
              msg: err.message,
            }),
          );
        }
        Toast.show(I18n.t('page.executeContractFailure') + ':' + err.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER,
          shadow: false,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      },
    );
  };

  dealWithPushTx = async json => {
    const {
      userInfo,
      sendMessage,
      sendMessageToWebView2,
      walletInfo,
    } = this.props;
    try {
      const u3 = createU3(json.data[0].currency.chain);
      if (json.data[0].fast) {
        let txt = {};
        let tx = {};
        const fun = async () => {
          //强确认
          if (json.data[0].strong) {
            tx = await u3.getTxByTxId(json.tx.transaction_id);
            if (tx && tx.irreversible) {
              global.t2 = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
              console.log(
                '开始' + global.t1,
                '结束' + global.t2,
                '耗时' + moment(global.t2).diff(moment(global.t1), 'seconds'),
              );
              txt = await u3.getTxTraceByTxid(json.tx.transaction_id);
              sendMessage(
                JSON.stringify({
                  success: true,
                  type: json.data[0].type,
                  bizId: json.data[0].bizId,
                  transactionId: json.tx.transaction_id,
                  returnValue: txt.action_traces[0].return_value || '',
                  timeConsuming:
                    moment(global.t2).diff(moment(global.t1), 'seconds') + 's',
                  msg: '',
                }),
              );
              return true;
            }
          } else {
            txt = await u3.getTxTraceByTxid(json.tx.transaction_id);
            if (txt && txt.block_num > 0) {
              global.t2 = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
              console.log(
                '开始' + global.t1,
                '结束' + global.t2,
                '耗时' + moment(global.t2).diff(moment(global.t1), 'seconds'),
              );
              sendMessage(
                JSON.stringify({
                  success: true,
                  type: json.data[0].type,
                  bizId: json.data[0].bizId,
                  transactionId: json.tx.transaction_id,
                  returnValue: txt.action_traces[0].return_value || '',
                  timeConsuming:
                    moment(global.t2).diff(moment(global.t1), 'seconds') + 's',
                  msg: '',
                }),
              );
              return true;
            }
          }
        };
        await U3Utils.test.waitUntil(fun, 60000, 1000);
      } else {
        global.t2 = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        console.log(
          '开始' + global.t1,
          '结束' + global.t2,
          '耗时' + moment(global.t2).diff(moment(global.t1), 'seconds'),
        );
        sendMessage(
          JSON.stringify({
            success: true,
            type: json.data[0].type,
            bizId: json.data[0].bizId,
            transactionId: json.tx.transaction_id,
            returnValue: json.tx.processed.action_traces[0].return_value || '',
            timeConsuming:
              moment(global.t2).diff(moment(global.t1), 'seconds') + 's',
            msg: '',
          }),
        );
      }

      await Promise.all(
        json.data.map(async send => {
          await this.saveTransaction(send, json.tx);
        }),
      );
    } catch (e) {
      Toast.show(I18n.t('page.transferFailure') + ':' + e.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER,
        shadow: false,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  };

  saveTransaction = (data, transaction) => {
    const {userInfo, walletInfo, closeWalletPassword, appName} = this.props;
    const currency = {
      tokenAccount: data.currency.tokenAccount,
      symbol: data.currency.symbol,
      tokenLogo: data.currency.tokenLogo,
    };
    const params = {
      chain: data.currency.chain,
      appName: appName ? appName : '',
      contractAccount: data.currency.tokenAccount || data.contract,
      contractAction: data.action,
      bizId: data.bizId,
      bizType: data.type,
      bizData: data.formData || data.data,
      currency: currency,
      signedAccount: walletInfo.accountName,
      userId: userInfo.id,
      transactionId: transaction.transaction_id,
      fast: data.fast,
      strong: data.strong,
    };
    authService
      .transactionAdd(params)
      .then(result => {
        this.setState({isDisabled: false, isLoading: false});
        if (result.state === 'success') {
          closeWalletPassword('success', result.data);
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  saveDappAuth = p => {
    const {userInfo, dAppsData, closeWalletPassword, source} = this.props;
    const {navigate} = this.props.navigation;
    const params = {
      userId: userInfo.id,
      chainId: dAppsData.chainId,
      dappId: dAppsData.dappItem.id || dAppsData.dappItem._id,
      accountName: dAppsData.accountName,
    };
    if (source && source == 'Points') {
      params.isPoint = true;
    }
    authService
      .dappAuthAdd(params)
      .then(result => {
        this.setState({isDisabled: false, isLoading: false});
        if (result.state === 'success') {
          closeWalletPassword('success');
          if (source && source == 'Points') {
            // navigate(source);
          } else {
            this.props.navigation.navigate('WebView', p);
          }
        } else {
          Toast.show(result.message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        }
      })
      .catch(e => {
        console.log(e);
      });
  };

  goVerifydentidy = () => {
    const {closeWalletPassword} = this.props;
    closeWalletPassword();
    setTimeout(() => {
      NavigationUtil.reset(this.props.navigation, 'Verifydentidy');
    }, 0);
  };

  render() {
    const {showPwdInput, visible, closeWalletPassword, appName} = this.props;
    if (showPwdInput === false) {
      return null;
    } else {
      return (
        <Modal
          onRequestClose={() => {}}
          visible={visible}
          transparent={true}
          animationType="slide">
          <View style={styles.networkList}>
            <TouchableOpacity
              style={styles.closeModel}
              activeOpacity={0.8}
              onPress={() => closeWalletPassword('goBack')}
            />
            <View style={styles.container}>
              <View style={styles.header}>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    left: 24,
                    top: 25,
                  }}
                  activeOpacity={0.8}
                  onPress={() => {
                    closeWalletPassword('goBack');
                    this.setState({warnInputValue: ''});
                  }}>
                  <Image
                    source={closeIcon}
                    style={{
                      width: 20,
                      height: 20,
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.headerText}>
                  {I18n.t('page.walletPassword')}
                </Text>
              </View>

              <View style={styles.body}>
                <View style={{width: '100%', paddingHorizontal: 13}}>
                  <View
                    style={[
                      styles.detail,
                      !this.state.warnInputValue ? '' : styles.warnLine,
                    ]}>
                    <TextInput
                      placeholder={I18n.t('login.pleaseInputPassword')}
                      placeholderTextColor="#999"
                      style={styles.input}
                      secureTextEntry={this.state.eyeStatus == 'close'}
                      value={this.state.inputValue}
                      onChangeText={value => {
                        this.setState({inputValue: value});
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        position: 'absolute',
                        top: 23,
                        right: 6,
                        width: 23,
                        height: 15,
                      }}
                      activeOpacity={0.8}
                      onPress={() => {
                        this.setState({
                          eyeStatus:
                            this.state.eyeStatus == 'close' ? 'open' : 'close',
                        });
                      }}>
                      <Image
                        source={
                          this.state.eyeStatus == 'close' ? closeEye : openEye
                        }
                        resizeMode="contain"
                        style={
                          this.state.eyeStatus == 'close'
                            ? {
                                width: 23,
                                height: 12,
                              }
                            : {
                                width: 23,
                                height: 15,
                              }
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  {this.state.warnInputValue !== '' && (
                    <Text style={styles.warnText}>
                      {this.state.warnInputValue}
                    </Text>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this.goVerifydentidy()}>
                    <Text style={styles.forgetPassword}>
                      {I18n.t('wallet.forgetPassword')}
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.freeInputView}>
                    <CheckBox
                      style={{flex: 0.15}}
                      onClick={() => this.handleCheckBoxClick()}
                      isChecked={this.state.freeInput}
                    />
                    <TouchableOpacity
                      onPress={() => this.handleCheckBoxClick()}>
                      <Text style={styles.freeInputText}>
                        一天之内免输入密码
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.warnInputValue !== '' && (
                  <Text style={styles.warnText2}>
                    {this.state.warnInputValue}
                  </Text>
                )}
                <Button
                  containerStyle={[
                    styles.btn,
                    this.state.isDisabled ? styles.btnBgDisabled : '',
                  ]}
                  style={[styles.btnText]}
                  text={I18n.t('btn.confirm')}
                  disabled={this.state.isDisabled}
                  onPress={() => this.walletPasswordSubmit()}
                />
              </View>
            </View>
          </View>
          <Loading visible={this.state.isLoading} />
        </Modal>
      );
    }
  }
}

const styles = StyleSheet.create({
  networkList: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
  },
  closeModel: {
    width: '100%',
    height: height20,
  },
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: height80,
  },
  containerFreeInput: {
    backgroundColor: '#fff',
    width: '100%',
    height: height30,
  },
  header: {
    position: 'relative',
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  headerText: {
    fontSize: 20,
    color: '#000',
  },
  body: {
    paddingHorizontal: 12,
    paddingTop: 26,
    paddingBottom: 29,
    height: height80 - 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyFreeInput: {
    paddingHorizontal: 12,
    paddingTop: 40,
    paddingBottom: 29,
    height: height20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detail: {
    position: 'relative',
    width: '100%',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.16)',
  },
  input: {
    fontSize: 15,
    width: '100%',
    height: 57,
    paddingHorizontal: 13,
  },
  warnLine: {
    borderColor: '#FF3C54',
    color: '#FF3C54',
  },
  warnText: {
    fontSize: 13,
    color: '#FF3C54',
    marginTop: 20,
  },
  warnText2: {
    fontSize: 13,
    color: '#FF3C54',
  },
  forgetPassword: {
    fontSize: 12,
    color: '#00AEEF',
    marginTop: 20,
    textAlign: 'right',
  },
  btn: {
    width: '100%',
    height: 57,
    // marginTop: 160,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00AEEF',
  },
  btnBgDisabled: {
    backgroundColor: '#105F7F',
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  freeInputView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 30,
  },
  freeInputText: {
    marginLeft: 15,
    color: '#838383',
  },
});

export default WalletPassword;
