import { combineReducers } from 'redux';
import userInfo from './login'
import right from './right'
import webhook from './webhook';
import service from './service'
import layout from './layout'
import other from './other'
import system from './system'
// mport socket from './socket'

//使用redux的combineReducers方法将所有reducer打包起来
const rootReducer = combineReducers({
  userInfo,
  right,
  webhook,
  service,
  layout,
  other,
  system
});

export default rootReducer;
