import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MultiSelect from "./components/MultiSelect";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<DashboardLayout />}> */}
          <Route
            path="/"
            element={
              <>
                <MultiSelect />
                <Home />
              </>
            }
          />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
