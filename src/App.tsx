import CompoundComponents from "./components/CompoundComponents";
import { Counter } from "./components/Counter";
import { Example } from "./components/HookOrder";
import Stale from "./components/Stale";
import { useState } from "react";

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
