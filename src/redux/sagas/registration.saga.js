import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';



// worker Saga: will be fired on "REGISTER" actions
function* registerUser(action) {
  try {
    // Clears existing registration page
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });
     // clear any existing error on the registration page
    console.log('Payload for registration:', action.payload);
    // passes the username and password from the payload to the server
    yield axios.post('/user/registration', action.payload, { withCredentials: true }); 
    // automatically log a user in after registration
    yield put({ type: 'LOGIN', payload: action.payload });

    yield put({ type: 'REGISTRATION_SUCCESS' })
    history.push('/login');

    // set to 'login' mode so they see the login screen
    // after registration or after they log out
    yield put({ type: 'SET_TO_LOGIN_MODE' });
  } catch (error) {
    console.log('Error with user registration:', error.response ? error.response.data : error)
    //Dispatch error actions
    yield put({ type: 'REGISTRATION_FAILED' })
    yield put({ type: 'REGISTRATION_INPUT_ERROR' })
  }
};

function* registrationSaga() {
  yield takeLatest('REGISTER', registerUser);
}

export default registrationSaga;
