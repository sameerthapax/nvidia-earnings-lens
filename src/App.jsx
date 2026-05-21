import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';

const App = ({ children }) => {
    useEffect(() => {
        document.documentElement.classList.add('motion-ready');

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            },
            { threshold: 0.18, rootMargin: '0px 0px -8% 0px' }
        );

        const observeElements = () => {
            const elements = document.querySelectorAll('.reveal:not([data-reveal-observed])');
            elements.forEach((element) => {
                element.setAttribute('data-reveal-observed', 'true');
                observer.observe(element);
            });
        };

        observeElements();

        const mutationObserver = new MutationObserver(() => {
            observeElements();
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        return () => {
            mutationObserver.disconnect();
            observer.disconnect();
            document.documentElement.classList.remove('motion-ready');
        };
    }, []);

    return (
        <div className="app-shell">
            <div className="app-ambient" aria-hidden="true" />
            <Header />
            <main className="app-main">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default App;
