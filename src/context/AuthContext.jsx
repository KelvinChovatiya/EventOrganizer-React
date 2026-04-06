import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

// Set the base URL for your backend
const API_URL = 'http://localhost:5000/api/auth';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // When the app loads, check if they already have a real token
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);


  // REAL LOGIN FUNCTION
  const login = async (email, password) => {
    try {
    // Your existing axios call...
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    
    // Your existing state updates...
    localStorage.setItem('token', response.data.token);
    setUser(response.data.user);
    
    // THE CRITICAL CHANGE: Return the actual user object, not just a boolean
    return { success: true, user: response.data.user }; 
    
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || 'Invalid credentials' 
    };
  }
  };

  
  // REAL REGISTER FUNCTION
  const register = async (name, email, password, role = 'user') => {
    try {
      const response = await axios.post(`${API_URL}/register`, { name, email, password, role });
      
      if (response.data.success) {
        return { success: true };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // REAL LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);