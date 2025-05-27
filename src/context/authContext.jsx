import { createContext, useContext, useEffect, useState } from "react";

const authContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }
        const response = await fetch("http://localhost:3000/api/protected", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 401) {
          const refreshRes = await fetch("http://localhost:3000/api/refresh-token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken: localStorage.getItem("refreshToken") })
          })
          if (!refreshRes.ok) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            setUser(null);
            return;
          }
          const refreshData = await refreshRes.json();
          localStorage.setItem("token", refreshData.token);
          const retryResponse = await fetch("http://localhost:3000/api/protected", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${refreshData.token}`,
            },
          });
          if (!retryResponse.ok) {
            setUser(null);
            return;
          }
          const retryData = await retryResponse.json();
          setUser(retryData.user);
          return;
        }
        const data = await response.json();
        setUser(data.user);
      } catch (error) {
        console.error("Error checking authentication:", error);
        if (!localStorage.getItem("token")) {
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error("Login failed");
    const data = await response.json();
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    setUser(data.user);
  };

  const signup = async (username, email, password) => {
    const response = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error("Signup failed");
    const data = await response.json();
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <authContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
