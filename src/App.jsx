import './App.css'
import ContextComponent from './components/ContextComponent'
import StateExample from './components/StateExample'
import { NotesProvider } from './context/useNotes'

function App() {

  return (
    <div className='container'>
      <StateExample />
      {/* <NotesProvider>
        <ContextComponent/>
      </NotesProvider> */}
    </div>
  )
}

export default App
