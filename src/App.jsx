import React from 'react';
import './App.css'
import ContextComponent from './components/ContextComponent'
import StateExample from './components/StateExample'
import { NotesProvider } from './context/useNotes'
import ReactElements from './components/reactElements';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/Home";
import About from "./pages/About"
import ProtectedPage from "./pages/ProtectedPage";
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layouts/DashboardLayout';
import Signin from './pages/Signin';

function App() {


  return (
    <div className=''>
      {/* <ReactElements /> */}
      {/* <div className="bg-avocado-400 font-sans container px-4 mx-auto">
        This uses your custom theme!
      </div> */}
      {/* <StateExample /> */}
      {/* <NotesProvider>
        <ContextComponent/>
      </NotesProvider> */}
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/protected-page" element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />} >
            <Route index element={<ProtectedPage />} />
            <Route path="settings" element={<div>Settings Page</div>} />
          </Route>
        </Route>
      </Routes> */}
    </div>
  )
}

export default App
