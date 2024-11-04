import { put, takeLatest} from 'redux-saga/effects';
import axios from 'axios'

function* fetchTrucks() {
    try {
        const response = yield call(axios.get, '/api/trucks', {
            params: action.payload // search params
        });
        yield put ({ type: 'FETCH_TRUCKS_SUCCESS', payload: response.data })
    } catch (error) {
        yield put({ 
            type: 'FETCH_TRUCKS_FAILED',
        payload: error.response?.data?.message || 'Error fetching trucks'
     });

    }
}

function* fetchTruckById(action) {
try {
  const response = yield call(axios.get, `/api/trucks/${action.payload}`);
  yield put({ type: 'SET_SELECTED_TRUCK', payload: response.data });
} catch (error) {
  yield put({ 
    type: 'FETCH_TRUCKS_FAILURE',
     payload: error.response?.data?.message || 'Error creating truck'
    });

  }  

}

function* updateTruck(action) {
try {
  const response = yield call(axios.put, '/api/trucks/${action.payload.id}',
    action.payload
  );
  yield put({ type: 'UPDATE_TRUCK_SUCCESS', payload: response.data  }); // Refresh trucks after update
} catch (error) {
  yield put({ 
    type: 'FETCH_TRUCKS_FAILED',
    payload: error.response?.data?.message || 'Error updating truck' });
    }
 }

function* deleteTruck(action) {
try {
  yield call(axios.delete, `/api/trucks/${action.payload}`);
  yield put({ type: 'FETCH_TRUCKS_REQUEST' }); // refreshes truck list
} catch (error) {
        yield put({
            type: 'FETCH_TRUCKS_FAILURE',
            payload: error.response?.data?.message || 'Error deleting truck' });
        }
     }


function* truckSaga() {
yield takeLatest('FETCH_TRUCKS', fetchTrucks);
yield takeLatest('FETCH_TRUCKS_BY_ID', fetchTruckById);
yield takeLatest('UPDATE_TRUCK', updateTruck);
yield takeLatest('DELETE_TRUCK', deleteTruck);
}

export default truckSaga;