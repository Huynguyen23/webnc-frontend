/* eslint-disable no-console */
import fetch from 'cross-fetch';
import Swal from 'sweetalert2';
import API from '../Services/API';

const RECEIVER_LIST = 'RECEIVER_LIST';
const ADD_RECEIVER = 'ADD_RECEIVER';
const DELETE_RECEIVER = 'DELETE_RECEIVER';
const UPDATE_RECEIVER = 'UPDATE_RECEIVER';
// action


export const getReceiverList = body => dispatch => {
  const {accessToken} = JSON.parse(localStorage.getItem('tokens')) || "";
  return (
    fetch(API.RECEIVER_LIST, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'x-access-token': `${accessToken}`
      }
    })
      .then(response => response.json())
      .then(res => {
        dispatch({ type: RECEIVER_LIST, payload: res });
      })
      .catch(() => {
        Swal.fire('Lỗi', 'Lỗi mạng', 'error');
        return false;
      })
  );
};

export const addReceiver = body => dispatch => {
  const {accessToken} = JSON.parse(localStorage.getItem('tokens')) || "";
  const param = {...body};
  delete param.ten;
  return (
    fetch(API.ADD_RECEIVER, {
      method: 'POST',
      body: JSON.stringify(param),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'x-access-token': `${accessToken}`
      }
    })
      .then(response => response.json())
      .then(res => {
        console.log("payload", body)
        if (res.status > 0) {
          dispatch({ type: ADD_RECEIVER, payload: body });
        } 
        return res;
      })
  );
};

export const updateReceiver = body => dispatch => {
  const {accessToken} = JSON.parse(localStorage.getItem('tokens')) || "";
  return (
    fetch(API.UPDATE_RECEIVER, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'x-access-token': `${accessToken}`
      }
    })
      .then(response => response.json())
      .then(res => {
        if (res.status > 0) {
          dispatch({ type: UPDATE_RECEIVER, payload: body });
        }
        return res;
      })
  );
};

export const deleteReceiver = body => dispatch => {
  const {accessToken} = JSON.parse(localStorage.getItem('tokens')) || "";
  return fetch(API.DELETE_RECEIVER, {
    method: 'PUT',
    body:JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'x-access-token': `${accessToken}`
    }
  })
    .then(response => response.json())
    .then(res => {
      if (res.status > 0) {
        dispatch({ type: DELETE_RECEIVER, payload: body.stk_nguoi_nhan });
      }
      return res;
    })
    .finally(() => {});
};
// reducer
export const receiverList = (state = [], action) => {
  switch (action.type) {
    case RECEIVER_LIST:
      return action.payload.list;
    case ADD_RECEIVER:
      return [...state, action.payload];
    case DELETE_RECEIVER:
      return state.filter(item => item.stk_nguoi_nhan !== action.payload);
    case UPDATE_RECEIVER: {
      var receiver = state.find(i=>i.stk_nguoi_nhan=== action.payload.stk_nguoi_nhan);
      receiver.ten_goi_nho = action.payload.ten;
      return state;
    }
    default:
      return state;
  }
};
