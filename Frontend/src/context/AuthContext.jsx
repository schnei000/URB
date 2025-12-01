import React, { createContext, useState, useEffect, useReducer } from 'react';
import authReducer from './authReducer';
import { initialState } from './authReducer';

import * as authApi from '../api/authApi';
import * as tokenUtils from '../utils/token';

export const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
    const [state,dispatch] = useReducer(authReducer, initialState);

    useEffect( ()=> {
        const token = tokenUtils.getToken();
        const user = tokenUtils.getUser();
        if (token && user) {
            dispatch({
                type: "RESTORE_SESSION",
                payload: { user, token }
            });
        }
    }, []);

    // Action: register

    async function register(userData) {
        dispatch({ type: "AUTH_START" });
        try {
            const res = await authApi.register(userData);
            dispatch({
                type: "AUTH_SUCCESS",
                payload: { user: res.user, token: res.token }
            });
            tokenUtils.setToken(res.token);
            tokenUtils.setUser(res.user);
        } catch (error) {
            dispatch({
                type: "AUTH_FAILURE",
                error: error.message
            });
        }
    }
    // Action: login

    async function login ({email, password}) {
        dispatch({ type: "AUTH_START" });
        try {
            const res = await authApi.login({ email, password });
            dispatch({
                type: "AUTH_SUCCESS",
                payload: { user: res.user, token: res.token }
            });
            tokenUtils.setToken(res.token);
            tokenUtils.setUser(res.user);
        } catch (error) {
            dispatch({
                type: "AUTH_FAILURE",
                error: error.message
            });
        }
    }
    // Action: logout

    function logout() {
        dispatch({ type: "LOGOUT" });
        tokenUtils.removeToken();
        tokenUtils.removeUser();
    }
    // Action: refresh profile

    async function refreshProfile() {
        try {
            const res = await authApi.profile();
            dispatch({
                type: "AUTH_SUCCESS",
                payload: { user: res, token: state.token }
            });
            tokenUtils.setUser(res);
        } catch (error) {
            console.error("Failed to refresh profile:", error);
        }
    }
    
    return (
        <AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            error: state.error,
            loading: state.loading,
            register,
            login,
            logout,
            refreshProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
}