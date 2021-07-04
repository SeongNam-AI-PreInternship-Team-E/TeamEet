import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer, { rootSaga } from './modules';
import createSagaMiddleware from 'redux-saga';
import { HashRouter } from 'react-router-dom';
import { composeWithDevTools } from 'redux-devtools-extension'; // 리덕스 개발자 도구
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
); // 스토어를 만듭니다.
const persistor = persistStore(store);
function loadUser() {
  try {
    const user = localStorage.getItem('user');
    if (!user) return;
  } catch (e) {
    console.log('local storage not working');
  }
}

sagaMiddleware.run(rootSaga);
ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
