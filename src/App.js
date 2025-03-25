import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Authentication/Login/Login";
import { AdminLog } from "./pages/Admin/AdminLog";
import { TrainStation } from "./pages/TrainStation/TrainStation";
import { Train } from "./pages/Train/Train";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLog />} />
          <Route path="/stations" element={<TrainStation />} />
          <Route path="/trains" element={<Train />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
