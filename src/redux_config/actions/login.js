import Cookies from 'js-cookie';
import AppConfig  from 'config';
const {USERINFO} = AppConfig;
import { LOGIN, LOGIN_CHECK, OUTPUT_LOGIN } from 'Redux_config/constants/login';
import { Login, CheckLogin } from "sources/login";

// 登录
export function logingIn(data) {
  return (dispatch) => {
    let remember = data.remember;
    const loginResult = Login({
      userName: data.userName,
      password: data.password
    });
    let result = loginResult.then((res) => {
      if (res.status === 'F')
        return res;
      let setState = {
        type: LOGIN,
        userInfo: res.data
      };
      dispatch(setState);
      if (remember)
        Cookies.set(USERINFO,res.data, {expires: 7});
      else
        Cookies.set(USERINFO, {});
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

export function loginCheck() {
  return (dispatch) => {
    const loginCheckResult = CheckLogin();
    let result = loginCheckResult.then((res) => {
      if (res.status === 'F')
        return res;
      let setState = {
        type: LOGIN_CHECK,
        userInfo: res.data
      };
      dispatch(setState);
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

export function loginOut() {
  return (dispatch) => {
    Cookies.set(USERINFO, {});
    dispatch({
      type: OUTPUT_LOGIN
    })
  }
}

