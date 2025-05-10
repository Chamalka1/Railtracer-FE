import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Train, LogIn, Mail, Lock, AlertCircle } from "lucide-react";

export const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Redirect based on role
      if (
        response.data.user.role === "admin" ||
        response.data.user.role === "railwayAdmin"
      ) {
        navigate("/admin");
      } else if (response.data.user.role === "customerSupport") {
        navigate("/csupport");
      } else if (response.data.user.role === "warehouse") {
        navigate("/warehouse");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center bg-light py-5">
      <div className="container">
        <div className="row g-0 shadow rounded-4 overflow-hidden bg-white">
          {/* Left Side - Vector Image */}
          <div className="col-lg-6 d-none d-lg-block bg-primary p-0">
            <div className="h-100 d-flex flex-column justify-content-center text-white p-5 login-vector-bg">
              <div className="text-center mb-5">
                <div className="bg-white p-3 rounded-circle d-inline-flex mb-4">
                  <Train className="text-primary" size={48} />
                </div>
                <h2 className="fw-bold">RailTracer</h2>
                <p className="lead mb-0">Railway Management System</p>
              </div>
              <div className="mt-auto text-center">
                <blockquote className="blockquote">
                  <p className="mb-0">
                    "Delivering logistics excellence through cutting-edge
                    railway management."
                  </p>
                </blockquote>
                <div className="mt-5 login-illustration">
                  <img
                    src="https://cdn.jsdelivr.net/gh/Tarikul-Islam-Anik/Animated-Fluent-Emojis/Emojis/Travel%20and%20places/Locomotive.png"
                    alt="Railway Illustration"
                    className="img-fluid"
                    style={{ maxHeight: "220px" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-6">
            <div className="p-5 h-100 d-flex flex-column justify-content-center">
              <div className="text-center mb-4 d-lg-none">
                <div className="d-inline-flex align-items-center mb-3">
                  <Train className="text-primary me-2" size={28} />
                  <h3 className="fw-bold text-primary mb-0">RailTracer</h3>
                </div>
                <p className="text-muted">Railway Management System</p>
              </div>

              <h4 className="fw-bold mb-4">Sign In to Dashboard</h4>
              <p className="text-muted mb-4">
                Enter your credentials to access your account
              </p>

              {error && (
                <div
                  className="alert alert-danger d-flex align-items-center"
                  role="alert"
                >
                  <AlertCircle size={18} className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-medium">
                    Email Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Mail size={18} className="text-muted" />
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0 bg-light"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <label
                      htmlFor="password"
                      className="form-label fw-medium mb-0"
                    >
                      Password
                    </label>
                    <a
                      href="#"
                      className="text-primary text-decoration-none small"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <Lock size={18} className="text-muted" />
                    </span>
                    <input
                      type="password"
                      className="form-control border-start-0 ps-0 bg-light"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <div className="mb-4 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="rememberMe"
                  />
                  <label className="form-check-label" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2 mb-4 d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} className="me-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-muted mt-auto mb-0">
                &copy; 2023 RailTracer. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
