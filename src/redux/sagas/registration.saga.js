import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* registerUser(action) {
    try {
        // Clear any existing errors
        yield put({ type: 'CLEAR_REGISTRATION_ERROR' });

        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        };

        // Register the user
        const response = yield call(
            axios.post, 
            '/api/user/register', 
            action.payload, 
            config
        );

        if (response.data) {
            // Log them in after registration
            yield put({ 
                type: 'LOGIN',
                payload: {
                    username: action.payload.username,
                    password: action.payload.password,
                     role: action.payload.role
                }
            });
            
            // Clear registration errors
            yield put({ type: 'CLEAR_REGISTRATION_ERROR' });
        }
    } catch (error) {
        console.log('Registration error:', error.response?.data?.message || error.message);
        yield put({ 
            type: 'REGISTRATION_FAILED',
            payload: error.response?.data?.message || 'Registration failed. Please try again.'
        });
    }
}

function* registrationSaga() {
    yield takeLatest('REGISTER', registerUser);
}

export default registrationSaga;
