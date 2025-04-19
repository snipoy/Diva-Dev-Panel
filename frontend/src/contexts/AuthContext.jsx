import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // For development, we'll set isAuthenticated to true by default
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [token, setToken] = useState('mock-token');

  const login = async (username, password) => {
    // Mock login - always succeed
    setIsAuthenticated(true);
    setToken('mock-token');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 