import React, { createContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

// Initial state
const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
};

// Create Context
export const AuthContext = createContext(initialState);

// Reducer Function
const authReducer = (state, action) => {
    switch(action.type) {
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: action.payload
            };
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true,
                loading: false
            };
        case 'AUTH_ERROR':
        case 'LOGIN_FAIL':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false,
                user: null,
                error: action.payload
            };
        default:
            return state;
    }
};

// Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Helper to set auth token for all axios requests
    const setAuthToken = token => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
        }
    };

    // Load User - wrapped in useCallback to avoid dependency warnings
    const loadUser = useCallback(async () => {
        if (localStorage.token) {
            setAuthToken(localStorage.token);
        }
        try {
            const res = await axios.get('http://localhost:5000/api/auth');
            dispatch({ type: 'USER_LOADED', payload: res.data });
        } catch (err) {
            dispatch({ type: 'AUTH_ERROR' });
        }
    }, []);  // Empty dependency array since dispatch is stable

    // Login User
    const login = async (formData) => {
        console.log('Context login function called with:', formData);
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', formData);
            console.log('API Response:', res.data);
            dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
            loadUser();
        } catch (err) {
            console.error('API Error:', err.response);
            dispatch({ type: 'LOGIN_FAIL', payload: err.response?.data?.msg || 'Login Failed' });
        }
    };
    
    // Load user on initial render
    useEffect(() => {
        loadUser();
    }, [loadUser]);  // Include loadUser in the dependency array

    return (
        <AuthContext.Provider value={{
            token: state.token,
            isAuthenticated: state.isAuthenticated,
            loading: state.loading,
            user: state.user,
            error: state.error,
            login
        }}>
            {children}
        </AuthContext.Provider>
    );
};
