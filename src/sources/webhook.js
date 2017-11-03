import { get, post } from './fetch';

export function api_getWebhhookList() {
  return get('/api/webhook/findAll');
}

export function api_getWebhhookLogList() {
  return get('/api/webhook/log/findAll')
}

export function api_deployWebhook(data) {
  return post('/api/webhook/deploy', data)
}

export function api_webhookConfig(data){
  return post('/api/webhook/config',data)
}

export function api_webhookFindConfigAll() {
  return get('/api/webhook/findConfigAll');
}

export function api_findWebhookById(data) {
  return get('/api/webhook/configById', data)
}

export function api_webhookLogSearch(data) {
  return get('/api/webhook/log/search', data)
}

export function api_webhookGetBranch(data){
  return get('/api/webhook/back/getBranch', data)
}
export function api_webhookRollBackProject(data){
  return post('/api/webhook/back/rollBackProject', data)
}
export function api_get(){
  return get('/home')
}
