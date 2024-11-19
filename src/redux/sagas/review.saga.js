import { put, takeLatest, call, select } from 'redux-saga/effects';
import axios from 'axios';

function* addReview(action) {
    try {
        // Check user authentication
        const user = yield select(state => state.user);
        if (!user.id) {
            yield put({ 
                type: 'ADD_REVIEW_FAILURE', 
                payload: 'Please log in to submit a review' 
            });
            return;
        }

        // Add user ID to review payload
        const reviewPayload = {
            ...action.payload,
            user_id: user.id
        };

        // Add authorization header
        const config = {
            headers: { 'Authorization': `Bearer ${user.token}` }
        };

        const response = yield call(axios.post, '/api/review', reviewPayload, config);
        
        yield put({ type: 'ADD_REVIEW_SUCCESS', payload: response.data });
        yield put({ type: 'FETCH_ALL_REVIEWS' });
    } catch (error) {
        console.error('Error adding review:', error.response ? error.response.data : error.message);
        
        yield put({ 
            type: 'ADD_REVIEW_FAILURE', 
            payload: error.response?.data?.message || 'Failed to submit review' 
        });
    }
}

function* reviewSaga() {
    yield takeLatest('ADD_REVIEW', addReview);
}

export default reviewSaga;