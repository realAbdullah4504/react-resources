import React, { useState } from "react";

const StaleClosure = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>StaleClosure</div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Count: {count}</p>
    </>
  );
};

export default StaleClosure;
