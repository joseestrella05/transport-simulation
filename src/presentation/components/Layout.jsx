import React from 'react';

const Layout = ({ children }) => {
    return (
        <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
            <header style={{ marginBottom: '2rem' }}>
                <h1>Transport Simulation</h1>
            </header>
            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;
