import React from 'react';
import './App.css'
import ContextComponent from './components/ContextComponent'
import StateExample from './components/StateExample'
import { NotesProvider } from './context/useNotes'
import ReactElements from './components/reactElements';

function App() {

 
  return (
    <div className='container'>
      <ReactElements/>
      {/* <StateExample /> */}
      {/* <NotesProvider>
        <ContextComponent/>
      </NotesProvider> */}
    </div>
  )
}

export default App
