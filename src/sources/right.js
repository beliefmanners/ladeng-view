import { get } from './fetch';

export function getMenuAllList() {
  return get('/api/menu/findAll');
}

export function getMenuMeList(data) {
  return get('/api/user/findById',data)
}

export function getMeMenuEle() {
  return get('/api/user/getUserRight');
}

