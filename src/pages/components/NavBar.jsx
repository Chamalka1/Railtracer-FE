import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const getMenuItems = () => {
    if (!user) return [];

    const menuItems = [{ path: "/", label: "Home" }];

    switch (user.role) {
      case "admin":
      case "railwayAdmin":
        menuItems.push(
          { path: "/admin", label: "Admin Dashboard" },
          { path: "/admin/users", label: "User Management" },
          { path: "/stations", label: "Stations" },
          { path: "/trains", label: "Trains" }
        );
        break;
      case "warehouse":
        menuItems.push(
          { path: "/packages", label: "Packages" },
          { path: "/good-retrevals", label: "Good Retrievals" }
        );
        break;
      case "customerSupport":
      case "customerSupportStaff":
        menuItems.push(
          { path: "/csupport", label: "Support Dashboard" },
          { path: "/complains", label: "Complaints" }
        );
        break;
      case "logisticOperator":
        menuItems.push(
          { path: "/trains", label: "Train Schedule" },
          { path: "/packages", label: "Package Tracking" }
        );
        break;
      default:
        break;
    }

    return menuItems;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-train-front me-2"></i>
          Railway Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {getMenuItems().map((item, index) => (
              <li className="nav-item" key={index}>
                <Link
                  className={`nav-link ${
                    location.pathname === item.path ? "active fw-bold" : ""
                  }`}
                  to={item.path}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {user && (
            <div className="d-flex align-items-center">
              <div className="text-light me-3">
                <i className="bi bi-person-circle me-2"></i>
                <span className="fw-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="ms-2 badge bg-primary">{user.role}</span>
              </div>
              <button
                className="btn btn-outline-light d-flex align-items-center"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
