import {BaseUrl} from '../constants/Urls';
import Qs from 'qs';
import I18n from '../../resources/languages/I18n';

//拼接参数
const getParam = data => {
  return Object.entries(data)
    .map(([key, value]) => {
      return `${key}=${value}`;
    })
    .join('&');
};

const get = (path, param, otherUrl) => {
  let isOk;
  return new Promise((resolve, reject) => {
    let url = `${BaseUrl}${path}`;
    if (otherUrl) {
      url = `${otherUrl}${path}`;
    }
    if (param) {
      url = url.concat(`?${getParam(param)}`);
    }
    return fetch(url, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        lang: I18n.locale == 'zh' ? 'zh' : 'en',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    })
      .then(response => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then(responseData => {
        console.log(url, responseData);
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch(error => {
        console.log(url + ', get():Error Stack: ' + error.stack);
        reject(error);
      });
  });
};

const post = (path, params, otherUrl) => {
  let isOk;
  return new Promise((resolve, reject) => {
    let url = `${BaseUrl}${path}`;
    if (otherUrl) {
      url = `${otherUrl}${path}`;
    }
    let body = Qs.stringify(params);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        lang: I18n.locale == 'zh' ? 'zh' : 'en',
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      body: body,
    })
      .then(response => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then(responseData => {
        console.log(url, body, responseData);
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch(error => {
        console.log(url + ', post():Error Stack: ' + error.stack);
        reject(error);
      });
  });
};

const postJson = (path, params, otherUrl) => {
  let isOk;
  return new Promise((resolve, reject) => {
    let url = `${BaseUrl}${path}`;
    if (otherUrl) {
      url = `${otherUrl}${path}`;
    }
    let body = JSON.stringify(params);

    return fetch(url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        lang: I18n.locale == 'zh' ? 'zh' : 'en',
        'Content-Type': 'application/json',
      },
      body: body,
    })
      .then(response => {
        if (response.ok) {
          isOk = true;
        } else {
          isOk = false;
        }
        return response.json();
      })
      .then(responseData => {
        console.log(url, body, responseData);
        if (isOk) {
          resolve(responseData);
        } else {
          reject(responseData);
        }
      })
      .catch(error => {
        console.log(url + ', post():Error Stack: ' + error.stack);
        reject(error);
      });
  });
};

const postImg = (path, params, otherUrl) => {
  let isOk;
  let url = `${BaseUrl}${path}`;
  if (otherUrl) {
    url = `${otherUrl}${path}`;
  }
  let body = Qs.stringify(params);

  console.log(url, body);

  return fetch(url, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      lang: I18n.locale == 'zh' ? 'zh' : 'en',
      'Content-Type': 'multipart/form-Data;boundary=qwwrtrtrfd',
    },
    body: body,
  })
    .then(response => {
      //console.log(response);
      if (response.ok) {
        isOk = true;
      } else {
        isOk = false;
      }
      return response.json();
    })
    .then(responseData => {
      //console.log(responseData);
      if (isOk) {
        resolve(responseData);
      } else {
        reject(responseData);
      }
    })
    .catch(error => {
      console.log('postImg():Error Stack: ' + error.stack);
      reject(error);
    });
  // });
};

export default {
  get,
  post,
  postJson,
  postImg,
};
