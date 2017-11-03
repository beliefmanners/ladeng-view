// import axios from 'axios';
import appConfig from 'config';
const { USERINFO } = appConfig;
import qwest from 'qwest';
import CONFIG from 'config';
let {baseUrl} = CONFIG;
import Cookies from 'js-cookie';
const post = function (url,data) {
  url = baseUrl+ url;
  let userInfo = Cookies.get(USERINFO);
  let token = '';
  if (userInfo && typeof userInfo === 'string') {
    try {
      token = JSON.parse(userInfo);
      token = token?token['token']: ''
    } catch (err) {
      /* eslint no-console:0 */
      console.error('数据类型',`userInfo 是 ${userInfo}`,err );
    }
  } else {
    token =userInfo? userInfo['token'] : ''
  }

  return new Promise((resolve, reject) => {
    qwest.post(url, data, {
      headers: {
        token: token
      },
      timeout: 120000
    }).then((xhr, resp) => {
      resolve(resp);
    }).catch((e, xhr, resp) => {
      reject(resp);
    });
  });
};

const get = function(url, data) {
  url = baseUrl+ url;
  let userInfo = Cookies.get(USERINFO);
  let token = '';
  if (userInfo && typeof userInfo === 'string') {
    try {
      token = JSON.parse(userInfo);
      token = token?token['token']: ''
    } catch (err) {
      /* eslint no-console:0 */
      console.error('数据类型',`userInfo 是 ${userInfo}`,err );
    }
  } else {
    token =userInfo? userInfo['token'] : ''
  }
  return new Promise((resolve, reject) => {
    qwest.get(url,data,{
      headers: {
        token: token
      },
      timeout: 120000
    }).then((res,req) => {
      resolve(req);
    }).catch((e, xhr, resp) => {
      reject(resp);
    });
  })
};
module.exports = {
  post,
  get
};
