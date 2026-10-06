import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("comradehub_user");
    const storedToken = localStorage.getItem("comradehub_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to restore login:", error);

        localStorage.removeItem("comradehub_user");
        localStorage.removeItem("comradehub_token");
      }
    } else {
      // Clean up incomplete authentication state
      localStorage.removeItem("comradehub_user");
      localStorage.removeItem("comradehub_token");
    }

    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);

    localStorage.setItem(
      "comradehub_user",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "comradehub_token",
      authToken
    );
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("comradehub_user");
    localStorage.removeItem("comradehub_token");
  };

  const updateUser = (userData) => {
    setUser((currentUser) => {
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("comradehub_user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        updateUser,
        isLoggedIn: Boolean(user && token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return ctx;
};