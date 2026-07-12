import React, { useCallback, useEffect, useRef, useState } from "react";

const StaleClosure = () => {
  const [count, setCount] = useState(0);
  const [clickHandler, setClickHandler] = useState<() => void>(() => {});
  // const handlerRef = useRef(() => {});

  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  // useEffect(() => {
  //   handlerRef.current = handleClick;
  // }, [handleClick]);

  useEffect(() => {
    console.log("StaleClosure mounted");
    setClickHandler(() => () => handleClick());
  }, [handleClick]);

  return (
    <>
      <div>StaleClosure</div>
      <button onClick={handleClick}>Increment</button>
      <button onClick={clickHandler}>Increment via handler</button>
      <p>Count: {count}</p>
    </>
  );
};

export default StaleClosure;
