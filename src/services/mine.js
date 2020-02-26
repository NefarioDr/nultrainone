import RequestUtil from '../commons/RequestUtil';

/**
 * 获取我喜欢的文章
 * @returns {*}
 */
export function getMyLikeArticle(param) {
  try {
    return RequestUtil.get('/api/content/getLikeContents', param)
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
 * 获取我喜欢的活动
 * @param param
 * @returns {*}
 */
export function getMyLikeActivity(param) {
  try {
    return RequestUtil.get('/api/activity/getLikeActivitys', param).then(
      response => {
        return response;
      },
    );
  } catch (error) {
    console.log(error);
  }
}

/**
 * 获取我的消息列表
 * @param param
 * @returns {*}
 */
export function getMyInfoList(param) {
  try {
    return RequestUtil.get('/api/users/getUserNotifys', param)
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
 * 获取超脑币总数
 * @returns {*}
 */
export function getURGCount(param) {
  try {
    return RequestUtil.get('/api/user/getWalletCount', param)
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
 * 获取超脑币获取消息记录
 * @returns {*}
 */
export function getURGInfoList(param) {
  try {
    return RequestUtil.get('/api/user/getWalletList', param)
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
export function saveUltrainWallet(param) {
  try {
    return RequestUtil.post('/api/user/saveUltrainWallet', param)
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
 * 获取用户信息
 * @returns {*}
 */
export function getUserInfoMation(param) {
  try {
    return RequestUtil.get('/api/users/getMyInfo', param)
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
// 获取用户未读消息总数
export function getNotReadNotifyCount(param) {
  try {
    return RequestUtil.get('/api/users/getNotReadNotifyCount', param)
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
// 获取用户已读消息设置
export function setNoticeHasRead(param) {
  try {
    return RequestUtil.post('/api/users/setNoticeHasRead', param)
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
 * 删除我喜欢的（文章，活动）
 * @returns {*}
 */
export function deleteMyLike(param) {
  try {
    return RequestUtil.get('/api/activity/delLike', param)
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
 * 获取分享剩余活动名额
 * @returns {*}
 */
export function getFriendCount() {
  try {
    return RequestUtil.get('/api/spread/count')
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
 * 查询出请求用户的状态以及积分数据
 * @returns {*}
 */
export function queryStatus(param) {
  try {
    return RequestUtil.get('/api/spread/queryStatus', param)
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
