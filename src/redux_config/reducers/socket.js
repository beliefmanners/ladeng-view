
import {SOKCTE_DISCONNECT, SOKCTE_CONNECT, SOKCTE_RECONNECT} from '../constants/socket'
let initState = {
  Socket: null,
  connected: false
};
function socket (state = initState, action) {
  switch (action.type) {
    case SOKCTE_CONNECT:
      return {Socket: action.Socket, connected: true};
    case SOKCTE_RECONNECT:
      return {Socket: action.Socket, connected: false};
    case SOKCTE_DISCONNECT:
      return {Socket: action.Socket, connected: false};
    default:
      return state;
  }
}
export default socket;
