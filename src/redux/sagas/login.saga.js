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
      
      // Detailed response handling
      if (response.data && response.data.user) {
        yield put({ 
          type: 'LOGIN_SUCCESS', 
          payload: response.data.user 
        });
        
        // Fetch additional user data
        yield put({ type: 'FETCH_USER' });
      } else {
        throw new Error('Invalid server response');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Login failed';
      
      yield put({ 
        type: 'LOGIN_FAILED', 
        payload: errorMessage 
      });
    }
  }