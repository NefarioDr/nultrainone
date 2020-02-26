import RequestUtil from '../commons/RequestUtil';

/**
 * 获取全部活动
 * @returns {*}
 */
export function getAllActivity(param) {
  try {
    return RequestUtil.get('/api/activity/getList', param)
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
 * 获取我的活动
 * @param param
 * @returns {*}
 */
export function getMyActivity(param) {
  try {
    return RequestUtil.get('/api/activity/getMyActivitys', param)
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
 * 确认报名（参加活动）
 * @param param
 * @returns {*}
 */
export function JoinActivity(param) {
  try {
    return RequestUtil.post('/api/activity/addMyActivity', param)
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
