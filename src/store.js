import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promiseMiddleware from 'redux-promise-middleware';
import reducer from './reducers';

const middleware = applyMiddleware(promiseMiddleware(), thunk, logger());

const store = createStore(reducer, middleware);

export default store;
