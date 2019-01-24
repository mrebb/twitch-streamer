import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducer/user.js';
import authReducer from './reducer/auth.js';

import logger from '../middleware/logger.js';

const appReducer = combineReducers({
  userState:userReducer, authState:authReducer,
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(appReducer, composeEnhancers(applyMiddleware(thunk, logger,)));

