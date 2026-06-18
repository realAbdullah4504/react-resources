import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div>
      <div className="bg-[url('src/assets/background-hero.png')] bg-cover h-screen px-25">
      <div className="max-w-360 mx-auto text-white h-full">
        <Navbar />
        <Hero />
      </div>
      </div>
    </div>
  );
}