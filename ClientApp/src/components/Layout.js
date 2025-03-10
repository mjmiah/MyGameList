import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import '../custom.css';

const Layout = ({ children }) => {
    return (
        <div>
            {/* Navbar */}
            <Navbar />
               
            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
};

export default Layout;