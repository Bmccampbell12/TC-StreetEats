// loginUser Saga: Handles the login process for a user
import { put, call } from 'redux-saga/effects';
import axios from 'axios';

function* loginUser(action) {
  try {
    // Clear any existing login errors
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    // Set up the request configuration
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    };

    // Make the POST request to the server to login the user
    const response = yield call(
      axios.post,
      '/api/user/login',
      action.payload,
      config
    );

    // Check if the response is successful
    if (response.data && response.data.user) {
      // Dispatch a SET_USER action to update the user state
      yield put({
        type: 'SET_USER',
        payload: response.data.user
      });

      // Fetch additional user data
      yield put({ type: 'FETCH_USER' });
    } else {
      // Throw an error if the response is not successful
      throw new Error('Invalid server response');
    }
  } catch (error) {
    // Log the error and dispatch a LOGIN_FAILED action
    console.error('Login error:', error);
    yield put({
      type: 'LOGIN_FAILED',
      payload: error.response?.data?.message || 'Login failed'
    });
  }
}

export default loginUser;