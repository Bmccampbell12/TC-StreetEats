import { put, takeLatest, call } from 'redux-saga/effects';
import axios from 'axios';

function* fetchTrucks(action) {
    try {
        const response = yield call(axios.get, '/api/trucks');
        yield put({ type: 'SET_TRUCKS', payload: response.data });
    } catch (error) {
        yield put({ 
            type: 'SET_TRUCK_ERROR',
            payload: error.message });
    }
}

function* fetchTruckById(action) {
    try {
        const response = yield call(axios.get, `/api/trucks/${action.payload}`);
        yield put({ type: 'SET_SELECTED_TRUCK', payload: response.data });
        yield put({ type: 'FETCH_TRUCK_REVIEWS', payload: action.payload });
    } catch (error) {
        yield put({ 
            type: 'FETCH_TRUCKS_FAILURE',
            payload: error.response?.data?.message || 'Error creating truck'
        });
    }
}

function* fetchTruckDetail(action) {
    try {
        const response = yield call(axios.get, `/api/trucks/${action.payload}`);
        yield put({ type: 'SET_SELECTED_TRUCK', payload: response.data });
    } catch (error) {
        yield put({ type: 'SET_TRUCK_ERROR', payload: error.message });
    }
}

function* searchTrucksByLocation(action) {
    try {
        const { latitude, longitude } = action.payload;
        const response = yield call(
            axios.get,
            `/api/trucks/search?lat=${latitude}&lng=${longitude}`
        );
        yield put({ type: 'SET_TRUCKS', payload: response.data });
    } catch (error) {
        yield put({ type: 'SET_TRUCK_ERROR', payload: error.message });
    }
}


            // params: {
            //     latitude: action.payload.latitude,
            //     longitude: action.payload.longitude,
            //     radius: action.payload.radius || 5000 // default 5km radius
            // }
    


function* truckSaga() {
    yield takeLatest('FETCH_TRUCKS', fetchTrucks);
    yield takeLatest('FETCH_TRUCK_BY_ID', fetchTruckById);
    yield takeLatest('SET_TRUCKS', searchTrucksByLocation);
    yield takeLatest('FETCH_TRUCK_DETAIL', fetchTruckDetail);
}

export default truckSaga;
