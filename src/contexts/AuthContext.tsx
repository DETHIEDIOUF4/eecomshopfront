import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:4000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => setUser(response.data))
      .catch(() => {
        localStorage.removeItem('token');
        setUser(null);
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', { 
        email, 
        password 
      });
      console.log('Login response:', response.data);
      
      if (response.data.token != "") {
        console.log("cool");
        localStorage.setItem('token', response.data.data.token);
        console.log(response.data.data);
        setUser(response.data.data);
        console.log(user);
      } else {
        throw new Error('Réponse invalide du serveur');
      }
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur de connexion');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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