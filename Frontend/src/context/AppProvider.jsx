import React from 'react';
import { AuthProvider } from './AuthContext';
import { ProjectProvider } from './ProjectContext';

export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <ProjectProvider>
                {children}
            </ProjectProvider>
        </AuthProvider>
    );
};

export default AppProvider;
