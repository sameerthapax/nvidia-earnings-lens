import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import App from './App';
import Home from './pages/Home';
import QuarterDetails from './pages/QuarterDetails';
import About from './pages/About';

const AppRouter = () => (
    <Router>
        <App>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/quarter/:id" element={<QuarterDetails />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </App>
    </Router>
);

export default AppRouter;