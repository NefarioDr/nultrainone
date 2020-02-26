import RequestUtil from '../commons/RequestUtil';

/**
 * 头部Banner
 * @returns {*}
 */
export function getAllBanners() {
  try {
    return RequestUtil.get('/api/content/getBannerContent')
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
 * 资讯列表内容
 * @param param
 * @returns {*}
 */
export function getAllReads(param) {
  try {
    return RequestUtil.get('/api/content/getTopList', param)
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

//
export function getContentsByCategoryUrl(param) {
  try {
    return RequestUtil.get('/api/content/getContentsByCategoryUrl', param)
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
