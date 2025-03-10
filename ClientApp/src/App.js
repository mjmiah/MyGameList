import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';  // import layout component
import AppRoutes from './AppRoutes';      // import routes configuration

const App = () => {
    return (
        <Layout>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
            </Routes>
        </Layout>
    );
};

export default App;