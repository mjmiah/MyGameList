import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: 'transparent' }}>
            <div className="container-fluid d-flex justify-content-center align-items-center">
                {/* Navbar Brand */}


                {/* Navbar Toggler for Mobile */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Navbar Links */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto d-flex justify-content-center">
                        <Link className="navbar-brand me-5" to="/" style={{ color: '#007bff', fontWeight: 'bold' }}>
                            MyGameList
                        </Link>
                        {/* Login Button */}
                        <li className="nav-item">
                            <Link
                                className="btn btn-primary rounded-pill mx-2"
                                to="/login"
                                style={{ backgroundColor: '#007bff', color: 'white' }}
                            >
                                Login
                            </Link>
                        </li>

                        {/* Register Button */}
                        <li className="nav-item">
                            <Link
                                className="btn btn-primary rounded-pill mx-2"
                                to="/register"
                                style={{ backgroundColor: '#007bff', color: 'white' }}
                            >
                                Register
                            </Link>
                        </li>

                        {/* Profile Button */}
                        <li className="nav-item">
                            <Link
                                className="btn btn-primary rounded-pill mx-2"
                                to="/profile"
                                style={{ backgroundColor: '#007bff', color: 'white' }}
                            >
                                Profile
                            </Link>
                        </li>

                        {/* Search Button */}
                        <li className="nav-item">
                            <Link
                                className="btn btn-primary rounded-pill mx-2"
                                to="/search"
                                style={{ backgroundColor: '#007bff', color: 'white' }}
                            >
                                Search
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;