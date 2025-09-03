// src/context/UserContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initial value is `null`

  useEffect(() => {
    fetchUser();
  }, []);
 
  const fetchUser = async () => {
    try {
      const response = await api.get('/api/getuser');
      setUser(response.data.user);
    } catch (error) {
      console.error('No token given - from the context !', error);
    }
  };

  return (
    <UserContext.Provider value={{ user, fetchUser  }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for consuming context
export const useUser = () => useContext(UserContext);
