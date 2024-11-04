import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import truck from './truck.reducer.js';
// import userPreferences from '/Users/brucemccampbell/PRIME/week14/TC-StreetEats/src/components/App/UserDashboard/UserPreferences.jsx';
// import reviews from './user.reducer';
// import menu from './user.reducer';
// import favorites from './user.reducer';




// rootReducer is the primary reducer for our entire project
// It bundles up all of the other reducers so our project can use them.
// This is imported in index.js as rootSaga

// Lets make a bigger object for our store, with the objects from our reducers.
// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  user,
  truck, // will have an id and username if someone is logged in
});

export default rootReducer;
