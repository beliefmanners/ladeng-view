import { get,post } from './fetch.js'
// 登录
export function Login(data) {
  return post('/api/session/login',data);
}
// 检测登录
export function CheckLogin() {
  return get('/api/session/checkLogin');
}
