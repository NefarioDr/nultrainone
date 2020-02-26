import RequestUtil from '../commons/RequestUtil';

/**
 * 矿池状态
 * @returns {*}
 */
export function allMinerStatus() {
  try {
    return RequestUtil.get('/api/appForward/allMinerStatus')
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
 * 用户关联的矿工
 * @param param
 * @returns {*}
 */
export function listUserStatus(param) {
  try {
    return RequestUtil.get('/api/appForward/listUserStatus', param)
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
 * 单独矿工数据
 * @param param
 * @returns {*}
 */
export function listMinerStatus(param) {
  try {
    return RequestUtil.get('/api/appForward/listMinerStatus', param)
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
 * 保存eth地址
 * @param param
 * @returns {*}
 */
export function saveETHAddress(param) {
  try {
    return RequestUtil.get('/api/appForward/saveETHAddress', param)
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
 * 获取是否关联矿工
 * @param param
 * @returns {*}
 */
export function relateMinerStatus(param) {
  try {
    return RequestUtil.get('/api/appForward/relateMinerStatus', param)
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
 * 查询关联的ETH地址
 * @param param
 * @returns {*}
 */
export function queryETHAddress(param) {
  try {
    return RequestUtil.get('/api/appForward/queryETHAddress', param)
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
 * 矿工申请
 * @param param
 * @returns {*}
 * chain
 * count
 * name
 * email
 * mobileNo
 */
export function addMiners(param) {
  try {
    return RequestUtil.post('/api/miners/add', param)
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
 * 获取抵押币
 * @param param
 * @returns {*}
 * minerAccount
 */
export function fetchMinerMortgageBalance(param) {
  try {
    return RequestUtil.get('/api/appForward/fetchMinerMortgageBalance', param)
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
