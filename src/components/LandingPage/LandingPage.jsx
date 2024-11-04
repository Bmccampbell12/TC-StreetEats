import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../App/Auth/RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Welcome');
  const history = useHistory();

  const onLogin = () => {
    history.push('/login');
  };
const goToRegister = (role) => {
  history.push(`/register/${role}`)
};

  return (
    <div className="container">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">
          <p>
            Welcome to Twin Cities StreetEats! Register as a User to explore foodtrucks or as a Vendor to manage your food truck profile.
          </p>
          </div>
          <div className='grid-col grid-col_4'>
            <center>
              <button className="btn" onClick={() => goToRegister('user')}>
                Register as User
              </button>
              <button className="btn" onClick={() => goToRegister('vendor')}>
                Register as Vendor
              </button>
              <h4>Already a Member?</h4>
              <button className='btn btn_sizSm' onClick={onLogin}>
                Login
              </button>
            </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
