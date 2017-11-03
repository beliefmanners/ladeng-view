import { GETRIGHTALL, GETRIGHTME, GETRIGHTME_CONFIG } from 'Redux_config/constants/right';
import {getMenuAllList, getMenuMeList, getMeMenuEle } from 'sources/right';

// 获取所有的 菜单地址
export function getAllMenuList() {
  return (dispatch, getState) => {
    let allMenu = getMenuAllList();
    let state = getState();
    let { right } = state;
    let result = allMenu.then((res) => {
      if (res.status === 'S'){
        dispatch(Object.assign({},right, {
          type: GETRIGHTALL,
          menuList: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}
// 获取自己的 菜单地址配置列表
export function getMeMenuList() {
  return (dispatch, getState) => {
    let state = getState();
    let { userInfo, right } = state;
    let meMenu = getMenuMeList({id: userInfo.id});
    let result = meMenu.then((res) => {
      if (res.status === 'S') {
        dispatch(Object.assign({},right,{
          type: GETRIGHTME_CONFIG,
          menuMeConfig: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

// 获取自己的权限菜单和元素
export function getMeMenuElement() {
  return (dispatch,getState) => {
    let meMenu =getMeMenuEle();
    let result = meMenu.then((res) => {
      if (res.status === 'S') {
        let right = getState().right;
        dispatch(Object.assign({},right,{
          type: GETRIGHTME,
          meRightMenuElement: res.data
        }))
      }
      return res;
    }).catch((res) => {
      return res;
    });
    return result;
  }
}

