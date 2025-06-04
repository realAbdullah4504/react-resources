import React from "react";
import "./App.css";
import ContextComponent from "./components";
import { NotesProvider } from "./context/useNotes";

function App() {
  return (
    <div className="">
      <NotesProvider>
        <ContextComponent/>
      </NotesProvider>
    </div>
  );
}

export default App;
