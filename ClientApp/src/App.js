import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AppRoutes from './AppRoutes';

const App = () => {
    // Logged in user state
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Initialize from localStorage on page load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setLoggedInUser({ username });
        }
    }, []);

    return (
        <Layout loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser}>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;

                    // pass loggedInUser and setLoggedInUser to all routes
                    const elementWithProps = React.cloneElement(element, { loggedInUser, setLoggedInUser });

                    return <Route key={index} {...rest} element={elementWithProps} />;
                })}
            </Routes>
        </Layout>
    );
};

export default App;