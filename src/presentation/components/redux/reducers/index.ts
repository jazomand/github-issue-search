import { combineReducers } from 'redux';

import issuesReducer from './issuesReducer';

const rootReducer = combineReducers({
  issues: issuesReducer,
})

export default rootReducer