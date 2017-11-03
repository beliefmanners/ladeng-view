import { WEBHOOK_LIST, WEBHOOK_LOG, WEBHOOK_CONFIG_LIST } from '../constants/webhook'

let initState = {
  webhookList:[],
  webhookLog:[],
  configList:[]
};

function webhhook(state=initState, action) {
  switch (action.type){
    case WEBHOOK_LIST:
      return Object.assign({}, state, action);
    case WEBHOOK_LOG:
      return Object.assign({}, state, action);
    case WEBHOOK_CONFIG_LIST:
      return Object.assign({}, state, action);
    default:
      return state;
  }
};
export default webhhook
