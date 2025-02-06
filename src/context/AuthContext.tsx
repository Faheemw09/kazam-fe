import axios from "axios";
import { createContext, useContext, useState } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>(null!);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      "https://kazam-backend-8uil.onrender.com/api/auth/login",
      {
        email,
        password,
      }
    );
    const userData: User = {
      name: response.data.name,
      email: response.data.email,
    };

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(response.data.token);
    setUser(userData);
  };
  const signup = async (name: string, email: string, password: string) => {
    await axios.post(
      "https://kazam-backend-8uil.onrender.com/api/auth/register",
      {
        name,
        email,
        password,
      }
    );
    await login(email, password);
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);

    delete axios.defaults.headers.common["Authorization"];
  };
  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  return useContext(AuthContext);
}
