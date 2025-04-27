import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          RailTracer
        </Link>

        <div className="navbar-nav ms-auto">
          {isAuthenticated ? (
            <>
              {user?.role === "customer-support" && (
                <Link className="nav-link" to="/support/parcels">
                  Parcel Management
                </Link>
              )}
              <span className="nav-link">{user?.name || user?.email}</span>
              <button className="btn btn-link nav-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link className="nav-link" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
