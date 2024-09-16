import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./Home";
import Navbar from "./Navbar.js";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" and element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
