import Hero from "./components/Hero";
import Navbar from "./components/Navbar";

import Astro from "./assets/logo.jpg";

export default function App() {
  return (
    <div>
      <div className="bg-[url('src/assets/background-hero.png')] bg-cover  px-25">
      <div className="text-white min-h-screen max-w-[350px] min-w-[300px] md:max-w-360 mx-auto flex flex-col">
        {/* <Navbar /> */}
        <Hero />
      </div>
      </div>
    </div>
  );
}
