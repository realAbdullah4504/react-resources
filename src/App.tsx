import CompoundComponents from "./components/CompoundComponents";
import { Counter } from "./components/Counter";

const post = {
  name: "Abdullah",
  title: "Welcome",
  description: "hello Dear",
};

function App() {
  return (
    <>
      <Counter />
      <CompoundComponents post={post}>
        <CompoundComponents.Title />
        <CompoundComponents.Description />
        <CompoundComponents.Author />
      </CompoundComponents>
    </>
  );
}

export default App;
