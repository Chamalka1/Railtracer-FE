import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FileWarning, Package, Search, MessageSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export const Csupport = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";
  // const { user } = useAuth();
  const [stats, setStats] = useState({
    totalParcels: 0,
    inTransit: 0,
    delivered: 0,
    accepted: 0,
    openComplaints: 0,
  });
  const [recentParcels, setRecentParcels] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
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

      // Try to fetch complaints from API
      let complaintsFromAPI = [];
      try {
        const complaintsResponse = await axios.get(
          `${API_BASE_URL}/complains?complainStatus=SUMBITTED,IN_PROGRESS,PAUSED&limit=3`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (complaintsResponse.data && complaintsResponse.data.response) {
          // Map the backend complaint structure to our frontend format
          complaintsFromAPI = await Promise.all(
            complaintsResponse.data.response.map(async (complaint) => {
              // Try to get the parcel details to display the tracking number
              let trackingNumber = "Unknown";
              try {
                if (complaint.packageId) {
                  const parcelResponse = await axios.get(
                    `${API_BASE_URL}/parcels/${complaint.packageId}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  if (parcelResponse.data && parcelResponse.data.data) {
                    trackingNumber =
                      parcelResponse.data.data.trackingNumber || "Unknown";
                  }
                }
              } catch (parcelError) {
                console.warn("Could not fetch parcel details:", parcelError);
              }

              // Convert backend format to frontend format
              return {
                _id: complaint._id,
                customerName: complaint.user?.name || "Unknown Customer",
                packageId: trackingNumber,
                description: complaint.discription || "",
                issueType: complaint.complainerCategory
                  ? complaint.complainerCategory.toLowerCase()
                  : "other",
                status:
                  complaint.complainStatus === "SOLVED" ? "resolved" : "open",
                createdAt: complaint.createdAt || new Date().toISOString(),
              };
            })
          );
        }
      } catch (apiError) {
        console.log("Complaints API endpoint not available:", apiError);
      }

      // Check localStorage for any saved damage reports
      const storedReports = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("damage_report_")) {
          try {
            const reportData = JSON.parse(localStorage.getItem(key));
            if (reportData) {
              storedReports.push({
                ...reportData,
                _id: key.replace("damage_report_", ""),
                createdAt: new Date(
                  parseInt(key.replace("damage_report_", ""))
                ).toISOString(),
              });
            }
          } catch (e) {
            console.error("Error parsing stored damage report:", e);
          }
        }
      }

      // Combine API complaints with stored reports, or use mock data if both are empty
      let allComplaints = [...complaintsFromAPI, ...storedReports];

      if (allComplaints.length === 0) {
        // Mock recent complaints if no real data is available
        allComplaints = [
          {
            _id: "1",
            customerName: "John Doe",
            packageId: "PKG123456",
            description: "Package arrived damaged with visible dents",
            createdAt: new Date().toISOString(),
            status: "open",
            issueType: "damaged",
          },
          {
            _id: "2",
            customerName: "Jane Smith",
            packageId: "PKG789012",
            description: "Missing items from package",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            status: "open",
            issueType: "missing-items",
          },
        ];
      }

      setRecentComplaints(allComplaints.slice(0, 3)); // Only show the 3 most recent

      // Calculate stats from parcels
      const parcels = parcelsResponse.data.data;
      const stats = parcels.reduce(
        (acc, parcel) => {
          acc.totalParcels++;
          acc[parcel.status]++;
          return acc;
        },
        {
          totalParcels: 0,
          "in-transit": 0,
          delivered: 0,
          accepted: 0,
          openComplaints: allComplaints.length,
        }
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

  const getIssueTypeBadgeClass = (issueType) => {
    switch (issueType) {
      case "damaged":
        return "bg-danger";
      case "missing-items":
        return "bg-warning text-dark";
      case "delay":
        return "bg-info";
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
          <h2 className="mb-2">Customer Support Dashboard</h2>
          <p className="text-muted">
            Monitor parcels and handle customer complaints
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card bg-primary text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Total Parcels</h5>
              <h2 className="mb-0">{stats.totalParcels}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card bg-info text-white h-100">
            <div className="card-body">
              <h5 className="card-title">In Transit</h5>
              <h2 className="mb-0">{stats["in-transit"]}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card bg-success text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Delivered</h5>
              <h2 className="mb-0">{stats.delivered}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card bg-danger text-white h-100">
            <div className="card-body">
              <h5 className="card-title">Open Complaints</h5>
              <h2 className="mb-0">{stats.openComplaints}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-4">Quick Actions</h5>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/packages" className="btn btn-primary">
                  <Package size={20} className="me-2" />
                  Manage Parcels
                </Link>
                <Link to="/complains" className="btn btn-danger">
                  <FileWarning size={20} className="me-2" />
                  Manage Complaints
                  {stats.openComplaints > 0 && (
                    <span className="badge bg-white text-danger ms-2">
                      {stats.openComplaints}
                    </span>
                  )}
                </Link>
                <Link to="/track" className="btn btn-outline-primary">
                  <Search size={20} className="me-2" />
                  Track Parcel
                </Link>
                <Link
                  to="/csupport/messages"
                  className="btn btn-outline-primary"
                >
                  <MessageSquare size={20} className="me-2" />
                  Customer Messages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two columns layout: Recent Parcels and Recent Complaints */}
      <div className="row">
        {/* Recent Parcels */}
        <div className="col-lg-7 mb-4 mb-lg-0">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Recent Parcels</h5>
                <Link to="/packages" className="btn btn-sm btn-primary">
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

        {/* Recent Complaints */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-danger border-top h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">
                  <FileWarning size={18} className="me-2 text-danger" />
                  Recent Complaints
                </h5>
                <Link to="/complains" className="btn btn-sm btn-danger">
                  Manage All
                </Link>
              </div>

              {recentComplaints.length > 0 ? (
                <div className="complaint-list">
                  {recentComplaints.map((complaint) => (
                    <div
                      key={complaint._id}
                      className="card mb-3 border-0 bg-light"
                    >
                      <div className="card-body p-3">
                        <div className="d-flex justify-content-between mb-2">
                          <h6 className="card-subtitle mb-0 text-body-secondary">
                            {complaint.customerName}
                          </h6>
                          <span
                            className={`badge ${getIssueTypeBadgeClass(
                              complaint.issueType
                            )}`}
                          >
                            {complaint.issueType.replace("-", " ")}
                          </span>
                        </div>
                        <p className="card-text small mb-2 text-truncate">
                          {complaint.description}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-body-secondary">
                            {new Date(complaint.createdAt).toLocaleDateString()}
                          </small>
                          <Link
                            to={`/complains?id=${complaint._id}`}
                            className="btn btn-sm btn-outline-danger"
                          >
                            Resolve
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-success">
                  <i className="bi bi-check-circle me-2"></i>
                  No open complaints at the moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
