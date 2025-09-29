import React from 'react';
import Navbar from './Navbar';
import '../custom.css';

const Layout = ({ children, loggedInUser, setLoggedInUser }) => {
    return (
        <div>
            {/* Navbar */}
            <Navbar loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
};

export default Layout;