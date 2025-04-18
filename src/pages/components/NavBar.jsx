import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export const NavBar = () => {
  const features = [
    { name: "Home", ref: "/" },
    { name: "Packages", ref: "/packages" },
    { name: "Trains", ref: "/trains" },
    { name: "Stations", ref: "/stations" },
    { name: "Complains", ref: "/complains" },
    { name: "Customers", ref: "/customers" },
    { name: "Warehouses", ref: "/warehouses" },
    { name: "Logistics", ref: "/ogistics" },
  ];
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Rail Tracer
        </NavLink>
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
          <ul className="navbar-nav">
            {features.map((f, index) => (
              <li key={index} className="nav-link ">
                <NavLink
                  className={({ isActive }) => {
                    return isActive
                      ? "nav-link text-primary-emphasis fw-bold"
                      : "nav-link";
                  }}
                  aria-current="page"
                  to={f.ref}
                >
                  {f.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="d-flex align-items-center">
          <span className="me-2">John Smith</span>
          <img src="/user.png" className="me-2" style={{ width: "40px" }} />
          <button className="btn btn-outline-success" type="submit">
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
};
