import IssueInteractor from '../../../domain/interactors/IssueInteractor';
import rootReducer from './reducers';
import thunkMiddleware from 'redux-thunk';

import { createStore, applyMiddleware, compose } from 'redux';

export default function configureStore (issueInteractor: IssueInteractor) {
  const middlewares = [
    thunkMiddleware.withExtraArgument({
      issueInteractor
    })
  ];
  const middlewareEnhancer = applyMiddleware(...middlewares);
  const enhancers = [middlewareEnhancer];
  const composedEnhancers: any = compose(...enhancers);
  return createStore(rootReducer, composedEnhancers);
};