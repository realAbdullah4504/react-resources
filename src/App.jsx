import React from "react";
import "./App.css";
import ContextComponent from "./components/ContextComponent";
import StateExample from "./components/StateExample";
import { NotesProvider } from "./context/useNotes";
import ReactElements from "./components/reactElements";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import ProtectedPage from "./pages/ProtectedPage";
import ProtectedRoute from "./components2/ProtectedRoute";
import DashboardLayout from "./components/layouts/DashboardLayout";
import Signin from "./pages/Signin";
import MongodbState from "./components3/MongodbState";
import Signup from "./pages/Signup";
import VerifyEmail from "./components3/MongodbState/VerifyEmail";

function App() {
  return (
    <div className="">
      {/* *********************************react Elements section **************************} */}
      {/* <ReactElements /> */}
      {/* <div className="bg-avocado-400 font-sans container px-4 mx-auto">
        This uses your custom theme!
      </div> */}
      {/* *********************************useState section **************************} */}
      {/* <StateExample /> */}
      {/* *********************************context api section **************************} */}
      {/* <NotesProvider>
        <ContextComponent/>
      </NotesProvider> */}
      {/* *********************************route section **************************} */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/protected-page" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<ProtectedPage />} />
            <Route path="settings" element={<MongodbState />} />
          </Route>
        </Route>
      </Routes>
      {/* *********************************mongodb custom backend state update section **************************} */}
    </div>
  );
}

export default App;
