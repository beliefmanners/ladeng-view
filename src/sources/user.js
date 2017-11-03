import { get, post } from './fetch';

export function getUserRight(data){
  return get('/api/user/findById', data)
}

export function configUserRight(data) {
  return post('/api/user/configRight', data)
}

