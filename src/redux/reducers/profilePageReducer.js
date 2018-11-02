import * as types from 'redux/actionTypes/profilePageActionTypes';
import { profilePage } from 'redux/initialState';

export default function profilePageReducer(state = profilePage, action) {
  switch (action.type) {
    case types.SET_IMAGE_FOR_CANVAS:
      return {
        ...state,
        imageObject: action.payload
      };
    default:
      return state;
  }
}