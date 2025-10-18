import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider } from '../services/firebase';
import { signInWithPopup, signOut } from 'firebase/auth';
import { googleLogin } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { uid, email, displayName, photoURL } = result.user;

      const response = await googleLogin({ uid, email, displayName, photoURL });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      toast.success('Login successful!');
      return response.data.user;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed!');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed!');
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
