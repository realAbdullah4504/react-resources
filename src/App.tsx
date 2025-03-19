import './App.css'
import CompoundComponents from './components/CompoundComponents'

const post={
  name:"Abdullah",
  title:"Welcome",
  description:"hello Dear",
}

function App() {

  return (
    <>
      <CompoundComponents post={post}>
      <CompoundComponents.Title/>
      <CompoundComponents.Description/>
      <CompoundComponents.Author/>
     </CompoundComponents>
    </>
  )
}

export default App
