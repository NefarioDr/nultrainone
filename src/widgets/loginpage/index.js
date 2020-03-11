import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
  Dimensions,
  AsyncStorage,
  Alert,
} from 'react-native';

import {SCREEN_WIDTH} from '../../constants/Common';
const landingBg = require('../../../resources/img/landingBg.png');
import * as WeChat from 'react-native-wechat1';

import * as Images from '../../../resources/img/Images';
import I18n from '../../../resources/languages/I18n';
import NavigationUtil from '../../commons/NavigationUtil';
import * as authService from '../../services/auth';
import CacheUtils from '../../commons/CacheUtil';
import {Events} from '../../services/events';
import {HSRouter} from '../../homescreen/HSRouter';
import {ToastShort, OkButtonAlert} from '../../commons/Toast';
import {WeChatLoginManager} from './LoginAsWeChat';
import { UserManager } from './UserManager';

const FBSDK = require('react-native-fbsdk');
const {LoginManager, AccessToken} = FBSDK;

export class LoginPage extends React.Component {
  static navigationOptions = {};

  constructor(props) {
    super(props);
    this.state = {
      locale: I18n.locale === 'en' ? '中文' : 'English',
      email: '',
      password: '',
      secretID: '',
      isHaveWeChat: false,
    };
  }

  onUsrLogin = userInfo => {
    this.props.navigation.navigate(HSRouter.HOME_SCREEN);
  };

  componentDidMount() {
    authService.queryWeChatSecret().then(result => {
      if (result.state === 'success') {
        this.setState({
          secretID: result.docs,
        });
      }
    });
    WeChat.isWXAppInstalled()
      .then(isInstalled => {
        this.setState({
          isHaveWeChat: isInstalled,
        });
      })
      .catch(e => {
        this.setState({
          isHaveWeChat: false,
        });
        console.log(e);
      });

    DeviceEventEmitter.addListener(Events.USR_LOGIN, this.onUsrLogin);
  }

  UNSAFE_componentWillUnmount() {
    DeviceEventEmitter.removeListener(Events.USR_LOGIN, this.onUsrLogin);
  }

  loginAsEmail = () => {
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'LandingEmail',
    //   params: {title: I18n.t('login.LoginWithEmail')},
    // });
    this.props.navigation.navigate(HSRouter.EMAIL_LOGIN_SCREEN);
  };

  loginAsMobile = () => {
    // const navigateAction = NavigationActions.navigate({
    //   routeName: 'LandingNumber',
    //   params: {title: I18n.t('login.LoginWithPhone')},
    // });
    this.props.navigation.navigate(HSRouter.PHONE_NUMBER_LOGIN_SCREEN);
  };

  handleToPrev = () => {
    // const {getParam} = this.props.navigation;
    // const callbackRoute = getParam('callbackRoute');
    // if (callbackRoute) {
    //   if (callbackRoute === 'Event') {
    //     DeviceEventEmitter.emit('positionAllActivity');
    //   }
    //   NavigationUtil.reset(this.props.navigation, callbackRoute);
    // } else {
    this.props.navigation.goBack();
    // }
  };

  _afterLogedIn(params, result) {
    //验证成功
    if (result.state === 'success') {
      // 首次注册
      if (result.isRegister === false) {
        let userInfo = params;
        let userRegSession = JSON.stringify(userInfo);
        UserManager.save(userRegSession);
        NavigationUtil.reset(this.props.navigation, HSRouter.PHONE_NUMBER_LOGIN_SCREEN);
      }
      // 老用户登录
      else {
        UserManager.save(result.doc);

        DeviceEventEmitter.emit(Events.NOT_READ_COUNT);
        DeviceEventEmitter.emit(Events.WALLET_STATUS_CHANGED);
        if (result.doc.wallets.length === 0) {
          NavigationUtil.go(this.props.navigation, HSRouter.CREATE_WALLET, {
            goBack: 'noBack',
          });
        } else {
          NavigationUtil.reset(this.props.navigation, 'Mine');
        }
        // NavigationUtil.reset(this.props.navigation, "Mine");
      }
      //验证失败
    } else {
      ToastShort(result.message);
    }
  }

  loginAsWechat = () => {
    WeChatLoginManager((error, responseData) => {
      if (error) {
        OkButtonAlert(I18n.t('global.error'), error);
        return;
      }

      // 登录APP
      let params = {
        name: responseData.nickname,
        wechat: responseData.unionid,
        wechatName: responseData.nickname,
        headimgurl: responseData.headimgurl,
      };
      authService.loginAsWeChat(params).then(result => {
        this._afterLogedIn(params, result);
      });
    });
  };

  loginAsFacebook = () => {
    LoginManager.logInWithReadPermissions(['public_profile']).then(
      ret => {
        if (ret.isCancelled) {
          console.log('user canceled loginAsFacebook ');
        } else {
          AccessToken.getCurrentAccessToken()
            .then(async data => {
              const response = await fetch(
                `https://graph.facebook.com/me?access_token=${
                  data.accessToken
                }`,
              );
              let json = await response.json();

              let params = {
                name: json.name,
                facebookName: json.name,
                facebook: json.id,
              };

              authService
                .loginAsFacebook(params)
                .then(result => {
                  //验证成功
                  if (result.state === 'success') {
                    DeviceEventEmitter.emit(Events.WITHDRAW_LUCKY_UGAS, {});
                  }

                  this._afterLogedIn(params, result);
                })
                .catch(e => {
                  console.log(e);
                });
            })
            .catch(e => {
              console.log(e);
            });
        }
      },
      error => {
        ToastShort(`Login failed with error: ${error}`);
      },
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground style={styles.containerBg} source={landingBg}>
          <View style={styles.headerWrap}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  this.handleToPrev();
                }}>
                <Image
                  source={{uri: Images.CLOSE}}
                  style={{width: 25, height: 25}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.contentWrap}>
            <View style={styles.loginTypes}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.disclaimer,
                  styles.loginTypesItem,
                  styles.itemPhone,
                ]}
                onPress={() => {
                  this.loginAsMobile();
                }}>
                <View style={styles.loginTypesItemWrapBtn}>
                  <View style={styles.iconBtn}>
                    <TouchableOpacity style={styles.iconBtnWrap}>
                      <Image
                        source={{uri: Images.MOBILE}}
                        style={{width: 34, height: 34}}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.tapNameWrap}>
                    <Text style={styles.typeNamePhone}>
                      {I18n.t('login.LoginWithPhone')}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.desCoin}>
              <View style={styles.lineWrap}>
                <View style={styles.line} />
              </View>
              <Text style={styles.desCoinTest}>{I18n.t('page.or')}</Text>
              <View style={styles.lineWrap}>
                <View style={styles.line} />
              </View>
            </View>

            <View style={styles.loginAlterTypes}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={[
                  styles.disclaimerAlter,
                  styles.loginTypesAlterItem,
                  this.state.isHaveWeChat ? '' : styles.hide,
                ]}
                onPress={() => {
                  this.loginAsWechat();
                }}>
                <View style={styles.loginTypesItemWrap}>
                  <Image
                    source={{uri: Images.LOGIN_WECHART}}
                    style={styles.loginIcon}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.disclaimerAlter, styles.loginTypesAlterItem]}
                onPress={() => {
                  this.loginAsEmail();
                }}>
                <View style={styles.loginTypesItemWrap}>
                  <Image
                    source={{uri: Images.LOGIN_EMAIL}}
                    style={styles.loginIcon}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={[styles.disclaimerAlter, styles.loginTypesAlterItem]}
                onPress={() => {
                  this.loginAsFacebook();
                }}>
                <View style={styles.loginTypesItemWrap}>
                  <Image
                    source={{uri: Images.LOGIN_FACEBOOK}}
                    style={styles.loginIcon}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  f12: {
    fontSize: 12,
  },
  show: {
    display: 'flex',
  },
  hide: {
    display: 'none',
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
  },
  containerBg: {
    width: SCREEN_WIDTH,
    height: '100%',
    flex: 1,
    flexDirection: 'column',
  },
  headerWrap: {
    flex: 1,
  },
  header: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  contentWrap: {
    flexDirection: 'column',
  },
  disclaimer: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  disclaimerAlter: {
    borderRadius: 57,
  },
  loginTypes: {
    paddingHorizontal: 42.5,
    marginBottom: 40,
  },
  loginAlterTypes: {
    height: 57,
    paddingHorizontal: 52,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 79.5,
  },
  loginTypesItem: {
    height: 57,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTypesAlterItem: {
    height: 57,
    width: 57,
  },
  loginIcon: {
    height: 57,
    width: 57,
  },
  loginTypesItemWrap: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
  },
  loginTypesItemWrapBtn: {
    height: 57,
    flexDirection: 'row',
  },
  itemPhone: {
    backgroundColor: '#fff',
  },
  typeNamePhone: {
    fontSize: 15,
    color: '#4A4A4A',
    fontWeight: '700',
    lineHeight: 21,
    textAlign: 'center',
    marginLeft: -8.5,
  },
  iconBtn: {
    alignItems: 'flex-end',
  },
  iconBtnWrap: {
    width: 46,
    alignItems: 'flex-start',
    marginTop: 10.6,
  },
  tapNameWrap: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  desCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 17,
    paddingHorizontal: 45,
    marginBottom: 20,
  },
  lineWrap: {
    flex: 1.5,
  },
  line: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,.3)',
  },
  desCoinTest: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 6,
  },
});

// export default LoginPage;
