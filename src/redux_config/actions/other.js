import { MODAL_FORM } from '../constants/const';

export function addFieldVal(formColumns,fieldValue){
  return (dispatch, getState) => {
    let { other } = getState();
    other.modal.fieldValue = fieldValue;
    other.modal.formColumns = formColumns;
    dispatch(Object.assign({}, {
      type: MODAL_FORM,
      other
    }))
  }
}
