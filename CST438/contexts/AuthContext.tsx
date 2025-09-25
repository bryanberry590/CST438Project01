import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  username: string | null;
  isGuest: boolean;
  isLoggedIn: boolean;
  login: (username: string) => void;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  const login = (username: string) => {
    setUsername(username);
    setIsGuest(false);
  };

  const logout = () => {
    setUsername(null);
    setIsGuest(false);
  };

  const continueAsGuest = () => {
    setUsername(null);
    setIsGuest(true);
  };

  const isLoggedIn = username !== null && !isGuest;

  return (
    <AuthContext.Provider value={{
      username,
      isGuest,
      isLoggedIn,
      login,
      logout,
      continueAsGuest
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}