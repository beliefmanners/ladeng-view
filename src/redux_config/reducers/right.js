import { GETRIGHTALL, GETRIGHTME, GETRIGHTME_CONFIG } from 'Redux_config/constants/right';

let initstate = {
  menuMeConfig: {},
  menuList: [],
  meRightMenuElement: {
    menu:[],
    element:[]
  }
};
function right(state = initstate,action) {
  switch (action.type){
    case GETRIGHTME:
      return Object.assign({},state,action);
    case GETRIGHTALL:
      return Object.assign({},state,action);
    case GETRIGHTME_CONFIG:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}

export default right;
