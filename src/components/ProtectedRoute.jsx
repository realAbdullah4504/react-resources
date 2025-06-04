import React, { useEffect, useState } from "react";

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/login", {
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "admin",
            password: "password",
          }),
          method: "POST",
        });
        const data = await response.json();
        console.log(data);
        localStorage.setItem("token", data.token);
        setIsAuthenticated(!!data.token);
        setToken(data.token);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    getUser();
  }, []);
  return isAuthenticated ? (
    <div>{children(token)}</div>
  ) : (
    <div>{"not authenticated"}</div>
  );
};

export default ProtectedRoute;
