import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { User, UserRole, AuthContextType } from "@/types";
import api from "@/services/api";

// -------- Create Context --------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// -------- Props Interface --------
interface AuthProviderProps {
  children: ReactNode;
}

// -------- Provider Component --------
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("athlete_tracker_user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        localStorage.removeItem("athlete_tracker_user");
      }
    }

    setLoading(false);
  }, []);

  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      if (user.role.name !== role) {
        alert(`Your role is ${user.role.name}, select the correct role.`);
        return;
      }

      const loggedUser: User = {
        _id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name,
        token: token,
      };

      setUser(loggedUser);

      localStorage.setItem("athlete_tracker_user", JSON.stringify(loggedUser));

      return true;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("athlete_tracker_user");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isCoach: user?.role === "coach",
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// -------- Custom Hook --------
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
