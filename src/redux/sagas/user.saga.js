import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* loginUser(action) {
  try {
    yield put({ type: 'CLEAR_LOGIN_ERROR' });
    const config = { 
      headers: { 'Content-Type': 'application/json' }, 
      withCredentials: true 
    };
    
    const response = yield call(
      axios.post, 
      '/api/user/login', 
      action.payload,
      config
    );
    
    if (response.status === 200) {
      // Fetch user details after successful login
      yield put({ type: 'FETCH_USER' });
      
      // Additional role-based routing
      yield put({ type: 'LOGIN_SUCCESS' });
      
      // Conditionally fetch role-specific data
      if (action.payload.role === 'vendor') {
        yield put({ type: 'FETCH_VENDOR_TRUCKS' });
        yield put({ type: 'FETCH_VENDOR_ORDERS' });
      }
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error.response?.data?.message || 'Login failed';
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