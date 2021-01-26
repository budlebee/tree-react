import { combineReducers } from 'redux'

import techtree from './techtree'
import user from './user'

const rootReducer = combineReducers({
  techtree,
  user,
})

export default rootReducer
