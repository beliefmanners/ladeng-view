import { get, post } from './fetch'

export function api_getRoleList() {
  return get('/api/role/findAll');
}

export function api_configRole(data){
  return post('/api/role/configRole',data)
}

export function api_getRoleRight(data) {
  return get('/api/role/findRoleRight', data)
}

export function api_getUserList(){
  return get('/api/user/findAll')
}

export function api_activeUser(data) {
  return get('/api/user/active?status=1', data)
}

export function api_getUserRight(data){
  return get('/api/user/findById', data)
}
export function api_configUserRight(data) {
  return post('/api/user/configRight', data)
}

export function api_getMenuList() {
  return get('/api/menu/findAll')
}

export function api_configMenu(data) {
  return post('/api/menu/configMenu', data)
}

export function api_getElementList() {
  return get('/api/element/findAll')
}

export function api_configElement(data) {
  return post('/api/element/configElement', data)
}
