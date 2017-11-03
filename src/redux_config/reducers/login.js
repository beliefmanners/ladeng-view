import { LOGIN, LOGIN_CHECK, OUTPUT_LOGIN } from 'Redux_config/constants/login';

function Login(state = {}, action) {
  if (action.type) {
    switch (action.type){
      case LOGIN:
        return Object.assign({}, {actionType: LOGIN}, action.userInfo);
      case LOGIN_CHECK:
        return Object.assign({}, {actionType: LOGIN_CHECK}, action.userInfo);
      case OUTPUT_LOGIN:
        return Object.assign({}, {actionType: OUTPUT_LOGIN});
      default:
        return state;
    }
  }
}

export default Login;
