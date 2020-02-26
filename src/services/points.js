import RequestUtil from '../commons/RequestUtil';

/**
 * 获取合约以及合约中总积分信息
 * @returns {*}
 */
export function getContractInfo(param) {
  try {
    return RequestUtil.get('/api/points/contractInfo', param)
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
 * 获取用户签到打卡记录信息
 * @param param
 * @returns {*}
 */
export function getSignInfo(param) {
  try {
    return RequestUtil.get('/api/points/signInfo', param)
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
 * 积分签到
 * @param param
 * @returns {*}
 */
export function sign(param) {
  try {
    return RequestUtil.post('/api/points/sign', param)
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
