import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Member from "./components/Member";
import Profile from "./components/Profile";
import Team from "./components/Team";
import DashboardLayout from "./components/DashboardLayout";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Home />} />
            <Route path="member" element={<Member />} />
            <Route path="profile" element={<Profile />} />
            <Route path="team" element={<Team />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
