'use client';

import { createContext, useEffect, useReducer } from 'react'

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStoredAuth = () => {
    if (!canUseStorage()) {
        return { user: null, token: null };
    }

    const storedUser = window.localStorage.getItem("user");
    const storedToken = window.localStorage.getItem("horizon_token");

    let parsedUser = null;
    try {
        if (storedUser && storedUser !== "undefined") {
            parsedUser = JSON.parse(storedUser);
        }
    } catch (error) {
        parsedUser = null;
    }

    return { user: parsedUser, token: storedToken || null };
};

const storedAuth = readStoredAuth();

const initial_state = {
    user: storedAuth.user,
        token: storedAuth.token,
        loading: false,
        error: null,
    };
  
    export const AuthContext = createContext(initial_state);


const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                user: null,
                token: null,
                loading: true,
                error: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload,
                token: action.meta?.token || null,
                loading: false,
                error: null,
            }
        case 'LOGIN_FAILURE':
            return {
                user: null,
                token: null,
                loading: false,
                error: action.payload,
            }
        case 'REGISTER_SUCCESS':
            return {
                user: null,
                token: null,
                loading: false,
                error: null,
            }
        case 'UPDATE_USER':
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null,
            }
        case 'LOGOUT':
            return {
                user: null,
                token: null,
                loading: false,
                error: null,
            }

        default:
            return state
    }
};

export const AuthContextProvider = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, initial_state);

    useEffect(() => {
        if (!canUseStorage()) return;
        if (state.user) {
            window.localStorage.setItem('user', JSON.stringify(state.user));
        } else {
            window.localStorage.removeItem('user');
        }
    }, [state.user]);

    useEffect(() => {
        if (!canUseStorage()) return;
        if (state.token) {
            window.localStorage.setItem('horizon_token', state.token);
        } else {
            window.localStorage.removeItem('horizon_token');
        }
    }, [state.token]);

    return (
        <AuthContext.Provider 
          value={{
            user:state.user,
                        token:state.token,
            loading:state.loading,
            error:state.error,
            dispatch,
                        logout: () => dispatch({ type: 'LOGOUT' }),
          }}
          >
            {children}
          </AuthContext.Provider>
    );

};
