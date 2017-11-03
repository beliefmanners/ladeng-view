import {post } from './fetch';

export function api_configMenu(data) {
  return post('/api/menu/configMenu', data)
};
