// Action for Login
export const LOGIN='LOGIN';
// Action for Logput
export const LOGOUT='LOGOUT';

//Action creator for Login
export const login = () => ({
  type: LOGIN,
  payload: {isLoggedIn: true},
});

//Action creator for Login
export const logout = () => ({
  type: LOGOUT,
  payload: {isLoggedIn: false},
});


