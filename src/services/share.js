import RequestUtil from '../commons/RequestUtil';

/**
 * share 资讯记录
 * @returns {*}
 */
export function saveShareArticleRecord(params) {
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
/**
 * share 活动记录
 * @returns {*}
 */
export function saveShareActivityRecord(params) {
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
