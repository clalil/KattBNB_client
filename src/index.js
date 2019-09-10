import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import configureStore from './state/store/configureStore'
import * as serviceWorker from './serviceWorker'
import { verifyCredentials } from './reduxTokenAuthConfig'
import axios from 'axios'


const development = 'http://localhost:3007'
const production = process.env.REACT_APP_API_ENDPOINT

axios.defaults.baseURL = production

const store = configureStore()
verifyCredentials(store)

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
)

serviceWorker.unregister()
