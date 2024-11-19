import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Nav.css';

function Nav() {
    const user = useSelector((store) => store.user);

    return (
        <div className="nav">
            <Link to="/home">
                <h2 className="nav-title">TC StreetEats</h2>
            </Link>
            <div>
                {!user.id && (
                    <Link className="navLink" to="/login">
                        Login / Register
                    </Link>
                )}

                <Link className="navLink" to="/review">
                    Truck Reviews
                </Link>

                <Link className="navLink" to="/trucks">
                    Find Trucks
                </Link>

                {user.id && (
                    <>
                        <Link className="navLink" to="/user">
                            My Profile
                        </Link>
                        <Link className="navLink" to="/favorites">
                            My Favorites
                        </Link>
                        {user.role === 'vendor' && (
                            <Link className="navLink" to="/vendor/dashboard">
                                Vendor Dashboard
                            </Link>
                        )}
                    </>
                )}

                <Link className="navLink" to="/profile">
                    User Profile
                </Link>
            </div>
        </div>
    );
}

export default Nav;