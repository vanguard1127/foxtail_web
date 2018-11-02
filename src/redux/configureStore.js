import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from 'redux/reducers';

let store;

function configureStoreProd(initialState) {
  const middlewares = [thunk];
  store = createStore(rootReducer, initialState, compose(applyMiddleware(...middlewares)));
  return store;
}

function configureStoreDev(initialState) {
  const middlewares = [thunk];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools
  store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export function getStore() {
  return store;
}

export default configureStore;
