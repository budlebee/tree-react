import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'
import { Router } from 'react-router-dom'
import { createBrowserHistory } from 'history'

import { applyMiddleware, createStore } from 'redux'
import rootReducer from './redux/index'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import ReduxThunk from 'redux-thunk'

import reportWebVitals from './reportWebVitals'

const customHistory = createBrowserHistory()

// logger 미들웨어는 마지막 순서에 와야함. 프로덕션 배포시엔 제거할 것.
export const reduxStore = createStore(
  rootReducer,
  applyMiddleware(
    ReduxThunk.withExtraArgument({ history: customHistory }),
    logger
  )
)

ReactDOM.render(
  <Router history={customHistory}>
    <Provider store={reduxStore}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
