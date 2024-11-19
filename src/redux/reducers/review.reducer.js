const initialState = {
    list: [],
    loading: false,
    error: null,
    submissionError: null
};

function reviewReducer(state = initialState, action) {
    switch (action.type) {
        case 'ADD_REVIEW':
            return { ...state, loading: true, submissionError: null };
        case 'ADD_REVIEW_SUCCESS':
            return { 
                ...state, 
                list: [...state.list, action.payload], 
                loading: false, 
                submissionError: null 
            };
        case 'ADD_REVIEW_FAILURE':
            return { 
                ...state, 
                loading: false, 
                submissionError: action.payload 
            };
        default:
            return state;
    }
}

export default reviewReducer;