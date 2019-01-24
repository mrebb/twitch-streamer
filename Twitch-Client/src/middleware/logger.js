export default  store => next => action => {
  if (process.env.NODE_ENV !== 'production') {
    console.log('1. Old state: ', store.getState());
    console.log('2. Actions type: ', action.type);
  }
  let result = next(action);
  if (process.env.NODE_ENV !== 'production') {
    console.log('3. New state: ', store.getState());
  }
  return result;
};