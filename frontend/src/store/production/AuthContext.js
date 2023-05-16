import React, { useState, useEffect, useCallback } from "react";
import jwt from "jwt-decode";
import { toast } from "react-toastify";


let logoutTimer;

const AuthContext = React.createContext({
    token: "",
    isLoggedIn: false,
    user: null,
    role: "guest",
    login: (token) => {},
    logout: () => {},
});

const calculateRemainingTime = (expiresIn) => {
    const currentTime = new Date().getTime();
    const expireTime = new Date().getTime() + +expiresIn;

    const remainingTime = expireTime - currentTime;

    return remainingTime;
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem("token");
    const expiresIn = localStorage.getItem('expires');

    const remainingTime = calculateRemainingTime(expiresIn);

    if (remainingTime <= 0) {
        localStorage.removeItem("token");
        localStorage.removeItem("expires");
        return null;
    }

    return { token: storedToken, duration: remainingTime };
}

const retrieveUserFromToken = (token) => {
    const decoded = jwt(token);

    let user = {
        id: decoded.user_id,
    };

    return user;
}

const retrieveRoleFromToken = (token) => {
    const decoded = jwt(token);
    
    let role = decoded.groups;

    return role;
}

export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialToken;
    let initialUser = { id: -1 };
    let initialRole = "guest";

    if (tokenData !== null) {
        initialToken = tokenData.token;
        initialUser = retrieveUserFromToken(tokenData.token);
        initialRole = retrieveRoleFromToken(tokenData.token);
    }

    const [token, setToken] = useState(initialToken);
    const [user, setUser] = useState(initialUser);
    const [role, setRole] = useState(initialRole);
    const userIsLoggedIn = !!token;

    const logoutHandler = useCallback(() => {
        setToken(null);
        setUser({ id: 0 });
        setRole("guest");
        localStorage.removeItem("token");
        localStorage.removeItem("expires");

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }

        toast.success('Logged out!', {
            position: toast.POSITION.TOP_CENTER
        });
    }, []);

    const loginHandler = (token) => {
        setToken(token.access);
    
        localStorage.setItem("token", token.access);
    
        setUser(retrieveUserFromToken(token.access));
        setRole(retrieveRoleFromToken(token.access));

        const decoded = jwt(token.access);
    
        const remainingTime = calculateRemainingTime(decoded.exp);
        localStorage.setItem("expires", remainingTime);
        logoutTimer = setTimeout(logoutHandler, remainingTime);

      };
    
    useEffect(() => {
      if (tokenData) {
          logoutTimer = setTimeout(logoutHandler, tokenData.duration);
      }
    }, [tokenData, logoutHandler]);
    
    const contextValue = {
      token: token,
      isLoggedIn: userIsLoggedIn,
      user: user,
      role: role,
      login: loginHandler,
      logout: logoutHandler,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    );    
};

export default AuthContext;