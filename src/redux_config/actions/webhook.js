import { WEBHOOK_LIST, WEBHOOK_LOG, WEBHOOK_CONFIG_LIST } from '../constants/webhook';
import { api_getWebhhookList, api_getWebhhookLogList, api_webhookFindConfigAll, api_webhookConfig, api_webhookLogSearch } from 'sources/webhook'

// 获取webhook list
export function getWebhhookList() {
  return (dispatch, getState) => {
    let {webhhook} = getState();
    let webhookListPromise = api_getWebhhookList();
    let result = webhookListPromise.then((res) => {
      if(res.status === 'S') {
        dispatch(Object.assign({}, webhhook,{
          type:WEBHOOK_LIST,
          webhookList: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}


// 获取webhook 日志列表
export function getWebhookLogList() {
  return (dispatch, getState) => {
    let {webhhook} = getState();
    let webhookLogPromise = api_getWebhhookLogList();
    let result = webhookLogPromise.then((res) => {
      if(res.status === 'S') {
        dispatch(Object.assign({}, webhhook,{
          type:WEBHOOK_LOG,
          webhookLog: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

export function getWebhookConfigList() {
  return (dispatch, getState) => {
    let { webhook } = getState();
    let webhookPromise = api_webhookFindConfigAll();
    let result = webhookPromise.then((res) => {
      if(res.status === 'S') {
        dispatch(Object.assign({},webhook,{
          type: WEBHOOK_CONFIG_LIST,
          configList: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

export function configWebhook(data) {
  return () => {
    let webhookConfig = api_webhookConfig(data);
    return webhookConfig;
  }
}

export function webhookLogSearch(data) {
  return (dispatch, getState) => {
    let {webhhook} = getState();
    let webhookLogPromise = api_webhookLogSearch(data);
    let result = webhookLogPromise.then((res) => {
      if(res.status === 'S') {
        dispatch(Object.assign({}, webhhook,{
          type:WEBHOOK_LOG,
          webhookLog: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}
