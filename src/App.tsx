import CompoundComponents from "./components/CompoundComponents";
import { Counter } from "./components/Counter";
import Stale from "./components/Stale";

const post = {
  name: "Abdullah",
  title: "Welcome",
  description: "hello Dear",
};

function App() {
  return (
    <>
      <Counter />
      <Stale />
      <CompoundComponents post={post}>
        <CompoundComponents.Title />
        <CompoundComponents.Description />
        <CompoundComponents.Author />
      </CompoundComponents>
    </>
  );
}

export default App;
