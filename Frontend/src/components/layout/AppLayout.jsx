import React from 'react';
import Navbar from './Navbar'; // La barre de navigation de l'application
import Sidebar from './Sidebar';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#F5F7FA] dark:bg-[#1A1B2D]">
            <Sidebar />
            <div className="flex-1 flex flex-col" style={{ marginLeft: '230px' }}>
                <Navbar />
                <main className="flex-grow p-6">{children}</main>
            </div>
        </div>
    );
}
