// registerUser Saga: Handles the registration process for a new user
import { put, call } from 'redux-saga/effects';
import axios from 'axios';

function* registerUser(action) {
  try {
    // Clear any existing registration errors
    yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

    // Set up the request configuration
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    // Make the POST request to the server to register the new user
    const response = yield call(
      axios.post,
      '/api/user/register',
      action.payload,
      config
    );

    // Check if the response is successful
    if (response.data) {
      // Dispatch a LOGIN action to log the new user in
      yield put({
        type: 'LOGIN',
        payload: {
          username: action.payload.username,
          password: action.payload.password,
          role: action.payload.role
        }
      });

      // Clear any existing registration errors
      yield put({ type: 'CLEAR_REGISTRATION_ERROR' });
    }
  } catch (error) {
    // Log the error and dispatch a REGISTRATION_FAILED action
    console.error('Registration error:', error);
    yield put({
      type: 'REGISTRATION_FAILED',
      payload: error.response?.data?.message || 'Registration failed'
    });
  }
}

export default registerUser;