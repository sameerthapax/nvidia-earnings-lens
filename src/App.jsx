import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

const App = ({ children }) => {
    return (
        <>
            <Header />
            <main style={{ minHeight: '80vh', padding: '1.5rem' }}>
                {children}
            </main>
            <Footer />
        </>
    );
};

export default App;