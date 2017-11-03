import { get, post } from './fetch'

export function configRoleRight(data){
  return post('/api/role/configRole', data)
}
export function getRoleRight(data) {
  return get('/api/role/findRoleRight', data)
}

