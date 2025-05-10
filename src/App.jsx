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
import { ErrorNotFound } from "./pages/components/ErrorNotFound";
import { Package } from "./pages/Package/Package";
import { CreateStation } from "./pages/TrainStation/CreateStaion";
import UserManagement from "./components/UserManagement.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import ParcelManagement from "./components/ParcelManagement";
import SetPassword from "./components/SetPassword";
import WarehouseDashboard from "./pages/WarehousePersonal/WarehouseDashboard";
import TrackParcel from "./components/TrackParcel";
import { Layout } from "./Layouts/Layouts.jsx";

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // if (!token || !user) {
  //   return <Navigate to="/login" replace />;
  // }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

// Public layout for login and public pages
const PublicLayout = ({ children }) => {
  return <div className="container-fluid p-0">{children}</div>;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            }
          />
          <Route
            path="/set-password/:token"
            element={
              <PublicLayout>
                <SetPassword />
              </PublicLayout>
            }
          />
          <Route
            path="/track"
            element={
              <PublicLayout>
                <TrackParcel />
              </PublicLayout>
            }
          />
          <Route
            path="/track/:trackingNumber"
            element={
              <PublicLayout>
                <TrackParcel />
              </PublicLayout>
            }
          />

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
      </BrowserRouter>
    </div>
  );
}

export default App;
