import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersByRole: {},
  });

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Calculate statistics
      const usersByRole = response.data.reduce((acc, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers: response.data.length,
        usersByRole,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const roleColors = {
    warehouse: "primary",
    customerSupport: "success",
    customerSupportStaff: "info",
    logisticOperator: "warning",
    railwayAdmin: "danger",
  };

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col">
          <h2>Railway Admin Dashboard</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-flex gap-2">
                <Link to="/admin/users" className="btn btn-primary">
                  Manage Users
                </Link>
                <Link to="/stations" className="btn btn-secondary">
                  Manage Stations
                </Link>
                <Link to="/trains" className="btn btn-secondary">
                  Manage Trains
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Total Users</h5>
              <h2 className="card-text">{stats.totalUsers}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Users by Role</h5>
              <div className="d-flex flex-wrap gap-3">
                {Object.entries(stats.usersByRole).map(([role, count]) => (
                  <div
                    key={role}
                    className={`card border-${roleColors[role] || "secondary"}`}
                  >
                    <div className="card-body p-2">
                      <h6 className="card-title">{role}</h6>
                      <p className="card-text h4">{count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row">
        <div className="col">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">User Management</h5>
              <p>Add and manage different types of users:</p>
              <div className="list-group">
                <Link
                  to="/admin/users?role=warehouse"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  Warehouse Personnel
                  <span className="badge bg-primary rounded-pill">
                    {stats.usersByRole.warehouse || 0}
                  </span>
                </Link>
                <Link
                  to="/admin/users?role=customerSupport"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  Customer Support
                  <span className="badge bg-success rounded-pill">
                    {stats.usersByRole.customerSupport || 0}
                  </span>
                </Link>
                <Link
                  to="/admin/users?role=customerSupportStaff"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  Customer Support Staff
                  <span className="badge bg-info rounded-pill">
                    {stats.usersByRole.customerSupportStaff || 0}
                  </span>
                </Link>
                <Link
                  to="/admin/users?role=logisticOperator"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  Logistic Operator
                  <span className="badge bg-warning rounded-pill">
                    {stats.usersByRole.logisticOperator || 0}
                  </span>
                </Link>
                <Link
                  to="/admin/users?role=railwayAdmin"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                >
                  Railway Admin
                  <span className="badge bg-danger rounded-pill">
                    {stats.usersByRole.railwayAdmin || 0}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
