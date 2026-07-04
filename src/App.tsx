import { useState } from "react";
import { Memo } from "./components/Memo";
import Transition from "./components/Transition";

const post = {
  name: "Abdullah",
  title: "Welcome",
  description: "hello Dear",
};

function App() {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    let tempCount = count + 1;
    setCount(tempCount);
    tempCount++;
    setCount(tempCount);
  };
  return (
    <>
    <Memo />
    <Transition />
    {/* <SideEffects /> */}
    {/* <LayoutEffect /> */}
    {/* <Example/> */}
      {/* <Counter /> */}
      {/* <button onClick={handleClick}>Click</button> */}
      {/* <Stale /> */}
      {/* <CompoundComponents post={post}>
        <CompoundComponents.Title />
        <CompoundComponents.Description />
        <CompoundComponents.Author />
      </CompoundComponents> */}
    </>
  );
}

export default App;
