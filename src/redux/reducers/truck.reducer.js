//truck.reducer.js
const initialState = {
      allTrucks: [],
      selectedTruck: null,
      error: null
};

const truckReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_TRUCKS':
            return {...state, 
                allTrucks: action.payload,
                error: null,
            };
            case 'FETCH_TRUCKS_FAILURE':
                return {
                    ...state,
                    error: action.payload,
                    loading: false
                };
                case 'SET_SELECTED_TRUCK':
                    return {
                        ...state,
                        selectedTruck: action.payload,
                        error: null
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
                            case 'SET_MAP_CENTER':
                                return {
                                    ...state,
                                    mapCenter: action.payload
                                };
                    
                            case 'TOGGLE_FAVORITE_SUCCESS':
                                return {
                                    ...state,
                                    allTrucks: state.allTrucks.map(truck =>
                                        truck.id === action.payload
                                            ? { ...truck, isFavorite: !truck.isFavorite }
                                            : truck
                                    )
                                    
                                };

                                default:
                                    return state;
                            }
                        };

                        export default truckReducer;