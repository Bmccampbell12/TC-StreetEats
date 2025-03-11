import React, { useEffect } from 'react';
import { HashRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Nav from './Layout/Nav/Nav.jsx';
import Footer from '../App/Layout/Footer/Footer.jsx';

import LoginPage from '../App/Auth/LoginPage/LoginPage.jsx';
import RegisterPage from './Auth/RegisterPage/RegisterPage.jsx';
import RegisterForm from './Auth/RegisterForm/RegisterForm.jsx'

import AboutPage from '../AboutPage/AboutPage';
import UserPage from '../UserPage/UserPage';
import LandingPage from '../LandingPage/LandingPage';
import TruckSearch from './Trucks/TruckSearch';
import TruckDetail from './Trucks/TruckDetail';
import ReviewPage from '../App/Reviews/ReviewPage.jsx';
import TruckMap from './Trucks/TruckMap' 
import ReviewConfirmationPage from './Reviews/ReviewConfirmationPage';
import './App.css';


function App() {
  const dispatch = useDispatch();
  const user = useSelector(store => store.user);
 

  useEffect(() => {
      dispatch({ type: 'FETCH_USER' });
  }, []);
 

  return (
    <Router>
      <div>
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:5173/about will show the about page. */}
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/Profile"
          >
            <AboutPage />
          </Route>
          <Route exact path="/map">
                        <TruckMap />
                    </Route>
                    <Route
                      exact path="/register">
                        <RegisterForm />
                    </Route>

                    <Route exact path="/Trucks">
                        <TruckSearch />
                    </Route>
                    <Route exact  path="/review">
                      <ReviewPage />
                    </Route>
                    <Route exact path="/review-confirmation">
                      <ReviewConfirmationPage />
                      </Route>

                    <Route exact path="/trucks/:id">
                        <TruckDetail />
                    </Route>

                    <Route exact path="/trucks/:id/review">
                        <ReviewPage />
                    </Route>

                    <Route exact path="/user">
                        <UserPage />
                    </Route>

                    <Route exact path="/login">
                        {user.id ? <Redirect to="/user" /> : <LoginPage />}
                    </Route>

                    <Route exact path="/registration">
                        {user.id ? <Redirect to="/user" /> : <RegisterPage />}
                    </Route>

                    <Route exact path="/home">
                        {user.id ? <Redirect to="/user" /> : <LandingPage />}
                    </Route>
          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1>404</h1>
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
