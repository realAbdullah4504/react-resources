import React, { useEffect } from 'react'

const ProtectedPage = () => {
  const [response, setResponse] = React.useState(null);
  useEffect(() => {
    // Simulate a side effect, like fetching data or logging
    console.log('ProtectedPage component mounted');

    (async () => {
      try {
        const response = await fetch('http://localhost:3000');
        const data = await response.json();
        setResponse(data);
        console.log('Fetched data:', data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();

    // Cleanup function if needed
    return () => {
      console.log('ProtectedPage component unmounted');
    };
  }, []);
  return (
    <div>
      {JSON.stringify(response, null, 2) || 'Loading...'}
    </div>
  )
}

export default ProtectedPage
