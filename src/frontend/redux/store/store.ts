import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { marketReducer } from '../reducers/marketReducer';

const rootReducer = combineReducers({
  market: marketReducer
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

export type IRootState = ReturnType<typeof rootReducer>;
