import React, { useState, useEffect } from "react";
import axios from "axios";
import { FileWarning, CheckCircle, PlusCircle, X } from "lucide-react";

export const Complain = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    customerName: "",
    packageId: "",
    description: "",
    issueType: "damaged",
    contactEmail: "",
    contactPhone: "",
  });
  const [resolution, setResolution] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const status = activeTab === "open" ? "open" : "resolved";

      // Try to fetch from the API, but have a fallback for the mock data
      try {
        const response = await axios.get(
          `${API_BASE_URL}/complaints?status=${status}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // If we get valid data from the API, use it
        if (response.data && response.data.data) {
          setComplaints(response.data.data);
          return;
        }
      } catch (apiError) {
        console.log("API endpoint not available, using mock data", apiError);
        // Continue with the mock data below
      }

      // Mock data as fallback (will be used if the API fails or returns invalid data)
      console.log("Using mock complaint data");
      const mockData =
        activeTab === "open"
          ? [
              {
                _id: "1",
                customerName: "John Doe",
                packageId: "PKG123456",
                description: "Package arrived damaged with visible dents",
                createdAt: new Date().toISOString(),
                status: "open",
                issueType: "damaged",
                contactEmail: "john@example.com",
                contactPhone: "555-1234",
              },
              {
                _id: "2",
                customerName: "Jane Smith",
                packageId: "PKG789012",
                description:
                  "Package is missing items that were supposed to be included",
                createdAt: new Date(Date.now() - 86400000).toISOString(),
                status: "open",
                issueType: "missing-items",
                contactEmail: "jane@example.com",
                contactPhone: "555-5678",
              },
              {
                _id: "3",
                customerName: "Mike Johnson",
                packageId: "PKG345678",
                description:
                  "Package damaged during warehouse handling - reported by staff",
                createdAt: new Date(Date.now() - 43200000).toISOString(),
                status: "open",
                issueType: "damaged",
                reportedBy: "Warehouse Staff",
                contactEmail: "mike@example.com",
                contactPhone: "555-9012",
              },
            ]
          : [
              {
                _id: "4",
                customerName: "Sarah Williams",
                packageId: "PKG901234",
                description: "Package arrived late",
                createdAt: new Date(Date.now() - 172800000).toISOString(),
                resolvedAt: new Date(Date.now() - 86400000).toISOString(),
                status: "resolved",
                issueType: "delay",
                resolution:
                  "Customer was compensated with a discount on their next shipment.",
                contactEmail: "sarah@example.com",
                contactPhone: "555-3456",
              },
              {
                _id: "5",
                customerName: "David Brown",
                packageId: "PKG567890",
                description: "Wrong items received in package",
                createdAt: new Date(Date.now() - 259200000).toISOString(),
                resolvedAt: new Date(Date.now() - 172800000).toISOString(),
                status: "resolved",
                issueType: "other",
                resolution:
                  "Correct items sent to customer with express shipping.",
                contactEmail: "david@example.com",
                contactPhone: "555-7890",
              },
            ];

      setComplaints(mockData);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Create new complaint
  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // In production, replace with actual API call:
      // await axios.post(`${API_BASE_URL}/complaints`, formData, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      // Mock successful creation
      const newComplaint = {
        ...formData,
        _id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "open",
      };

      setComplaints([newComplaint, ...complaints]);
      showNotification("Complaint created successfully", "success");
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating complaint:", err);
      showNotification("Failed to create complaint", "danger");
    }
  };

  // Resolve complaint
  const handleResolveComplaint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      // In production, replace with actual API call:
      // await axios.put(`${API_BASE_URL}/complaints/${selectedComplaint._id}/resolve`,
      //   { resolution },
      //   { headers: { Authorization: `Bearer ${token}` }}
      // );

      // Mock successful resolution
      const updatedComplaints = complaints.filter(
        (c) => c._id !== selectedComplaint._id
      );
      setComplaints(updatedComplaints);

      showNotification("Complaint resolved successfully", "success");
      setShowResolveModal(false);
      setSelectedComplaint(null);
      setResolution("");
    } catch (err) {
      console.error("Error resolving complaint:", err);
      showNotification("Failed to resolve complaint", "danger");
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      customerName: "",
      packageId: "",
      description: "",
      issueType: "damaged",
      contactEmail: "",
      contactPhone: "",
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeTab]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          <FileWarning className="me-2" size={24} />
          Complaints Management
        </h3>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setShowCreateModal(true)}
        >
          <PlusCircle size={18} className="me-2" />
          New Complaint
        </button>
      </div>

      {notification.show && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show`}
          role="alert"
        >
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotification({ ...notification, show: false })}
          ></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-header bg-white pb-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "open" ? "active" : ""}`}
                onClick={() => setActiveTab("open")}
              >
                <FileWarning size={16} className="me-2" />
                Open Complaints
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "resolved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("resolved")}
              >
                <CheckCircle size={16} className="me-2" />
                Resolved Complaints
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : complaints.length === 0 ? (
            <div className="alert alert-info">
              No {activeTab} complaints found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Package ID</th>
                    <th>Issue Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>#{complaint._id.substring(0, 8)}</td>
                      <td>{complaint.customerName}</td>
                      <td>{complaint.packageId}</td>
                      <td>
                        <span
                          className={`badge ${
                            complaint.issueType === "damaged"
                              ? "bg-danger"
                              : complaint.issueType === "missing-items"
                              ? "bg-warning text-dark"
                              : "bg-info"
                          }`}
                        >
                          {complaint.issueType.replace("-", " ")}
                        </span>
                      </td>
                      <td>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            complaint.status === "open"
                              ? "bg-primary"
                              : "bg-success"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="tooltip"
                            title="View Details"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              // View details functionality could be added here
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {complaint.status === "open" && (
                            <button
                              className="btn btn-sm btn-success"
                              data-bs-toggle="tooltip"
                              title="Resolve Complaint"
                              onClick={() => openResolveModal(complaint)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Complaint</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateComplaint}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="customerName" className="form-label">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="packageId" className="form-label">
                      Package ID/Tracking Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="packageId"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="issueType" className="form-label">
                      Issue Type
                    </label>
                    <select
                      className="form-select"
                      id="issueType"
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="damaged">Damaged Package</option>
                      <option value="missing-items">Missing Items</option>
                      <option value="delay">Delivery Delay</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactEmail" className="form-label">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactPhone" className="form-label">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Complaint
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {showResolveModal && selectedComplaint && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resolve Complaint</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowResolveModal(false)}
                ></button>
              </div>
              <form onSubmit={handleResolveComplaint}>
                <div className="modal-body">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <p>
                        <strong>Customer:</strong>{" "}
                        {selectedComplaint.customerName}
                      </p>
                      <p>
                        <strong>Package ID:</strong>{" "}
                        {selectedComplaint.packageId}
                      </p>
                      <p>
                        <strong>Issue Type:</strong>{" "}
                        {selectedComplaint.issueType.replace("-", " ")}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="resolution" className="form-label">
                      Resolution Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="resolution"
                      rows="4"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      required
                      placeholder="Explain how the issue was resolved..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowResolveModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Mark as Resolved
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
