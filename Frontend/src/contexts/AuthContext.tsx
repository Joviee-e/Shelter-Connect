import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: string;
  email: string;
  ngo_name: string;
  phone?: string;
}

interface LoginResponse {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token
        localStorage.setItem('auth_token', data.access_token);

        // Store user data
        const userData = {
          id: data.ngo.id,
          email: data.ngo.email,
          ngo_name: data.ngo.ngo_name,
          phone: data.ngo.phone,
        };

        localStorage.setItem('auth_user', JSON.stringify(userData));
        setUser(userData);

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const changePassword = (newPassword: string) => {
    // This can be implemented later with backend API
    console.log('Password change not yet implemented');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        login,
        logout,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
