import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [truckInfo, setTruckInfo] = useState({
    name: '',
    cuisine: '',
    description: ''
  });
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    const payload = {
      username,
      password,
      role,
      ...(role === 'vendor' && { truckInfo })
    };
    //event.preventDefault();
    // Dispatch register action with role from URL param
    //  if (username.trim() && password.length >= 6) {
    dispatch({ 
      type: 'REGISTER', 
      payload
     });

    };
    
  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register { role ==='vendor' ? 'Vendor' : 'user'}</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
          </h3>
          )}

      <div>
        <label htmlFor="role"> 
          Register as:
          <select 
            name="role"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            >
              <option value="user">User</option> 
        <option value="vendor">Vendor</option> 
        </select>
        </label>
        </div>

      <div>
        <label htmlFor="username"> 
          Username:
          <input
            type="text"
            name="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
          </label>
        </div>

      <div>
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          </label>
        </div>

{role === 'vendor' && ( 
  <div className="vendor-fields">
  <div>
    <label htmlFor="truckName">
      Food Truck Name:
      <input 
      type="text"
      name="truckName"
      value={truckInfo.name}
      required
      onChange={(event) => setTruckInfo({...truckInfo, name: event.target.value})}
    />
  </label>
</div>
      
      <div>
      <label htmlFor="cuisine">
        Cuisine Type:
      <input 
        type="text" 
        name="cuisine" 
        value={truckInfo.cuisine}
        required
        onChange={(event) => setTruckInfo({...truckInfo, cuisine: event.target.value})} 
        /> 
        </label>
      </div>

      <div>
        <label htmlFor="description">
          Description:
          <textarea
          name="description"
          value={truckInfo.description}
          onChange={(event) => setTruckInfo({...truckInfo, description: event.target.value})}
          />
        </label>
      </div>
      </div>
  )}

  <div>
    <input
    className="btn"
    type="submit"
    name="submit"
    value={role === 'vendor' ? 'Register Truck' : 'Register'}
    />
  </div>
  </form>
  )
}

export default RegisterForm;
