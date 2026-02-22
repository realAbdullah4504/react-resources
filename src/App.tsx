import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from './lib/supabase'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// Example function to fetch data from Supabase
const fetchExampleData = async () => {
  const { data, error } = await supabase
    .from('your_table_name')
    .select('*')
  
  if (error) throw error
  return data
}

function App() {
  const [count, setCount] = useState(0)
  
  // Example React Query hook
  const { data: exampleData, isLoading, error } = useQuery({
    queryKey: ['exampleData'],
    queryFn: fetchExampleData,
    // enabled: false // Uncomment to disable this query until you have a real table
  })

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React + React Query + Supabase</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <div className="card">
        <h2>React Query + Supabase Example</h2>
        {isLoading && <p>Loading data...</p>}
        {error && <p>Error: {error.message}</p>}
        {exampleData && <pre>{JSON.stringify(exampleData, null, 2)}</pre>}
        <p style={{ fontSize: '0.8em', color: '#666' }}>
          Update the fetchExampleData function in App.tsx to use your actual Supabase table
        </p>
      </div>
      
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
