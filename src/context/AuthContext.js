import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // 초기값을 null로 설정하여 로딩 상태를 나타냄
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
      {isLoggedIn !== null ? children : <div>Loading...</div>} {/* 로그인 상태 확인 중일 때 Loading 표시 */}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
