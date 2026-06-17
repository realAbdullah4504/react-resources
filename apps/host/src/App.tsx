import React from "react";
import { login, getUser, logout } from "./auth";
const Products = React.lazy(() => import("products/Products"));

export default function App() {
  const user = getUser();

  return (
    <div>
      <h1>Host App</h1>

      {!user ? (
        <button
          onClick={() =>
            login({
              id: "1",
              name: "Abdullah",
              token: "abc123",
            })
          }
        >
          Login
        </button>
      ) : (
        <>
          <p>Welcome {user.name}</p>
          <button onClick={logout}>Logout</button>
          <Products/>
        </>
      )}
    </div>
  );
}