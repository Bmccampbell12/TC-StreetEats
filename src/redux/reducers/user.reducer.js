// userReducer: Handles the state of the user
const initialState = {
    id: null,
    username: null,
    role: null,
    isAuthenticated: false,
    preferences: null,
    error: null
  };
  
  // userReducer function: Updates the user state based on the action type
  const userReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER':
        // Check if the payload has the necessary fields
        if (!action.payload || !action.payload.id || !action.payload.username) {
          return state;
        }
  
        // Update the user state
        return {
          ...state,
          ...action.payload,
          isAuthenticated: true
        };
  
      case 'FETCH_USER_FAILED':
        // Update the user state with an error
        return {
          ...state,
          isAuthenticated: false,
          error: action.payload
        };
  
      case 'UPDATE_USER_PREFERENCES':
        // Update the user preferences
        return {
          ...state,
          preferences: action.payload
        };
  
      case 'UNSET_USER':
        // Reset the user state
        return initialState;
  
      case 'SET_USER_ROLE':
        // Update the user role
        return {
          ...state,
          role: action.payload
        };
  
      default:
        return state;
    }
  };
  
  export default userReducer;