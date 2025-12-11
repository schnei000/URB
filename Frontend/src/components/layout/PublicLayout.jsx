import React from 'react';
import Header from './Header';

const PublicLayout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            {/* Footer peut être ajouté ici plus tard */}
        </div>
    );
};

export default PublicLayout;