import {MENU_LIST, USER_LIST, ROEL_LIST, ELEMENT_LIST} from 'Redux_config/constants/system'

let initState = {
  menuList:[],
  userList:[],
  roleList:[],
  elementList:[]
};

function system(state = initState, action) {
  let type = action.type;
  if(type === MENU_LIST || type === ROEL_LIST || type === USER_LIST || type === ELEMENT_LIST)
    return Object.assign({}, state, action);
  return state;
}
export default system;
