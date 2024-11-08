import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {useSelector} from 'react-redux';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();

    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; // end login

  return (
    
    <form className="formPanel" onSubmit={login}>
    <h3>Welcome to Twin Cities StreetEats!</h3>
    <h2>User Login</h2>

      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
        </h3>
        
      )}
      

      <div>
        <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
      </div>
        
        <input className="btn" type="submit" name="submit" value="User Log In" />
        <h3>Or</h3>
        <input className="btn" type="submit" name="submit" value="Log In as Vendor" />
    </form>
  );
}

export default LoginForm;
