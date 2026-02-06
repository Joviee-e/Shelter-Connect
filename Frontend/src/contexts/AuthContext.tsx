import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  email: string;
  ngo_name: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const storedPassword =
      localStorage.getItem('auth_password') || 'password123';

    if (email === 'demo@ngo.com' && password === storedPassword) {
      const dummyUser = {
        email,
        ngo_name: 'Demo NGO',
        phone: '000-000-0000',
      };

      localStorage.setItem('auth_user', JSON.stringify(dummyUser));
      setUser(dummyUser);
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  const changePassword = (newPassword: string) => {
    localStorage.setItem('auth_password', newPassword);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile: user,
        login,
        logout,
        changePassword,
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
