import * as types from 'redux/actionTypes/profilePageActionTypes';

export function setImageForCanvas(object) {
  return {
    type: types.SET_IMAGE_FOR_CANVAS,
    payload: object
  }
}