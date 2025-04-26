import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import first from '../../Assets/firstslide.jpg'

export const Home = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const navigate = useNavigate();

  const LandingPage = () => (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero position-relative">
        <div className="hero-image-container">
          <img
            src={first}
            alt="Railway Management"
            className="w-100 h-100 object-fit-cover"
            style={{ maxHeight: "600px" }}
          />
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        </div>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-light w-75">
          <h1 className="display-3 fw-bold mb-4">Railway Management System</h1>
          <p className="lead fs-4 mb-4">
            Revolutionizing railway operations with cutting-edge technology and
            seamless integration
          </p>
          <button
            className="btn btn-primary btn-lg px-5 py-3 fw-semibold"
            onClick={() => navigate("/login")}
          >
            Get Started <i className="bi bi-arrow-right ms-2"></i>
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center display-5 mb-5">Why Choose Us</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 h-100 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-building text-primary display-4"></i>
                  </div>
                  <h3 className="h4 card-title">Station Management</h3>
                  <p className="card-text text-muted">
                    Centralized control system for efficient station operations,
                    scheduling, and real-time monitoring.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 h-100 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-box-seam text-primary display-4"></i>
                  </div>
                  <h3 className="h4 card-title">Package Tracking</h3>
                  <p className="card-text text-muted">
                    End-to-end visibility of package movement with real-time
                    updates and automated notifications.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 h-100 shadow-sm hover-shadow">
                <div className="card-body text-center p-4">
                  <div className="feature-icon mb-3">
                    <i className="bi bi-headset text-primary display-4"></i>
                  </div>
                  <h3 className="h4 card-title">Customer Support</h3>
                  <p className="card-text text-muted">
                    24/7 dedicated support team ensuring seamless communication
                    and quick issue resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5 bg-primary text-light">
        <div className="container">
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <h3 className="display-4 fw-bold mb-2">500+</h3>
              <p className="mb-0">Stations Managed</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold mb-2">1M+</h3>
              <p className="mb-0">Packages Delivered</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold mb-2">98%</h3>
              <p className="mb-0">Customer Satisfaction</p>
            </div>
            <div className="col-md-3">
              <h3 className="display-4 fw-bold mb-2">24/7</h3>
              <p className="mb-0">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 text-center">
              <h2 className="display-5 mb-4">Get in Touch</h2>
              <p className="lead mb-5">
                Our team is ready to assist you with any questions or concerns
              </p>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="bi bi-envelope-fill text-primary display-6 mb-3"></i>
                    <h4 className="h5">Email Us</h4>
                    <p className="mb-0">support@railwaymgmt.com</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="bi bi-telephone-fill text-primary display-6 mb-3"></i>
                    <h4 className="h5">Call Us</h4>
                    <p className="mb-0">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="contact-item">
                    <i className="bi bi-geo-alt-fill text-primary display-6 mb-3"></i>
                    <h4 className="h5">Visit Us</h4>
                    <p className="mb-0">123 Railway Street, City</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="mb-4">Railway Management System</h5>
              <p className="text-muted">
                Transforming railway operations with innovative solutions and
                cutting-edge technology.
              </p>
              <div className="social-links">
                <a href="#" className="text-light me-3">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-light me-3">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-light me-3">
                  <i className="bi bi-linkedin"></i>
                </a>
                <a href="#" className="text-light">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
            <div className="col-lg-2">
              <h5 className="mb-4">Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    About Us
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Services
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Contact
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-2">
              <h5 className="mb-4">Services</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Station Management
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Package Tracking
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Customer Support
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="text-muted text-decoration-none">
                    Logistics
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-lg-4">
              <h5 className="mb-4">Newsletter</h5>
              <p className="text-muted">
                Subscribe to our newsletter for updates and news.
              </p>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <button className="btn btn-primary" type="button">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row">
            <div className="col-md-6 text-center text-md-start">
              <p className="mb-0 text-muted">
                &copy; 2024 Railway Management System. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-muted text-decoration-none me-3">
                Privacy Policy
              </a>
              <a href="#" className="text-muted text-decoration-none">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );

  const getRoleSpecificContent = () => {
    if (!user) {
      return <LandingPage />;
    }

    const roleContent = {
      admin: {
        title: "Railway System Administrator",
        description: "Manage users, stations, and system operations.",
        actions: [
          { label: "User Management", path: "/admin/users" },
          { label: "Station Management", path: "/stations" },
          { label: "Train Management", path: "/trains" },
        ],
      },
      railwayAdmin: {
        title: "Railway Administrator",
        description: "Oversee railway operations and station management.",
        actions: [
          { label: "Station Management", path: "/stations" },
          { label: "Train Management", path: "/trains" },
        ],
      },
      warehouse: {
        title: "Warehouse Management",
        description: "Handle package storage and retrieval operations.",
        actions: [
          { label: "Package Management", path: "/packages" },
          { label: "Good Retrievals", path: "/good-retrevals" },
        ],
      },
      customerSupport: {
        title: "Customer Support Portal",
        description: "Handle customer inquiries and manage support tickets.",
        actions: [
          { label: "Support Dashboard", path: "/csupport" },
          { label: "Manage Complaints", path: "/complains" },
        ],
      },
      customerSupportStaff: {
        title: "Customer Support",
        description: "Assist customers and manage support requests.",
        actions: [
          { label: "View Complaints", path: "/complains" },
          { label: "Support Center", path: "/csupport" },
        ],
      },
      logisticOperator: {
        title: "Logistics Operations",
        description: "Manage train schedules and package logistics.",
        actions: [
          { label: "Train Schedule", path: "/trains" },
          { label: "Package Tracking", path: "/packages" },
        ],
      },
    };

    const content = roleContent[user.role] || {
      title: "Welcome",
      description: "Access your railway management features.",
      actions: [],
    };

    return (
      <div className="container py-5">
        <div className="text-center">
          <h2 className="mb-4">{content.title}</h2>
          <p className="lead mb-4">{content.description}</p>
          <div className="d-flex justify-content-center gap-3">
            {content.actions.map((action, index) => (
              <button
                key={index}
                className="btn btn-primary"
                onClick={() => navigate(action.path)}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return getRoleSpecificContent();
};
