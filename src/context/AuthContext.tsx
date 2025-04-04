import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  phone: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (phone: string) => void;
  logout: () => void;
  currentUser: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check local storage on initial load
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const userPhone = localStorage.getItem("userPhone");

    if (auth === "true" && userPhone) {
      setIsAuthenticated(true);
      setCurrentUser({
        id: "user-1", // Using a default ID
        name: "User", // Using a default name
        phone: userPhone,
      });
    }
  }, []);

  const login = (phone: string) => {
    // In a real app, you'd verify the OTP server-side
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userPhone", phone);
    setIsAuthenticated(true);
    setCurrentUser({
      id: "user-1", // Using a default ID
      name: "User", // Using a default name
      phone: phone,
    });
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userPhone");
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, login, logout, currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
