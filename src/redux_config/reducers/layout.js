import { COLLAPS_FALSE, COLLAPS_TRUE } from '../constants/layout'
let initState = {
  siderCollapsed: false,
  children: null,
  width: 250
};
function layout(state = initState, action) {
  switch (action.type) {
    case COLLAPS_TRUE:
      return Object.assign({},{siderCollapsed: true,children:action.children});
    case COLLAPS_FALSE:
      return Object.assign({},state,{siderCollapsed: false});
    default:
      return state;
  }
}

export default layout;
