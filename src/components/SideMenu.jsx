import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Train,
  Building2,
  Package,
  HeadphonesIcon,
  FileWarning,
  Gauge,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const SideMenu = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "null");
    setUser(userData);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    if (!user) return [];

    const menuItems = [
      // { path: "/", label: "Dashboard", icon: <Home size={20} /> },
    ];

    switch (user.role) {
      case "admin":
      case "railwayAdmin":
        menuItems.push(
          {
            path: "/admin",
            label: "Admin Dashboard",
            icon: <Gauge size={20} />,
          },
          {
            path: "/admin/users",
            label: "User Management",
            icon: <Users size={20} />,
          },
          {
            path: "/stations",
            label: "Manage Stations",
            icon: <Building2 size={20} />,
          },
          { path: "/trains", label: "Manage Trains", icon: <Train size={20} /> }
        );
        break;
      case "warehouse":
        menuItems.push(
          {
            path: "/warehouse",
            label: "Warehouse Dashboard",
            icon: <Gauge size={20} />,
          },
          // {
          //   path: "/warehouse",
          //   label: "Manage Packages",
          //   icon: <Package size={20} />,
          // },
          {
            path: "/good-retrevals",
            label: "Good Retrievals",
            icon: <Package size={20} />,
          }
        );
        break;
      case "customerSupport":
      case "customerSupportStaff":
        menuItems.push(
          {
            path: "/csupport",
            label: "Support Dashboard",
            icon: <HeadphonesIcon size={20} />,
          },
          {
            path: "/packages",
            label: "Manage Packages",
            icon: <Package size={20} />,
          },
          {
            path: "/complains",
            label: "Manage Complaints",
            icon: <FileWarning size={20} />,
          }
        );
        break;
      case "logisticOperator":
        menuItems.push(
          {
            path: "/trains",
            label: "Train Schedule",
            icon: <Train size={20} />,
          },
          {
            path: "/packages",
            label: "Package Tracking",
            icon: <Package size={20} />,
          }
        );
        break;
      default:
        break;
    }

    return menuItems;
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="btn btn-dark d-lg-none position-fixed top-2 start-2 z-index-1000 m-2"
        onClick={toggleSidebar}
        aria-label="Toggle Sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`sidebar bg-dark text-white ${
          isOpen ? "d-flex" : "d-none d-lg-flex"
        } flex-column position-fixed top-0 start-0 bottom-0 p-3 shadow`}
        style={{ width: "260px", zIndex: 1000, transition: "all 0.3s ease" }}
      >
        <div className="d-flex align-items-center mb-4 mt-2 justify-content-between">
          <Link
            to="/"
            className="text-decoration-none text-white d-flex align-items-center"
          >
            <Train className="me-2" size={24} />
            <h3 className="m-0 fw-bold">Railtracer</h3>
          </Link>
          <button
            className="btn btn-link text-white d-lg-none p-0"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="user-profile py-2 px-3 mb-4 rounded d-flex align-items-center"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        >
          <div className="bg-primary rounded-circle p-2 me-3">
            <Users size={22} />
          </div>
          <div className="d-flex flex-column">
            <span className="fw-semibold">
              {user.firstName} {user.lastName}
            </span>
            <small className="text-light-emphasis text-capitalize">
              {user.role}
            </small>
          </div>
        </div>

        <div className="flex-grow-1 overflow-auto">
          <ul className="nav flex-column gap-1">
            {getMenuItems().map((item, index) => (
              <li className="nav-item" key={index}>
                <Link
                  to={item.path}
                  className={`nav-link d-flex align-items-center rounded py-2 px-3 ${
                    location.pathname === item.path
                      ? "active bg-primary text-white"
                      : "text-white-50 hover-highlight"
                  }`}
                >
                  <span className="me-3">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto">
          <button
            className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={logoutUser}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
