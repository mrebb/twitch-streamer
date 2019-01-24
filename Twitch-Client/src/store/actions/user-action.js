// Actions for User reducer
export const ADD = 'ADD';
export const UPDATE = 'UPDATE';
export const DELETE = 'DELETE';
export const FETCH = 'FETCH';
export const FETCH_ALL = 'FETCH_ALL';

//Action creators for User reducer to maintian current logged in user
export const addUser=(user)=>{

  return {
    type:ADD,
    payload: user,
  };
};
export const updateUser=(user)=>{
  return {
    type:UPDATE,
    payload: user,
  };
};
export const deleteUser=(user)=>{
  return {
    type:DELETE,
    payload: user,
  };
};
export const fetchUser=(user)=>{
  return {
    type:FETCH,
    payload: user,
  };
};
export const fetchAllUsers=()=>{
  return {
    type:FETCH_ALL,
  };
};