import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import smoothscroll from 'smoothscroll-polyfill';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

import * as serviceWorker from './serviceWorker';

import {
  dropdownData,
  copiedAction,
  userInfo,
  sendsayBridge,
  execAction,
  setAction,
} from './ReduxReducers';
import Router from './Router';

const rootReducer = combineReducers({
  dropdownData,
  copiedAction,
  userInfo,
  sendsayBridge,
  execAction,
  setAction,
});
const store = createStore(rootReducer, {});

// Added snooth scroll for Safari 6+, IE 9+, Edge 12+, Opera Next
smoothscroll.polyfill();

ReactDOM.render(
  <Provider store={store}>
    <Router />
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
