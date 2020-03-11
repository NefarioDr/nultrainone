import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  View,
  StatusBar,
  Platform,
  DeviceEventEmitter,
} from 'react-native';
import I18n from '../../../resources/languages/I18n';
import NavigationUtil from '../../commons/NavigationUtil';
import CacheUtils from '../../commons/CacheUtil';
import ValidationComponent from 'react-native-form-validator';
import CountDown from '..//components/CountDown';
import * as authService from '../../services/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import ShadowView from '../ItemDetail/ShadowView';
import PhoneInput from 'react-native-phone-input2';
import ModalPickerImage from '../components/ModalPickerImage';
import {CaptchaModule} from '../../nativeModules';
import {BaseUrl, ImageUrl} from '../../constants/Urls';
import {ToastLong} from '../../commons/Toast';
import { Events } from '../../services/events';
import { HSRouter } from '../../homescreen/HSRouter';

export class LoginAsPhoneNumber extends ValidationComponent {

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      number: '',
      identifyingCode: '',
      isfocus: false,
      isfocusCode: false,
      isEnd: false,
      btnStatu: false,
    };
    this.onPressFlag = this.onPressFlag.bind(this);
    this.selectCountry = this.selectCountry.bind(this);
  }

  onPressFlag() {
    this.myCountryPicker.open();
  }

  selectCountry(country) {
    this.phone.selectCountry(country.iso2);
  }

  getCode = async () => {
    const number =
      this.phone.getValue().replace('+', '00') +
      this.state.phone.replace(/ /g, '');
    this.setState({
      number,
    });
    if (this.state.phone === '') {
      ToastLong(I18n.t('login.phoneNumberInvalid'));
      return false;
    }
    let isTrue = false;
    try {
      // 进行短信验证码的滑块验证，获取滑块验证数据
      const appId = '2073347220';
      const captchaData = await CaptchaModule.showCaptcha(appId);
      if (captchaData.ret !== 0) {
        return isTrue;
      }
      // 获取短信验证码
      const result = await authService.getPhoneVerifyCode({
        phoneNum: number,
        captchaData: JSON.stringify(captchaData),
      });
      if (result.state !== 'success') {
        ToastLong(I18n.t('login.wrongPhoneCode'));
      } else {
        isTrue = true;
      }
    } catch (e) {
      ToastLong(I18n.t('login.wrongPhoneCode'));
    }
    return isTrue;
  };

  onPress = name => {
    const {loggedIn, userInfo} = this.props;
    this.setState({
      number:
        this.phone.getValue().replace('+', '00') +
        this.state.phone.replace(/ /g, ''),
    });

    if (this.state.phone === '') {
      ToastLong(I18n.t('login.phoneNumberInvalid'));
      return false;
    } else {
      setTimeout(() => {
        const valid = this.validate({
          identifyingCode: {numbers: true, required: true},
        });

        if (valid) {
          let _this = this;

          CacheUtils.getItem('userInfo', (err, ret) => {
            if (err) {
              console.log(err);
              return;
            }
            let params = ret !== null ? JSON.parse(ret) : {};
            params.phoneNum = this.state.number;
            params.phoneCode = this.state.identifyingCode;

            //已登录状态, 更新手机
            if (loggedIn) {
              params.userId = userInfo.id;
              authService
                .updateUserPhone(params)
                .then(result => {
                  if (result.state === 'success') {
                    this.setState({
                      verifyCodeResult: result,
                    });
                    if (
                      this.state.verifyCodeResult === null ||
                      this.state.verifyCodeResult.state !== 'success'
                    ) {
                      ToastShort(I18n.t('login.VerificationCodevalid'));
                    } else {
                      let userSession = JSON.stringify(result.doc);
                      ToastShort(I18n.t('login.bindSuccess'));
                      CacheUtils.saveItem('userInfo', userSession);

                      const navigateAction = NavigationActions.navigate({
                        routeName: 'Mine',
                        params: {userInfo: result.doc},
                      });
                      this.props.navigation.dispatch(navigateAction);
                    }
                  } else {
                    ToastShort(result.message);
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            }
            //未登录状态, 手机登录
            else {
              authService
                .validPhoneVerifyCode(params)
                .then(result => {
                  //验证成功
                  if (result.state === 'success') {
                    DeviceEventEmitter.emit(Events.WITHDRAW_LUCKY_UGAS, {});

                    // 首次注册
                    if (result.isRegister === false) {
                      this.setState({
                        verifyCodeResult: result,
                      });
                      if (
                        this.state.verifyCodeResult === null ||
                        this.state.verifyCodeResult.state !== 'success'
                      ) {
                        ToastShort(I18n.t('login.VerificationCodevalid'));
                      } else {
                        CacheUtils.saveItem('userInfo', result.doc);
                        DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
                        DeviceEventEmitter.emit(Events.WALLET_STATUS_CHANGED);
                        if (result.doc.wallets.length === 0) {
                          NavigationUtil.go(
                            this.props.navigation,
                            HSRouter.CREATE_WALLET,
                            {goBack: 'noBack'},
                          );
                        } else {
                          NavigationUtil.reset(this.props.navigation, 'Mine');
                        }
                      }
                      // 老用户登录
                    } else {
                      this.setState({
                        verifyCodeResult: result,
                      });
                      if (
                        this.state.verifyCodeResult === null ||
                        this.state.verifyCodeResult.state !== 'success'
                      ) {
                        ToastShort(I18n.t('login.VerificationCodevalid'));
                      } else {
                        CacheUtils.saveItem('userInfo', result.doc);
                        DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
                        DeviceEventEmitter.emit(Events.WALLET_STATUS_CHANGED);
                        if (result.doc.wallets.length == 0) {
                          NavigationUtil.go(
                            this.props.navigation,
                            HSRouter.CREATE_WALLET,
                            {goBack: 'noBack'},
                          );
                        } else {
                          NavigationUtil.reset(this.props.navigation, 'Mine');
                        }
                      }
                    }
                    //验证失败
                  } else {
                    ToastShort(result.message);
                  }
                })
                .catch(e => {
                  console.log(e);
                });
            }
          });
        } else {
          this.isFieldInError('number') &&
            this.getErrorsInField('number').map(errorMessage => {
              ToastShort(I18n.t('validator.numbers', {
                field: I18n.t('login.Phonenumber'),
              }));
            });
          this.isFieldInError('identifyingCode') &&
            this.getErrorsInField('identifyingCode').map(errorMessage => {
              ToastShort(I18n.t('validator.numbers', {
                field: I18n.t('login.identifyingCode'),
              }));
            });
        }
      }, 100);
    }
  };

  focus = () => {
    this.setState({
      isfocus: true,
    });
  };
  blur = () => {
    if (this.state.number !== 0) {
      this.setState({isfocus: true});
    } else {
      this.setState({isfocus: false});
    }
  };
  focusCode = () => {
    this.setState({
      isfocusCode: true,
    });
  };
  blurCode = () => {
    if (this.state.identifyingCode.length !== 0) {
      this.setState({isfocusCode: true});
    } else {
      this.setState({isfocusCode: false});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#1E1E24" translucent={false} />

        <ModalPickerImage
          ref={ref => {
            this.myCountryPicker = ref;
          }}
          onChange={country => {
            this.selectCountry(country);
          }}
          cancelText={I18n.t('btn.cancel')}
        />

        <KeyboardAwareScrollView>
          <View style={styles.nickWrap}>
            <View style={styles.numberItem}>
              {/* <Text style={styles.title}>{I18n.t("login.MobileNumber")}</Text> */}
              <PhoneInput
                textStyle={{fontSize: 12, fontWeight: '700'}}
                ref={ref => {
                  this.phone = ref;
                }}
                initialCountry="cn"
                style={styles.selectPhone}
                onPressFlag={this.onPressFlag}
              />
              <TextInput
                style={[
                  styles.phoneItem,
                  this.state.isfocus === true ? styles.itemFocus : '',
                ]}
                underlineColorAndroid="transparent"
                value={this.state.phone}
                onChangeText={phone => this.setState({phone})}
                placeholder={I18n.t('login.Phonenumber')}
              />
            </View>

            <View style={styles.identifying}>
              {/* <Text style={styles.title}>{I18n.t("login.VerificationCodeMust")}</Text> */}
              <TextInput
                onFocus={() => {
                  this.focusCode();
                }}
                onBlur={() => {
                  this.blurCode();
                }}
                keyboardType={'numeric'}
                style={[
                  styles.item,
                  this.state.isfocusCode === true ? styles.itemFocus : '',
                ]}
                underlineColorAndroid="transparent"
                ref="identifyingCode"
                value={this.state.identifyingCode}
                maxLength={6}
                placeholder={I18n.t('login.identifyingCode')}
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
    flex: 1,
    paddingTop: 40,
  },

  item: {
    height: 45,
    borderColor: '#E8E8E8',
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '700',
  },

  numberItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
  },
  itemFocus: {
    borderColor: '#30BDF1',
  },
  numberItemFocus: {
    borderColor: '#30BDF1',
  },
  identifying: {
    position: 'relative',
    marginTop: 18,
    borderWidth: 0.5,
    borderColor: '#CCCCCC',
    backgroundColor: '#F8F8F8',
    borderRadius: 4,
    height: 45,
    paddingHorizontal: 15,
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
    marginTop: 60,
  },
  nextText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  identifyingBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  selectPhone: {
    paddingHorizontal: 8,
    height: 21,
    borderRightWidth: 0.5,
    borderColor: '#CDCDCD',
    width: 100,
  },
  phoneItem: {
    color: '#4A4A4A',
    fontSize: 12,
    fontWeight: '700',
    height: 45,
    width: 200,
    paddingLeft: 15,
  },
  versionBox: {
    fontSize: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  version: {
    fontSize: 10,
    color: '#19B6F0',
  },
});
