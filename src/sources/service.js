import { get, post } from './fetch'

export function api_getServiceList() {
  return get('/api/service/findAll');
}

export function api_getServiceById(data) {
  return get('/api/service/findById',data);
}

export function api_configService(data) {
  return post('/api/service/configService', data);
}
