import RequestUtil from '../commons/RequestUtil';

/**
 * 获取主页DApp banner推荐app信息
 * @returns {*}
 */
export function getDAppBanner() {
  try {
    return RequestUtil.get('/api/dapp/banner')
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
 * 获取DApp store中banner推荐app信息
 * @returns {*}
 */
export function getDAppStoreBanner() {
  try {
    return RequestUtil.get('/api/dapp/store/banner')
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
 * 获取DApp store中app列表
 * @param param
 * @returns {*}
 */
export function getDAppStoreList(param) {
  try {
    return RequestUtil.get('/api/dapp/store/list', param)
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
 * Dapp授权检查
 * @param param
 * @returns {*}
 * dappId String dapp标示
 * accountName String 主网账户
 */
export function checkAuth(param) {
  try {
    return RequestUtil.get('/api/dapp/checkAuth', param)
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
 * Dapp授权
 * @param param
 * @returns {*}
 * dappid String dapp标示
 * accountName String 主网账户名
 */
export function dappAuth(param) {
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
 * Dapp授权列表
 * @param param
 * @returns {*}
 * current Number 当前页数
 * pageSize Number 每页显示记录数
 * accountName String 主网账户名
 */
export function dappList(param) {
  try {
    return RequestUtil.get('/api/dapp/list', param)
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
 * Dapp详情
 * @param param
 * @returns {*}
 */
export function dappOne(param) {
  try {
    return RequestUtil.get('/api/dapp/one', param)
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
 * Dapp开关
 * @param param
 * @returns {*}
 */
export function getAppStorePassedStatus() {
  try {
    return RequestUtil.get('/api/dapp/getAppStorePassedStatus', {})
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
