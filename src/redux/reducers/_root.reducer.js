// rootReducer: Combines all the reducers into a single reducer
import { combineReducers } from 'redux';
import reviewReducer from '/Users/brucemccampbell/PRIME/week14/TC-StreetEats/src/redux/reducers/review.reducer.js';
import errors from '/Users/brucemccampbell/PRIME/week14/TC-StreetEats/src/redux/reducers/errors.reducer.js';
import user from '/Users/brucemccampbell/PRIME/week14/TC-StreetEats/src/redux/reducers/user.reducer.js';
import truck from '/Users/brucemccampbell/PRIME/week14/TC-StreetEats/src/redux/reducers/truck.reducer.js';

// rootReducer function: Combines all the reducers into a single reducer
const rootReducer = combineReducers({
  review: reviewReducer,
  errors,
  user,
  truck
});

export default rootReducer;
