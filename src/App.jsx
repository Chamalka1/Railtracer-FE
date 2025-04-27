import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import UserManagement from "./components/UserManagement";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ParcelManagement from "./components/ParcelManagement";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // if (!token || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  console.log(user)
  return (
    <div className="App">
      <BrowserRouter>
        {user && <NavBar />}
        <div className={user ? "mt-5 ms-5" : ""}>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin", "railwayAdmin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={["admin", "railwayAdmin"]}>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stations"
              element={
                <ProtectedRoute>
                  <TrainStation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/stations/new"
              element={
                <ProtectedRoute>
                  <CreateStation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trains"
              element={
                <ProtectedRoute>
                  <Train />
                </ProtectedRoute>
              }
            />
            <Route
              path="/good-retrevals"
              element={
                <ProtectedRoute>
                  <GoodRetreve />
                </ProtectedRoute>
              }
            />
            <Route
              path="/csupport"
              element={
                <ProtectedRoute>
                  <Csupport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/complains"
              element={
                <ProtectedRoute>
                  <Complain />
                </ProtectedRoute>
              }
            />
            <Route
              path="/packages"
              element={
                <ProtectedRoute allowedRoles={["customerSupport"]}>
                  <ParcelManagement />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorNotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
