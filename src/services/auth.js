import AsyncStorage from '@react-native-community/async-storage';
import RequestUtil from '../commons/RequestUtil';
import {RedPackageBaseUrl} from '../constants/Urls';
import * as AuthReducer from './userstate';
import store from '../store/configureStore';
import StorageHelper from '../commons/StorageHelper';

export function getCurrentUser() {
  try {
    return new Promise((resolve, reject) => {
      return AsyncStorage.getItem('userInfo', (err, result) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        let json = null;
        if (result) {
          json = JSON.parse(result);
          if (json.id) {
            store.dispatch(AuthReducer.setLogin(json));
          } else {
            json = null;
          }
        }
        resolve(json);
      });
    });
  } catch (error) {
    reject(error);
    console.log(error);
  }
}

// 退出登录
export async function layOut() {
  try {
    await StorageHelper.remove('freeInputExpireAt');
    await StorageHelper.remove('walletPwd');
    return AsyncStorage.removeItem('userInfo', (err, result) => {
      store.dispatch(AuthReducer.setLogout());
    });
  } catch (error) {
    console.log(error);
  }
}

// 微信登录（首次为注册）
export function loginAsWeChat(params) {
  try {
    return RequestUtil.post('/api/user/registerWebchat', params)
      .then(response => {
        response.doc && store.dispatch(AuthReducer.setLogin(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 获取短信验证码
export function getPhoneVerifyCode(params) {
  try {
    return RequestUtil.get('/api/users/getVerificationPhoneCode', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 获取邮箱验证码
export function getEmailVerifyCode(params) {
  try {
    return RequestUtil.get('/api/user/registerEmail', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/*
 * 修改已经绑定的邮箱
 * */
export function updateUserEmail(params) {
  try {
    return RequestUtil.post('/api/user/bindEmail', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/*
 * 修改已经绑定的手机号
 * */
export function updateUserPhone(params) {
  try {
    return RequestUtil.post('/api/user/bindPhoneNum', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 校验邮箱验证码是否合法（并返回是否是新用户）
export function validEmailVerifyCode(params) {
  try {
    return RequestUtil.get('/api/user/validMailCode', params)
      .then(response => {
        response.doc && store.dispatch(AuthReducer.setLogin(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 校验手机验证码是否合法（并返回用户）
export function validPhoneVerifyCode(params) {
  try {
    return RequestUtil.get('/api/users/validPhoneCode', params)
      .then(response => {
        response.doc && store.dispatch(AuthReducer.setLogin(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

//手机登陆用户注册提交
export function validUserSession(params) {
  try {
    return RequestUtil.post('/api/users/userRegister', params)
      .then(response => {
        response.doc && store.dispatch(AuthReducer.setLogin(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// facebook 登陆
export function loginAsFacebook(params) {
  try {
    return RequestUtil.post('/api/user/registerFacebook', params)
      .then(response => {
        response.doc && store.dispatch(AuthReducer.setLogin(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 获取登陆用户点赞状态
export function getLikeStatu(params) {
  try {
    return RequestUtil.get('/api/content/getLikeStatus', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 获取登陆用户是否已参加该活动的状态
export function getJoinedStatu(params) {
  try {
    return RequestUtil.get('/api/activity/getJoinedStatu', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 更新用户点赞状态或者记录用户分享足迹(资讯)
export function updateLikeStatu(params) {
  try {
    return RequestUtil.post('/api/content/updateLikeAndShare', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

// 更新用户点赞状态或者记录用户分享足迹(活动)
export function updateLikeActivityStatu(params) {
  try {
    return RequestUtil.post('/api/activity/updateLikeAndShare', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改用户昵称
 * @returns {*}
 */
export function saveUserNickName(params) {
  try {
    return RequestUtil.post('/api/users/updateMyNickName', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改用户公司
 * @returns {*}
 */
export function saveUserCompany(params) {
  try {
    return RequestUtil.post('/api/users/updateMyCompany', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改保存用户信息
 * @returns {*}
 */
export function saveUserPosition(params) {
  try {
    return RequestUtil.post('/api/users/updateMyPosition', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改保存用户信息
 * @returns {*}
 */
export function saveUserInfo(params) {
  try {
    return RequestUtil.post('/api/users/updateMyInfo', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 更新用户头像
 * @returns {*}
 */
export function updateAvatar(params) {
  try {
    return RequestUtil.post('/api/users/uploadAvatar', params)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 上传头像到服务器
 * @returns {*}
 */
export function uploadAvatar(params) {
  try {
    return RequestUtil.postImg('/api/user/uploadImage', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 参加活动 报名信息
 * @param param
 * @returns {*}
 */
export function saveActivityCard(param) {
  try {
    return RequestUtil.post('/api/users/saveActivityCard', param)
      .then(response => {
        response.doc &&
          store.dispatch(AuthReducer.updateUserInfo(response.doc));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * wallet start++++++++++++++++++++++++++++
 */

/**
 * search eth ugas
 * @returns {*}
 */
export function searchEthBalance(param) {
  try {
    return RequestUtil.post('/api/eth/balance', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 创建钱包 checkAccount
 * @returns {*}
 */
export function checkAccount(param) {
  try {
    return RequestUtil.post('/api/wallet/checkAccount', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 创建钱包
 * 获取用户walletId
 * @returns {*}
 */

export function saveWalletId(params) {
  try {
    return RequestUtil.post('/api/wallet/create', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 创建钱包 导入钱包
 * bindWallet
 * @returns {*}
 */
export function bindWallet(param) {
  try {
    return RequestUtil.post('/api/user/bindWallet', param)
      .then(response => {
        response.docs && store.dispatch(AuthReducer.setLogin(response.docs));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 导入钱包 checkAccount 获取walletId
 * @returns {*}
 */
export function checkImportWallet(param) {
  try {
    return RequestUtil.post('/api/wallet/checkImportWallet', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 *  验证钱包密码
 * @returns {*}
 */
export function checkWalletPwd(param) {
  try {
    return RequestUtil.post('/api/user/checkWalletPwd', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 删除钱包
 * 删除钱包ugas walletInfo
 * @returns {*}
 */
export function unbindWallet(param) {
  try {
    return RequestUtil.post('/api/user/unbindWallet', param)
      .then(response => {
        response.docs && store.dispatch(AuthReducer.setLogin(response.docs));
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * wallet end ++++++++++++++++++++++++++++
 */

/**
 * query wechat secret
 * @returns {*}
 */
export function queryWeChatSecret() {
  try {
    return RequestUtil.get('/api/app/wxSecretID')
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取网络列表
 * @returns {*}
 */
export function getNetworkList() {
  try {
    return RequestUtil.post('/api/chain/getMainChainInfo')
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取账号下代币列表
 * @returns {*}
 */
export function getBalanceByAccount(param) {
  try {
    return RequestUtil.post('/api/wallet/getBalanceByAccount', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 落库交易信息
 * @returns {*}
 */
export function transactionAdd(param) {
  try {
    return RequestUtil.post('/api/transaction/add', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 落库交易查询
 * @returns {*}
 */
export function transactionQuery(param) {
  try {
    return RequestUtil.get('/api/transaction/getList', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 交易状态查询
 * @returns {*}
 */
export function transactionQueryStatusByTxId(param) {
  try {
    return RequestUtil.get('/api/transaction/getStatusByTxId', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 落库授权信息
 * @returns {*}
 */
export function dappAuthAdd(param) {
  try {
    return RequestUtil.post('/api/dapp/auth', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取需要保存的收款二维码
 * @returns {*}
 */
export function exportQrCodeWithBg(param) {
  try {
    return RequestUtil.get('/api/wallet/exportQrCodeWithBg', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取收款二维码
 * @returns {*}
 */
export function exportQrCode(param) {
  try {
    return RequestUtil.get('/api/wallet/exportQrCode', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取ChainConfig根据chainId
 * @returns {*}
 */
export function getChainConfigById(param) {
  try {
    return RequestUtil.post('/api/chain/getChainConfigById', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取链信息根据chainId
 * @returns {*}
 */
export function getByChainId(param) {
  try {
    return RequestUtil.post('/api/chain/getByChainId', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取ugas对应的法币
 * @returns {*}
 */
export function ugasPrice(param) {
  try {
    return RequestUtil.get('/api/ugasPrice')
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取更新信息
 * @returns {*}
 */
export function getLatestVersion(param) {
  try {
    return RequestUtil.get('/api/app/getLatestVersion', param)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取积分链信息
 * @returns {*}
 */
export function pointChainInfo() {
  try {
    return RequestUtil.get('/api/dapp/pointChainInfo')
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 判断是否是异常账号
 * network   accountName accountType
 * @returns {*}
 */
export function checkWallet(params) {
  try {
    return RequestUtil.post('/api/wallet/checkWallet', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取首页信息
 * platform   android ios
 * @returns {*}
 */
export function getDataForLaunchScreen(params) {
  try {
    return RequestUtil.get('/api/app/getDataForLaunchScreen', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取某些配置信息，如tab的显隐
 * platform   android ios
 * @returns {*}
 */
export function getConfigInfo(params) {
  try {
    return RequestUtil.get('/api/app/getConfigInfo', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改钱包密码
 * userId  oldWalletPwd   walletPwd
 * @returns {*}
 */
export function modifyWalletPwd(params) {
  try {
    return RequestUtil.post('/api/user/modifyWalletPwd', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 判断是否存在密码
 * userId
 * @returns {*}
 */
export function whetherHasWalletPwd(params) {
  try {
    return RequestUtil.post('/api/user/whetherHasWalletPwd', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 存储钱包备份数据
 * userId、walletId、network、deviceId
 * @returns {*}
 */
export function walletBackup(params) {
  try {
    return RequestUtil.post('/api/wallet/backup', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 判断钱包是否备份批量
 * walletIds
 * @returns {*}
 */
export function checkBackupStatus(params) {
  try {
    return RequestUtil.get('/api/wallet/checkBackupStatus', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 修改钱包密码
 * userId  walletPwd captchaData
 * @returns {*}
 */
export function forgotWalletPwd(params) {
  try {
    return RequestUtil.post('/api/user/forgotWalletPwd', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取ugas数量
 * accountName
 * symbol
 * code
 * chainId
 * network
 * @returns {*}
 */
export function getCurrencyBalance(params) {
  try {
    return RequestUtil.post('/api/wallet/getCurrencyBalance', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取小象列表
 * accountName
 * userId
 * @returns {*}
 */
export function getDigitalTwinsByAccount(params) {
  try {
    return RequestUtil.post('/api/wallet/getDigitalTwinsByAccount', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 图片下载
 * @returns {*}
 */
export function howToGetElephant(params) {
  try {
    return RequestUtil.get('/api/wallet/howToGetElephant', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

export function getElephantDetail(params) {
  try {
    return RequestUtil.post('/api/wallet/getDigitalTwinsById', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 图片合成
 * @returns {*}
 * mainDtId
 * decoratedDtIds
 */
export function composeDigitalTwins(params) {
  try {
    return RequestUtil.post('/api/wallet/composeDigitalTwins', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 重置私钥
 * @returns {*}
 * userId
 * publicKey
 * walletId
 * network
 * deviceId
 */
export function reGenerate(params) {
  try {
    return RequestUtil.post('/api/wallet/reGenerate', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 重置私钥钱转账
 * @returns {*}
 * accountName
 * network
 */
export function payForReGeneratePrivateKey(params) {
  try {
    return RequestUtil.post('/api/wallet/payForReGeneratePrivateKey', params)
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}

/**
 * 触发红包提现
 * @returns {*}
 */
export function triggerRedPackageWithdraw(params) {
  try {
    return RequestUtil.postJson(
      '/api/user/withdrawBalance',
      params,
      RedPackageBaseUrl,
    )
      .then(response => {
        return response;
      })
      .catch(error => {
        return error;
      });
  } catch (error) {
    console.log(error);
  }
}
