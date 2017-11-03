import { COLLAPS_FALSE, COLLAPS_TRUE } from '../constants/layout'

export function collapsOk({children,width}) {
  return (dispatch) => {
    dispatch({
      type: COLLAPS_TRUE,
      children,
      width
    })
  }
}

export function collapsCancel() {
  return (dispatch) => {
    dispatch({
      type: COLLAPS_FALSE
    })
  }
}
