import React from "react";
import "./App.css";
import MongodbState from "./components";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <div className="">
      <ProtectedRoute>
      {(token) => <MongodbState token={token} />}
      </ProtectedRoute>
    </div>
  );
}

export default App;
