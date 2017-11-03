import { MODAL_FORM } from 'Redux_config/constants/const'
let initState = {
  modal:{
    fieldValue:{},
    formColumns:[]
  }
};

function otherAdd(state = initState, action) {
  switch (action.type){
    case MODAL_FORM:
      return Object.assign({},state,action);
    default:
      return state
  }
}
export default otherAdd
