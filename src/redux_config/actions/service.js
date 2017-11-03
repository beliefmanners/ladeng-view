import { SERVICE_LIST } from '../constants/service'

import {api_getServiceList, api_configService} from 'sources/service'

// 获取service list 列表
export function getServiceList() {
  return (dispatch, getState) => {
    let serviceListPromise = api_getServiceList();
    let result = serviceListPromise.then((res) => {
      if (res.status === 'S') {
        let {service} = getState();
        dispatch(Object.assign({}, service, {
          type: SERVICE_LIST,
          list: res.data
        }));
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

// 查询某个服务列表

export function configService(data) {
  return ()=> {
    let serviceConfigPromise = api_configService(data);
    return serviceConfigPromise;
  }
}

