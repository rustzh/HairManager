import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      axios
        .get('/api/users/auth', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error('Error fetching user info:', error.response);
          setIsLoggedIn(false);
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []); 

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, setIsLoggedIn, setUsername }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };