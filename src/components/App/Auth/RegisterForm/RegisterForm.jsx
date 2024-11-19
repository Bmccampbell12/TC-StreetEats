import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function RegisterForm() {
  const dispatch = useDispatch();
  const { registrationMessage } = useSelector((store) => store.errors);

  const [formData, setFormData] = useState({
      username: '',
      password: '',
      role: 'user',
      truckInfo: {
          name: '',
          cuisine: '',
          description: ''
      }
  });

  const handleInputChange = (e) => {
      const { name, value } = e.target;
      
      if (name.startsWith('truck')) {
          const truckField = name.replace('truck','').toLowerCase();
          setFormData(prev => ({
              ...prev,
              truckInfo: {
                  ...prev.truckInfo,
                  [truckField]: value
              }
          }));
      } else {
          setFormData(prev => ({
              ...prev,
              [name]: value
          }));
      }
  };

  const registerUser = (event) => {
      event.preventDefault();
      
      const payload = {
          username: formData.username,
          password: formData.password,
          role: formData.role
      };

      if (formData.role === 'vendor') {
          payload.truckInfo = formData.truckInfo;
      }

      dispatch({
          type: 'REGISTER',
          payload
      });
  };

  return (
      <form className="formPanel" onSubmit={registerUser}>
          <h2>Register {formData.role === 'vendor' ? 'Vendor' : 'User'}</h2>
          
          {registrationMessage && (
              <h3 className="alert" role="alert">
                  {registrationMessage}
              </h3>
          )}

          <div>
              <label htmlFor="role">
                  Register as:
                  <select 
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
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
                      value={formData.username}
                      required
                      onChange={handleInputChange}
                  />
              </label>
          </div>

          <div>
              <label htmlFor="password">
                  Password:
                  <input
                      type="password"
                      name="password"
                      value={formData.password}
                      required
                      minLength="8"
                      onChange={handleInputChange}
                  />
              </label>
          </div>

          {formData.role === 'vendor' && (
              <div className="vendor-fields">
                  <div>
                      <label htmlFor="truckname">
                          Food Truck Name:
                          <input
                              type="text"
                              name="truckname"
                              value={formData.truckInfo.name}
                              required
                              onChange={handleInputChange}
                          />
                      </label>
                  </div>

                  <div>
                      <label htmlFor="truckcuisine">
                          Cuisine Type:
                          <input
                              type="text"
                              name="truckcuisine"
                              value={formData.truckInfo.cuisine}
                              required
                              onChange={handleInputChange}
                          />
                      </label>
                  </div>

                  <div>
                      <label htmlFor="truckdescription">
                          Description:
                          <textarea
                              name="truckdescription"
                              value={formData.truckInfo.description}
                              onChange={handleInputChange}
                          />
                      </label>
                  </div>
              </div>
          )}

          <div>
              <input
                  className="btn"
                  type="submit"
                  name="register"
                  value={formData.role === 'vendor' ? 'Register Truck' : 'Register'}
              />
          </div>
      </form>
  );
}

export default RegisterForm;
