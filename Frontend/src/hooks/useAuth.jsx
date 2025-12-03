import {useContext} from 'react';
import {AuthContext} from '../context/AuthContext';

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("doit être utilisé dans un AuthProvider");
    }
    return context;
    }

export {useAuth};