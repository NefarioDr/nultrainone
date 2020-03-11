import * as WeChat from 'react-native-wechat1';
import I18n from '../../../resources/languages/I18n';

const appid = 'wx8adf4ed29b122856';

const getUserInfo = (responseData, callback) => {
  var getUserInfoUrl =
    'https://api.weixin.qq.com/sns/userinfo?access_token=' +
    responseData.access_token +
    '&openid=' +
    responseData.openid;

  fetch(getUserInfoUrl, {
    method: 'GET',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(response => response.json())
    .then(responseData => {
      callback(null, responseData);
    })
    .catch(error => {
      if (error) {
        // this.refs.toast.show(error + ' ', DURATION.LENGTH_SHORT);
        // console.log('error=', error);
      }
      callback(`${error}`, null);
    });
};

//  获取 refresh_token
const getRefreshToken = (refreshtoken, callback) => {
  var getRefreshTokenUrl =
    'https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=' +
    appid +
    '&grant_type=refresh_token&refresh_token=' +
    refreshtoken;

  fetch(getRefreshTokenUrl, {
    method: 'GET',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(response => response.json())
    .then(responseData => {
      getUserInfo(responseData, callback);
    })
    .catch(error => {
      callback(`${error}`, null);
    });
};

// 获取 access_token
const getAccessToken = (responseCode, callback) => {
  var AccessTokenUrl =
    'https://api.weixin.qq.com/sns/oauth2/access_token?appid=' +
    appid +
    '&secret=' +
    this.state.secretID +
    '&code=' +
    responseCode +
    '&grant_type=authorization_code';
  //console.log('AccessTokenUrl=',AccessTokenUrl);

  fetch(AccessTokenUrl, {
    method: 'GET',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  })
    .then(response => response.json())
    .then(responseData => {
      getRefreshToken(responseData.refresh_token, callback);
    })
    .catch(error => {
      if (error) {
        console.log('error=', error);
      }
      callback(`${error}`, null);
    });
};

export function WeChatLoginManager(callback) {
  let scope = 'snsapi_userinfo';
  let state = 'wechat_sdk_demo';

  //判断微信是否安装
  WeChat.isWXAppInstalled()
    .then(isInstalled => {
      if (isInstalled) {
        //发送授权请求
        WeChat.sendAuthRequest(scope, state)
          .then(responseCode => {
            //返回code码，通过code获取access_token
            getAccessToken(responseCode.code, callback);
          })
          .catch(() => {
            // ToastShort(I18n.t('page.authorization'));
            callback(I18n.t('page.authorization'), null);
          });
      } else {
        OkButtonAlert(
          I18n.t('page.noinstallWeChat'),
          I18n.t('page.installWeChatandlogin'),
        );
      }
    })
    .catch(e => {
      // console.log(e);
      callback(`${e}`, null);
    });
}
