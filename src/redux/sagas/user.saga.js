import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* loginUser(action) {
  try {
    // Clear any existing errors
    yield put({ type: 'CLEAR_LOGIN_ERROR' });

    const config = { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    };
    
    // Attempt login
    const response = yield call(
      axios.post, 
      '/api/user/login', 
      action.payload,
      config
    );
    
    // Check if we have a successful response and user data
    if (response.data && response.data.username) {
      // Store user data
      yield put({ 
        type: 'SET_USER', 
        payload: response.data 
      });
      
      // Signal login success
      yield put({ type: 'LOGIN_SUCCESS' });
      
      // Only fetch role-specific data if we have confirmed the role from server
      if (response.data.role === 'vendor') {
        yield put({ type: 'FETCH_VENDOR_TRUCKS' });
        yield put({ type: 'FETCH_VENDOR_ORDERS' });
      }
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle different types of errors
    let errorMessage = 'Login failed';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || 'Server error during login';
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please try again.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Error during login request';
    }
    
    yield put({ 
      type: 'LOGIN_FAILED', 
      payload: errorMessage 
    });
  }
}

function* logoutUser() {
  try {
    const config = { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    };
    
    yield call(axios.post, '/api/user/logout', {}, config);
    
    yield put({ type: 'UNSET_USER' });
    yield put({ type: 'CLEAR_VENDOR_DATA' });
  } catch (error) {
    console.error('Logout error:', error);
    yield put({ type: 'LOGOUT_FAILED' });
  }
}

function* fetchUser() {
  try {
    const config = { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    };
    
    const response = yield call(axios.get, '/api/user', config);
    
    if (response.data) {
      yield put({ type: 'SET_USER', payload: response.data });
    }
  } catch (error) {
    if (error.response?.status === 403) {
      yield put({ type: 'UNSET_USER' });
      yield put({ 
        type: 'LOGIN_FAILED', 
        payload: 'Please log in to continue' 
      });
    }
  }
}

function* authSaga() {
  yield takeLatest('LOGIN', loginUser);
  yield takeLatest('LOGOUT', logoutUser);
  yield takeLatest('FETCH_USER', fetchUser);
}

export default authSaga;