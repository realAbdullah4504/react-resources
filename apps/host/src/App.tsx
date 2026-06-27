import React from "react";
import { login, getUser, logout } from "./auth";
const Products = React.lazy(() => import("products/Products"));

export default function App() {
  const user = getUser();

  return (
    <div>
      <h1>Host App</h1>
      <button
        onClick={() => {
          console.log("Button clicked");
        }}
        role="tab"
        aria-selected="true"
        aria-controls="journey-tab-panel"
        className="pad-1 pad-2-lr dls-accent-gray-01-bg margin-0 pad-4-r css-14wwgwv"
        type="button"
      >
        Initiate a Billing Inquiry
      </button>
      <p>Welcome {user?.name}</p>
      <button onClick={logout}>Logout</button>
      <Products />
    </div>
  );
}
