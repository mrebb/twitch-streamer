import {ADD,UPDATE,DELETE,FETCH,FETCH_ALL} from '../actions/user-action.js';

let initialState = JSON.parse(window.localStorage.getItem('TwitchLogin')) || [];

export default (state = initialState, action) => {

  const {type, payload} = action;

  switch(type) {

  case ADD:{
    const users = [...state,payload];
    window.localStorage.setItem('TwitchLogin', JSON.stringify(users));
    return [...users];
  }
  case UPDATE:{
    const updatedState = state.filter(user=>user.id !== payload.id);
    return [
      ...updatedState, 
      payload,
    ];
  }
  case DELETE:{
    window.localStorage.removeItem('TwitchLogin');
    return [];
  }
  case FETCH:{
    const fetchState = state.filter(user=>user.id === payload.id);
    return [
      ...fetchState,
    ];
  }
  case FETCH_ALL:
    return [...payload];
  
  default: return state;
  }

};