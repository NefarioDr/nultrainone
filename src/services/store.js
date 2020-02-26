import RequestUtil from '../commons/RequestUtil';

/**
 * 商场列表内容
 * @param param
 * @returns {*}
 */
export function getAllLists(param) {
  try {
    return RequestUtil.get('/api/store/info', param)
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
