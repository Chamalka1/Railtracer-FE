import "./App.css";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
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
import UserManagement from "./components/UserManagement.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ParcelManagement from "./components/ParcelManagement";
import SetPassword from "./components/SetPassword";
import WarehouseDashboard from "./pages/WarehousePersonal/WarehouseDashboard";
import TrackParcel from "./components/TrackParcel";

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

// AppLayout component to handle conditional NavBar rendering
const AppLayout = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const location = useLocation();

  // Don't show NavBar on tracking pages or login
  const isTrackingPage = location.pathname.startsWith("/track");
  const isLoginPage = location.pathname === "/login";
  const showNavBar = user && !isTrackingPage && !isLoginPage;

  return (
    <>
      {showNavBar && <NavBar />}
      <div className={showNavBar ? "mt-5 ms-5" : ""}>{children}</div>
    </>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppLayout>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/set-password/:token" element={<SetPassword />} />
            <Route path="/track" element={<TrackParcel />} />
            <Route path="/track/:trackingNumber" element={<TrackParcel />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                // <ProtectedRoute>
                  <Home />
                // </ProtectedRoute>
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
            {/* Warehouse Routes */}
            <Route
              path="/warehouse"
              element={
                <ProtectedRoute allowedRoles={["warehouse", "admin"]}>
                  <WarehouseDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<ErrorNotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </div>
  );
}

export default App;
