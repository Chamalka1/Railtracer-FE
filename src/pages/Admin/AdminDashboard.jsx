import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Users,
  Train,
  Building2,
  Package,
  TrendingUp,
  UserPlus,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Activity,
  Layers,
} from "lucide-react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersByRole: {},
    totalStations: 0,
    totalTrains: 0,
    totalParcels: 0,
    activeTrains: 0,
    parcelsInTransit: 0,
    parcelsDelivered: 0,
    monthlyParcels: [],
    systemHealth: 98.5,
    pendingIssues: 3,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        // Fetch user stats
        const userResponse = await axios
          .get("http://localhost:5000/api/auth/users", {
            headers: { Authorization: `Bearer ${token}` },
          })
          .catch((err) => {
            console.error("Error fetching users:", err);
            return { data: [] };
          });

        // Calculate user role statistics
        const usersByRole = userResponse.data.reduce((acc, user) => {
          acc[user.role] = (acc[user.role] || 0) + 1;
          return acc;
        }, {});

        // Mock data for other statistics
        // In a real application, these would be fetched from your API
        const mockStationsResponse = { data: { count: 24 } };
        const mockTrainsResponse = { data: { count: 18, active: 12 } };
        const mockParcelsResponse = {
          data: {
            total: 1254,
            inTransit: 342,
            delivered: 876,
            monthlyData: [
              { month: "Jan", count: 80 },
              { month: "Feb", count: 95 },
              { month: "Mar", count: 110 },
              { month: "Apr", count: 105 },
              { month: "May", count: 125 },
              { month: "Jun", count: 140 },
            ],
          },
        };

        setStats({
          totalUsers: userResponse.data.length,
          usersByRole,
          totalStations: mockStationsResponse.data.count,
          totalTrains: mockTrainsResponse.data.count,
          activeTrains: mockTrainsResponse.data.active,
          totalParcels: mockParcelsResponse.data.total,
          parcelsInTransit: mockParcelsResponse.data.inTransit,
          parcelsDelivered: mockParcelsResponse.data.delivered,
          monthlyParcels: mockParcelsResponse.data.monthlyData,
          systemHealth: 98.5,
          pendingIssues: 3,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Data for user roles pie chart
  const userRolesChartData = {
    labels: Object.keys(stats.usersByRole).map((role) =>
      role === "customerSupportStaff"
        ? "CS Staff"
        : role.charAt(0).toUpperCase() +
          role
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .trim()
    ),
    datasets: [
      {
        data: Object.values(stats.usersByRole),
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for monthly parcels bar chart
  const monthlyParcelsChartData = {
    labels: stats.monthlyParcels.map((item) => item.month),
    datasets: [
      {
        label: "Parcels Processed",
        data: stats.monthlyParcels.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.8)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const roleColors = {
    warehouse: "primary",
    customerSupport: "success",
    customerSupportStaff: "info",
    logisticOperator: "warning",
    railwayAdmin: "danger",
    admin: "dark",
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
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h2 className="mb-0 d-flex align-items-center">
                <div className="bg-primary p-2 rounded text-white me-3">
                  <Activity size={28} />
                </div>
                Railway Admin Dashboard
              </h2>
              <p className="text-muted mt-2 mb-0">
                Complete overview of system statistics, users, trains, and
                parcels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="row mb-4">
        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Users</h6>
                  <h3 className="mb-0">{stats.totalUsers}</h3>
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded">
                  <Users className="text-primary" size={24} />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center text-success">
                <ChevronUp size={16} />
                <small className="fw-semibold">+12% from last month</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Stations</h6>
                  <h3 className="mb-0">{stats.totalStations}</h3>
                </div>
                <div className="bg-info bg-opacity-10 p-3 rounded">
                  <Building2 className="text-info" size={24} />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center text-success">
                <ChevronUp size={16} />
                <small className="fw-semibold">+3 new stations</small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Trains</h6>
                  <h3 className="mb-0">{stats.totalTrains}</h3>
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded">
                  <Train className="text-warning" size={24} />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center">
                <div className="progress flex-grow-1" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-warning"
                    style={{
                      width: `${
                        (stats.activeTrains / stats.totalTrains) * 100
                      }%`,
                    }}
                  />
                </div>
                <small className="ms-2 text-muted">
                  {stats.activeTrains} active
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-3 col-md-6 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-muted mb-1">Total Parcels</h6>
                  <h3 className="mb-0">
                    {stats.totalParcels.toLocaleString()}
                  </h3>
                </div>
                <div className="bg-success bg-opacity-10 p-3 rounded">
                  <Package className="text-success" size={24} />
                </div>
              </div>
              <div className="mt-3 d-flex align-items-center text-success">
                <ChevronUp size={16} />
                <small className="fw-semibold">+23% from last month</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Statistics Row */}
      <div className="row mb-4">
        {/* User Roles Distribution */}
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">User Roles Distribution</h5>
            </div>
            <div className="card-body d-flex align-items-center justify-content-center">
              <div style={{ height: "260px", width: "100%" }}>
                <Pie
                  data={userRolesChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: "bottom",
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Parcels */}
        <div className="col-lg-8 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Monthly Parcels Processed</h5>
            </div>
            <div className="card-body">
              <div style={{ height: "260px", width: "100%" }}>
                <Bar
                  data={monthlyParcelsChartData}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Status and Quick Actions */}
      <div className="row mb-4">
        {/* System Status */}
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">System Status</h5>
            </div>
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h6 className="mb-0">System Health</h6>
                <span className="badge bg-success">
                  {stats.systemHealth}% Operational
                </span>
              </div>
              <div className="progress mb-4" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-success"
                  style={{ width: `${stats.systemHealth}%` }}
                ></div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Pending Issues</h6>
                <span className="badge bg-warning">{stats.pendingIssues}</span>
              </div>
              <div className="list-group list-group-flush small">
                <div className="list-group-item px-0 d-flex justify-content-between">
                  <span>API Service</span>
                  <span className="badge bg-success">Operational</span>
                </div>
                <div className="list-group-item px-0 d-flex justify-content-between">
                  <span>Database</span>
                  <span className="badge bg-success">Operational</span>
                </div>
                <div className="list-group-item px-0 d-flex justify-content-between">
                  <span>File Storage</span>
                  <span className="badge bg-warning">Partial Outage</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4 col-sm-6">
                  <Link to="/admin/users" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-primary bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <UserPlus className="text-primary" size={24} />
                        </div>
                        <h6 className="mb-0">Manage Users</h6>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-4 col-sm-6">
                  <Link to="/stations" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-info bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <Building2 className="text-info" size={24} />
                        </div>
                        <h6 className="mb-0">Manage Stations</h6>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-4 col-sm-6">
                  <Link to="/trains" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-warning bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <Train className="text-warning" size={24} />
                        </div>
                        <h6 className="mb-0">Manage Trains</h6>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-4 col-sm-6">
                  <Link to="/packages" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-success bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <Package className="text-success" size={24} />
                        </div>
                        <h6 className="mb-0">Track Parcels</h6>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-4 col-sm-6">
                  <Link to="/admin/log" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-secondary bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <Layers className="text-secondary" size={24} />
                        </div>
                        <h6 className="mb-0">System Logs</h6>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-md-4 col-sm-6">
                  <Link to="/complains" className="text-decoration-none">
                    <div className="card h-100 border-0 shadow-sm hover-shadow">
                      <div className="card-body text-center p-3">
                        <div
                          className="bg-danger bg-opacity-10 p-3 rounded-circle mx-auto mb-3"
                          style={{ width: "fit-content" }}
                        >
                          <AlertTriangle className="text-danger" size={24} />
                        </div>
                        <h6 className="mb-0">View Complaints</h6>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
              <h5 className="mb-0">User Management</h5>
              <Link to="/admin/users" className="btn btn-sm btn-primary">
                View All Users
              </Link>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th className="border-0">Role</th>
                      <th className="border-0">Count</th>
                      <th className="border-0">Status</th>
                      <th className="border-0 text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.usersByRole).map(([role, count]) => (
                      <tr key={role}>
                        <td>
                          <span className="d-flex align-items-center">
                            <span
                              className={`badge bg-${
                                roleColors[role] || "secondary"
                              } me-2`}
                            >
                              {role.charAt(0).toUpperCase()}
                            </span>
                            {role === "customerSupportStaff"
                              ? "Customer Support Staff"
                              : role.charAt(0).toUpperCase() +
                                role
                                  .slice(1)
                                  .replace(/([A-Z])/g, " $1")
                                  .trim()}
                          </span>
                        </td>
                        <td>{count}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div
                              className="bg-success rounded-circle me-1"
                              style={{ width: "8px", height: "8px" }}
                            ></div>
                            <span>Active</span>
                          </div>
                        </td>
                        <td className="text-end">
                          <Link
                            to={`/admin/users?role=${role}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            Manage
                          </Link>
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

export default AdminDashboard;
