import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Authentication/Login/Login";
import { GoodRetreve } from "./pages/GoodRetrever/GoodRetreve";
import { Csupport } from "./pages/CustomerSupport/Csupport";
import { Complain, complain } from "./pages/Complain/complain";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/good-retrevals" element={<GoodRetreve />} />
          <Route path="/csupport" element={<Csupport />} />
          <Route path="/complains" element={<Complain />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
