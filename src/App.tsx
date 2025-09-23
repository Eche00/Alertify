import { BrowserRouter as  Router, Routes,Route } from "react-router";
import Container from "./components/Container";
import Home from "./pages/Home";
import Alert from "./pages/Alert";


function App() {
  return (
    <div className=" overflow-hidden">
      <Router>

        <Routes>
          {/* router group with sidebar  */}
          <Route element={<Container />}>
            <Route path="/" element={<Home />} />
            <Route path="/alert" element={<Alert />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
