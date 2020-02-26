// //backend env url
export const ImageUrl = 'https://developer.ultrain.info'
export const BaseUrl = 'https://dev.ultrain.info'
// 测试
//export const ImageUrl = 'https://testnet-developer.ultrain.info'
//export const BaseUrl = 'https://testnet-dev.ultrain.info'
//export const ImageUrl = "http://127.0.0.1:3335";
//export const BaseUrl = "http://127.0.0.1:7777";
//export const BaseUrl = "http://benyasin.s1.natapp.cc";
// export const BaseUrl = "http://ultrainio.natapp1.cc";
//

// 红包
export const RedPackageBaseUrl = 'https://envelope.ultrain.info'

// 资讯
export const ARTICLE_LIST = BaseUrl + '/api/content/getTopList'
export const ARTICLE_BANNER_LIST = BaseUrl + '/api/content/getBannerContent'

//  喜欢 分享
export const GET_LIKE = BaseUrl + '/api/content/getLikeStatus'
export const UPDATE_LIKE = BaseUrl + '/api/content/updateLikeAndShare'
export const ACTIVITY_UPDATE_LIKE = BaseUrl + '/api/activity/updateLikeAndShare'

// 活动列表
export const ACTIVITY_LIST = BaseUrl + '/api/activity/getList'
// 确认报名
export const ACTIVITY_ADD_LIST = BaseUrl + '/api/activity/addMyActivity'

// 我的消息
export const MINE_INFO_LIST = BaseUrl + '/api/users/getUserNotifys'
export const MINE_INFO_DEL = BaseUrl + '/api/users/delUserNotify'

// 手机号验证
export const GET_PHONE_CODE = BaseUrl + '/api/users/getPhoneCode'
export const VALID_PHONE_CODE = BaseUrl + '/api/users/validPhoneCode'

// 我喜欢的 资讯 活动
export const LIKE_CONTNET = BaseUrl + '/api/content/getLikeContents'
export const LIKE_ACTIVITY = BaseUrl + '/api/activity/getLikeActivitys'
export const MINE_LIKE_DEL = BaseUrl + '/api/activity/delLike'
