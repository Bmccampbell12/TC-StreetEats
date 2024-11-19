import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LoginForm() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    
    const dispatch = useDispatch();
    const errors = useSelector(state => state.errors);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (role) => (event) => {
        event.preventDefault();
        dispatch({
            type: 'LOGIN',
            payload: {
                ...credentials,
                role
            }
        });
    };

    return (
        <form className="login-form" onSubmit={handleSubmit('user')}>
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
                    value={credentials.username}
                    onChange={handleInputChange}
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    name="password"
                    required
                    value={credentials.password}
                    onChange={handleInputChange}
                />
            </div>

            <input 
                className="btn" 
                type="submit" 
                value="User Log In" 
            />
            
            <h3>Or</h3>
            
            <button 
                className="btn" 
                onClick={handleSubmit('vendor')}
                type="button"
            >
                Log In as Vendor
            </button>
        </form>
    );
}

export default LoginForm;
