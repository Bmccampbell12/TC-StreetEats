//truck.reducer.js
const initialState = {
      allTrucks: [],
      selectedTruck: null,
      error: null
};

function truckReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_TRUCKS_REQUEST':
            return {...state, 
                allTrucks: action.payload,
            };
            case 'FETCH_TRUCKS_FAILURE':
                return {
                    ...state,
                    error: action.payload,
                };
                case 'SET_SELECTED_TRUCK':
                    return {
                        ...state,
                        selectedTruck: action.payload
                    };
                    case 'CLEAR_SELECTED_TRUCK':
                        return {
                            ...state,
                            selectedTruck: null
                        };
                        case 'UPDATE_TRUCK_SUCCESS':
                            return {
                                ...state,
                                allTrucks: state.allTrucks.map(truck =>
                                    truck.id === action.payload.id ? action.payload : truck
                                ),
                                selectedTruck: action.payload
                            };

                                default:
                                    return state;
                            }
                        };

                        export default truckReducer;