import {SERVICE_LIST, SEARCH_SERVICE} from '../constants/service'

let initState = {
  list: []
};

function service(state = initState, action) {
  switch (action.type){
    case SERVICE_LIST:
      return Object.assign({}, state, action);
    case SEARCH_SERVICE:
      return Object.assign({}, state, action);
    default:
      return state;
  }
}
export default service;
