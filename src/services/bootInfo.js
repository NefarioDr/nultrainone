import RequestUtil from '../commons/RequestUtil';

/**
 * 获取App开机配置页信息
 * @returns {*}
 */
export function getAppBootInfo() {
  try {
    return RequestUtil.get('/api/app/bootInfo')
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
