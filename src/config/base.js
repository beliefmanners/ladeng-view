'use strict';

// Settings configured here will be merged into the final config object.
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}
const formatDate = function(date, fmt) {
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};
export default {
  'USERINFO': 'USER_INFO_TOKEN',
  caleUpdateTime(date){
    let oldTime = new Date(date);
    let now = new Date();
    let update = (now - oldTime)/1000;
    if(!date || !update || !oldTime) {
      return date;
    }
    let result;
    if (update < 60){
      result = parseInt(update) + '秒前';
    } else if (update < 3600) {
      result = parseInt(update/60) + '分钟前';
    } else if (update < 86400) { //天
      result = parseInt(update/60/60) + '小时前';
    } else if (update < 2592000) { // 月
      result = parseInt(update/60/60/24) + '天前';
    } else if (update < 31104000) { // 年
      result = parseInt(update/60/60/24/30) + '月前';
    } else {
      result = parseInt(update/60/60/24/30/12) + '年前';
    }
    return result;
  },
  baseUrl:  'http://dataladen.gag.cn',// 'http://127.0.0.1:8001',
  formatDate: formatDate
}
