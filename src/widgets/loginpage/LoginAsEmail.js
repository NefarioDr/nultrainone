import React from 'react';
import {
  AsyncStorage,
  DeviceEventEmitter,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import I18n from '../../../resources/languages/I18n';
import NavigationUtil from '../../commons/NavigationUtil';
import {DURATION} from '../components/CountDown';
import CacheUtils from '../../commons/CacheUtil';
import ValidationComponent from 'react-native-form-validator';
import * as authService from '../../services/auth';
import CountDown from '../components/CountDown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ShadowView from '../ItemDetail/ShadowView';
import {ImageUrl} from '../../constants/Urls';
import { Events } from '../../services/events';
import { HSRouter } from '../../homescreen/HSRouter';

export class LoginAsEmail extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      identifyingCode: '',
      isfocus: false,
      isfocusCode: false,
      isEnd: false,
      btnStatu: false,
    };
  }

  getCode = () => {
    let reg = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (this.state.email.length === 0) {
      this.refs.toast.show(
        I18n.t('login.EmailaddressRequired'),
        DURATION.LENGTH_SHORT,
      );
      return false;
    } else if (
      this.state.email.length > 0 &&
      reg.test(this.state.email) === false
    ) {
      this.refs.toast.show(I18n.t('login.EmailInvalid'), DURATION.LENGTH_SHORT);
      return false;
    } else {
      authService
        .getEmailVerifyCode({email: this.state.email})
        .then(result => {
          //console.log(result);
        })
        .catch(e => {
          console.log(e);
        });
      return true;
    }
  };

  onPress = name => {
    const {loggedIn, userInfo} = this.props;
    const valid = this.validate({
      email: {required: true},
      identifyingCode: {numbers: true, required: true},
    });

    if (valid) {
      let _this = this;
      const params = {
        email: this.state.email,
        emailCode: this.state.identifyingCode,
      };

      //已登录状态, 绑定邮箱
      if (loggedIn) {
        params.userId = userInfo.id;
        authService
          .updateUserEmail(params)
          .then(result => {
            if (result.state === 'success') {
              this.setState({
                verifyCodeResult: result,
              });
              if (
                this.state.verifyCodeResult === null ||
                this.state.verifyCodeResult.state !== 'success'
              ) {
                _this.refs.toast.show(
                  I18n.t('login.VerificationCodevalid'),
                  DURATION.LENGTH_SHORT,
                );
              } else {
                let userSession = JSON.stringify(result.doc);
                _this.refs.toast.show(
                  I18n.t('login.bindSuccess'),
                  DURATION.LENGTH_SHORT,
                );
                CacheUtils.saveItem('userInfo', userSession);

                const navigateAction = NavigationActions.navigate({
                  routeName: 'Mine',
                  params: {userInfo: result.doc},
                });
                this.props.navigation.dispatch(navigateAction);
              }
            } else {
              this.refs.toast.show(result.message, DURATION.LENGTH_SHORT);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
      //未登录状态, 邮箱登录
      else {
        authService
          .validEmailVerifyCode(params)
          .then(result => {
            DeviceEventEmitter.emit(Events.WITHDRAW_LUCKY_UGAS, {});

            if (result.state === 'success') {
              // 首次注册
              if (result.isRegister === false) {
                this.setState({
                  verifyCodeResult: result,
                });
                if (
                  this.state.verifyCodeResult === null ||
                  this.state.verifyCodeResult.state !== 'success'
                ) {
                  _this.refs.toast.show(
                    I18n.t('login.VerificationCodevalid'),
                    DURATION.LENGTH_SHORT,
                  );
                } else {
                  let userInfo = {email: this.state.email};
                  AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));

                  NavigationUtil.reset(this.props.navigation, 'LandingNumber');
                }
              }
              //老用户
              else {
                this.setState({
                  verifyCodeResult: result,
                });
                if (
                  this.state.verifyCodeResult === null ||
                  this.state.verifyCodeResult.state !== 'success'
                ) {
                  _this.refs.toast.show(
                    I18n.t('login.VerificationCodevalid'),
                    DURATION.LENGTH_SHORT,
                  );
                } else {
                  CacheUtils.saveItem('userInfo', result.doc);
                  DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
                  DeviceEventEmitter.emit(Events.WALLET_STATUS_CHANGED);
                  if (result.doc.wallets.length === 0) {
                    NavigationUtil.go(this.props.navigation, HSRouter.CREATE_WALLET, {
                      goBack: 'noBack',
                    });
                  } else {
                    NavigationUtil.reset(this.props.navigation, 'Mine');
                  }
                }
              }
            } else {
              _this.refs.toast.show(result.message, DURATION.LENGTH_SHORT);
            }
          })
          .catch(e => {
            console.log(e);
          });
      }
    } else {
      this.isFieldInError('email') &&
        this.getErrorsInField('email').map(errorMessage => {
          this.refs.toast.show(
            I18n.t('validator.email', {field: I18n.t('login.EmailAddress')}),
            DURATION.LENGTH_SHORT,
          );
        });
      this.isFieldInError('identifyingCode') &&
        this.getErrorsInField('identifyingCode').map(errorMessage => {
          this.refs.toast.show(
            I18n.t('validator.numbers', {
              field: I18n.t('login.identifyingCode'),
            }),
            DURATION.LENGTH_SHORT,
          );
        });
    }
  };

  focus = () => {
    this.setState({isfocus: true});
  };

  blur = () => {
    this.setState({isfocus: this.state.email.length != 0});
  };

  focusCode = () => {
    this.setState({isfocusCode: true});
  };

  blurCode = () => {
    this.setState({isfocusCode: this.state.identifyingCode.length != 0});
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1E1E24" translucent={false} />

        <KeyboardAwareScrollView>
          <View style={styles.nickWrap}>
            <View>
              <Text style={styles.title}>{I18n.t('login.EmailAddress')}</Text>
              <TextInput
                onFocus={() => {
                  this.focus();
                }}
                onBlur={() => {
                  this.blur();
                }}
                style={[
                  styles.item,
                  this.state.isfocus === true ? styles.itemFocus : '',
                ]}
                underlineColorAndroid="transparent"
                ref="email"
                value={this.state.email}
                onChangeText={email => this.setState({email})}
              />
            </View>
            <View style={styles.identifying}>
              <Text style={styles.title}>
                {I18n.t('login.VerificationCodeMust')}
              </Text>
              <TextInput
                onFocus={() => {
                  this.focusCode();
                }}
                onBlur={() => {
                  this.blurCode();
                }}
                style={[
                  styles.item,
                  this.state.isfocusCode === true ? styles.itemFocus : '',
                ]}
                underlineColorAndroid="transparent"
                autoCapitalize="none"
                ref="identifyingCode"
                value={this.state.identifyingCode}
                maxLength={6}
                onChangeText={identifyingCode =>
                  this.setState({identifyingCode})
                }
              />
              <CountDown onPressHandler={this.getCode} />
            </View>
            <View style={styles.versionBox}>
              <Text style={{fontSize: 10}}>{I18n.t('page.clickToAccept')}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('WebView', {
                    url: `${ImageUrl}/agreement?locale=${
                      I18n.locale == 'en' ? 'en' : 'zh-CN'
                    }`,
                    shareUrl: `${ImageUrl}/agreement?locale=${
                      I18n.locale == 'en' ? 'en' : 'zh-CN'
                    }`,
                    name: I18n.t('page.UserAgreement'),
                    noShare: true,
                  });
                }}>
                <Text style={styles.version}>
                  《{I18n.t('page.UserAgreement')}》
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.next}
            onPress={() => this.onPress('LandingNickname')}>
            <Text style={styles.nextText}>{I18n.t('btn.confirm')}</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
        {Platform.OS === 'android' ? <ShadowView /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    paddingHorizontal: 25,
    position: 'relative',
  },
  nickWrap: {
    paddingTop: 40,
    flex: 1,
  },
  item: {
    padding: 0,
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
    color: '#4A4A4A',
    fontSize: 18,
    fontWeight: '700',
  },
  itemFocus: {
    borderColor: '#30BDF1',
  },
  identifying: {
    position: 'relative',
    paddingTop: 30,
  },
  identifyingBtn: {
    width: 70,
    height: 33,
    borderRadius: 5,
    backgroundColor: '#00AEEF',
    position: 'absolute',
    right: 0,
    bottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: '100%',
    height: 17,
    color: '#747474',
    fontSize: 12,
    fontWeight: '100',
  },
  next: {
    height: 57,
    backgroundColor: '#00AEEF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  identifyingBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  versionBox: {
    fontSize: 10,
    marginTop: 10,
    marginBottom: 60,
    flexDirection: 'row',
  },
  version: {
    fontSize: 10,
    color: '#19B6F0',
  },
});
