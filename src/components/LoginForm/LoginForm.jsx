import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LoginForm() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        role: 'user' // Default role
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

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!credentials.username || !credentials.password) {
            dispatch({
                type: 'LOGIN_FAILED',
                payload: 'Please enter both username and password'
            });
            return;
        }

        // Clear any existing errors
        dispatch({ type: 'CLEAR_LOGIN_ERROR' });
        
        // Send the login request
        dispatch({
            type: 'LOGIN',
            payload: {
                username: credentials.username.trim(),
                password: credentials.password,
                role: credentials.role
            }
        });
    };

    const switchRole = (role) => {
        setCredentials(prev => ({
            ...prev,
            role
        }));
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <h3>Welcome to Twin Cities StreetEats!</h3>
            <h2>{credentials.role === 'user' ? 'User' : 'Vendor'} Login</h2>

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
                    placeholder="Enter your username"
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
                    placeholder="Enter your password"
                />
            </div>

            <div className="button-group">
                <button 
                    className={`btn ${credentials.role === 'user' ? 'active' : ''}`}
                    type="submit"
                    onClick={() => switchRole('user')}
                >
                    Log In as User
                </button>
                
                <button 
                    className={`btn ${credentials.role === 'vendor' ? 'active' : ''}`}
                    type="submit"
                    onClick={() => switchRole('vendor')}
                >
                    Log In as Vendor
                </button>
            </div>

            <p className="login-help">
                {credentials.role === 'user' 
                    ? "Looking to manage your food truck? Switch to Vendor Login"
                    : "Want to order from food trucks? Switch to User Login"
                }
            </p>
        </form>
    );
}

export default LoginForm;
