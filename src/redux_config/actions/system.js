import {MENU_LIST, ELEMENT_LIST, ROEL_LIST, USER_LIST} from 'Redux_config/constants/system';

import { api_getMenuList, api_getRoleList, api_getUserList, api_getElementList } from 'sources/system'

export function getRoleList() {
  return (dispatch, getState) => {
    let { system } = getState();
    let rolePromise = api_getRoleList();
    rolePromise.then((res) => {
      if(res.status === 'S') {
        system.roleList = res.data
        dispatch(Object.assign({},system, {type: ROEL_LIST}))
      }
      return res;
    }).catch((res) => {
      return res;
    })
  }
}

export function getMenuList() {
  return (dispatch, getState) => {
    let { system } = getState();
    let rolePromise = api_getMenuList();
    rolePromise.then((res) => {
      if(res.status === 'S') {
        system.menuList = res.data;
        dispatch(Object.assign({},system, {type: MENU_LIST}))
      }
      return res;
    }).catch((res) => {
      return res;
    })
  }
}

export function getUserList() {
  return (dispatch, getState) => {
    let { system } = getState();
    let rolePromise = api_getUserList();
    rolePromise.then((res) => {
      if(res.status === 'S') {
        system.userList = res.data;
        dispatch(Object.assign({},system, {type: USER_LIST}))
      }
      return res;
    }).catch((res) => {
      return res;
    })
  }
}

export function getElementList() {
  return (dispatch, getState) => {
    let { system } = getState();
    let rolePromise = api_getElementList();
    rolePromise.then((res) => {
      if(res.status === 'S') {
        system.elementList = res.data;
        dispatch(Object.assign({},system, {type: ELEMENT_LIST}))
      }
      return res;
    }).catch((res) => {
      return res;
    })
  }
}


