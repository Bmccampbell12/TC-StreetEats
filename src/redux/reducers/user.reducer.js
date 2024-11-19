const initialState = {
    id: null,
    username: null,
    role: null,
    isAuthenticated: false,
    preferences: null, // Add preferences field to initialState
    error: null // Initialize error field
  }
  
  const userReducer = (state = initialState, action) => {
    
    switch (action.type) {
        case 'SET_USER':
            // Ensure payload has necessary fields (id, username, etc.)
            if (!action.payload || !action.payload.id || !action.payload.username) {
                return state; // Or handle this case (e.g., dispatch an error)
            }
            return {
                 ...state,
                 ...action.payload,
                 isAuthenticated: true
            };
  
        case 'FETCH_USER_FAILED':
            return {
                ...state,
                isAuthenticated: false,
                error: action.payload
            };
  
        case 'UPDATE_USER_PREFERENCES':
            return {
                ...state,
                preferences: action.payload
            };
  
        case 'UNSET_USER':
            return {
                ...initialState, // Reset to initial state
                isAuthenticated: false // Explicitly set to false
            };
  
        case 'SET_USER_ROLE':
            return {
                ...state,
                role: action.payload
            };
  
        default:
            return state;
    }
  };
  
  export default userReducer;
  