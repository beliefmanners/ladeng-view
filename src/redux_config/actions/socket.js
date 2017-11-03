import {SOKCTE_DISCONNECT, SOKCTE_CONNECT, SOKCTE_RECONNECT} from '../constants/socket'
import CONFIG from 'config';
let {baseUrl} = CONFIG;

export function socketDeploy(webhookId,serviceId,token) {
  const Socket = require('socket.io-client')(`${baseUrl}?token=${token}`);
  return (dispatch) => {
    Socket.on('connect', function() {
      dispatch({Socket,type: SOKCTE_CONNECT})
    });
    Socket.on('disconnect', function() {
      console.log("与服务其断开");
      dispatch({Socket,type: SOKCTE_DISCONNECT});
      Socket.on('reconnect', function() {
        console.log("重新连接到服务器");
        dispatch({Socket,type: SOKCTE_RECONNECT});
      });
    });
  }
}
