import { useEffect, useRef, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);

  const sendEvent = () => {
    console.log("Current count:", countRef.current);
  };

  useEffect(() => {
    countRef.current = count;
  }, [count]);


  useEffect(() => {
    // This function is recreated every render
    const handler = () => {
      sendEvent();
    };

    window.addEventListener("click", handler);

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  return (
    <div>
      <h1>{count}</h1>

      <button onClick={() => setCount((c) => c + 1)}>Increment</button>

      <p>Click Increment a few times.</p>
      <p>Then click anywhere outside the button.</p>
      <p>Watch the console.</p>
    </div>
  );
}
