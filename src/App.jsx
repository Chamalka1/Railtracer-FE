import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home/Home";
import { Login } from "./pages/Authentication/Login/Login";
import { AdminLog } from "./pages/Admin/AdminLog";
import { TrainStation } from "./pages/TrainStation/TrainStation";
import { Train } from "./pages/Train/Train";
import { GoodRetreve } from "./pages/GoodRetrever/GoodRetreve";
import { Csupport } from "./pages/CustomerSupport/customerSupport";
import { Complain } from "./pages/Complain/complain";
import { NavBar } from "./pages/components/NavBar";
import { ErrorNotFound } from "./pages/components/ErrorNotFound";
import { Package } from "./pages/Package/Package";
import { CreateStation } from "./pages/TrainStation/CreateStaion";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <div className="mt-5 ms-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminLog />} />
            <Route path="/stations" element={<TrainStation />} />
            <Route path="/stations/new" element={<CreateStation />} />
            <Route path="/trains" element={<Train />} />
            <Route path="/good-retrevals" element={<GoodRetreve />} />
            <Route path="/csupport" element={<Csupport />} />
            <Route path="/complains" element={<Complain />} />
            <Route path="/packages" element={<Package />} />
            <Route path="*" element={<ErrorNotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
