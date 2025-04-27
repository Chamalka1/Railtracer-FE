import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext";

export const Csupport = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";
  // const { user } = useAuth();
  const [stats, setStats] = useState({
    totalParcels: 0,
    inTransit: 0,
    delivered: 0,
    accepted: 0,
  });
  const [recentParcels, setRecentParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [parcelsResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/parcels`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: 5 }, // Get only 5 recent parcels
        }),
      ]);

      // Calculate stats from parcels
      const parcels = parcelsResponse.data.data;
      const stats = parcels.reduce(
        (acc, parcel) => {
          acc.totalParcels++;
          acc[parcel.status]++;
          return acc;
        },
        { totalParcels: 0, "in-transit": 0, delivered: 0, accepted: 0 }
      );

      setStats(stats);
      setRecentParcels(parcels);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "delivered":
        return "bg-success";
      case "in-transit":
        return "bg-primary";
      default:
        return "bg-secondary";
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col">
          {/* <h2>Welcome, {user?.name || "Customer Support"}</h2> */}
          <p className="text-muted">Here's your dashboard overview</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <h5 className="card-title">Total Parcels</h5>
              <h2 className="mb-0">{stats.totalParcels}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h5 className="card-title">In Transit</h5>
              <h2 className="mb-0">{stats["in-transit"]}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h5 className="card-title">Delivered</h5>
              <h2 className="mb-0">{stats.delivered}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-secondary text-white">
            <div className="card-body">
              <h5 className="card-title">Newly Accepted</h5>
              <h2 className="mb-0">{stats.accepted}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Quick Actions</h5>
              <div className="d-flex gap-2">
                <Link to="/packages" className="btn btn-primary">
                  <i className="bi bi-box me-2"></i>
                  Manage Parcels
                </Link>
                <Link to="/complains" className="btn btn-outline-primary">
                  <i className="bi bi-chat-dots me-2"></i>
                  View Complaints
                </Link>
                <Link to="/track" className="btn btn-outline-primary">
                  <i className="bi bi-search me-2"></i>
                  Track Parcel
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Parcels */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Recent Parcels</h5>
                <Link to="/packages" className="btn btn-sm btn-link">
                  View All
                </Link>
              </div>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Tracking Number</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentParcels.map((parcel) => (
                      <tr key={parcel._id}>
                        <td>{parcel.trackingNumber}</td>
                        <td>{parcel.customerName}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              parcel.status
                            )}`}
                          >
                            {parcel.status}
                          </span>
                        </td>
                        <td>
                          {new Date(parcel.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
