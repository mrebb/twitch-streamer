import {LOGIN, LOGOUT} from '../actions/auth-action.js';
// const getCookie =(cname)=>{
//   let name = cname + '=';
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(';');
//   for(let i = 0; i <ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) === ' ') {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) === 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return '';
// };
// const initialState = {isLoggedIn: false};
// getCookie('access_token')?(initialState['isLoggedIn']=true):(initialState['isLoggedIn']=false);

const initialState = {isLoggedIn: false};

export default (state = initialState, action) => {

  let {type, payload} = action;

  switch(type) {
  case LOGIN: return {...state, ...payload};
  case LOGOUT: return {...state, ...payload};
  default: return state;
  }
};