import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await authAPI.getMe();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    const { data } = await authAPI.login(credentials);
    setUser(data);
    return data;
  };

  const register = async (userData) => {
    const { data } = await authAPI.register(userData);
    setUser(data);
    return data;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    const { data } = await authAPI.updateProfile(profileData);
    setUser(data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin: user?.role === 'admin',
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
