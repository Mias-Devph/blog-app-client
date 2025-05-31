import { createContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(localStorage.getItem('token'));

  // 🔄 Set token in both state and localStorage
  const setToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
    } else {
      localStorage.removeItem('token');
    }
    setTokenState(newToken);
  };

  // 🔐 Decode token immediately (optional but improves responsiveness)
  const decodeAndSetUser = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      setUser(decoded);
    } catch (err) {
      console.error('Failed to decode token:', err);
      setUser(null);
    }
  };

  // 👤 Fetch user details from backend (fallback or trusted source)
  const fetchUserDetails = async (activeToken) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/details`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to fetch user details:', err);
      setUser(null);
    }
  };

  // 🔁 Run this whenever the token changes
  useEffect(() => {
    if (token) {
      decodeAndSetUser(token); // immediate feedback
      fetchUserDetails(token); // backend-verified data
    } else {
      setUser(null);
    }
  }, [token]);

  // 🚪 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, logout }}>
      {children}
    </UserContext.Provider>
  );
};
