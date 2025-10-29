import { BrowserRouter as  Router, Routes,Route } from "react-router";
import Container from "./components/Container";
import Home from "./pages/Home";
import Alert from "./pages/Alert";
import { Toaster } from "react-hot-toast";
import Comparison from "./pages/Comparison";
import Create from "./pages/Create";
import OracleComparison from "./pages/BtcStats";


function App() {
  return (
    <div className=" overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} />

      <Router>

        <Routes>
          {/* router group with sidebar  */}
          <Route element={<Container />}>
            <Route path="/" element={<Home />} />
            <Route path="/alert" element={<Alert />} />
            <Route path="/pricefeeds" element={<Comparison />} />
            <Route path="/comparison" element={<OracleComparison />} />
            <Route path="/create" element={<Create />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
