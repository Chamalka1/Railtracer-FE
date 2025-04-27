import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import Barcode from "react-barcode";
import "./ParcelManagement.css";

const ParcelManagement = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    description: "",
    sourceStation: "",
    destinationStation: "",
  });

  const [parcels, setParcels] = useState([]);
  const [stations, setStations] = useState([]);
  const [showTracking, setShowTracking] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingParcel, setEditingParcel] = useState(null);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [selectedBarcodeParcel, setSelectedBarcodeParcel] = useState(null);

  useEffect(() => {
    fetchParcels();
    fetchStations();
  }, [currentPage]);

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/stations`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const fetchParcels = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/parcels`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          limit: 10,
        },
      });
      setParcels(response.data.data);
      setTotalPages(response.data.pagination.total);
    } catch (error) {
      console.error("Error fetching parcels:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/parcels`,
        {
          ...formData,
          dimensions: {
            length: parseFloat(formData.length),
            width: parseFloat(formData.width),
            height: parseFloat(formData.height),
          },
          weight: parseFloat(formData.weight),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSelectedParcel(response.data.data);
      setShowTracking(true);
      fetchParcels();

      // Clear form
      setFormData({
        customerName: "",
        customerPhone: "",
        customerEmail: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        description: "",
        sourceStation: "",
        destinationStation: "",
      });
    } catch (error) {
      console.error("Error creating parcel:", error);
      alert(error.response?.data?.message || "Failed to create parcel");
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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleEdit = (parcel) => {
    setEditingParcel({
      ...parcel,
      length: parcel.dimensions?.length || "",
      width: parcel.dimensions?.width || "",
      height: parcel.dimensions?.height || "",
    });
    setShowEditModal(true);
  };

  const handleDelete = async (parcelId) => {
    if (!window.confirm("Are you sure you want to delete this parcel?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE_URL}/parcels/${parcelId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchParcels(); // Refresh the list
      alert("Parcel deleted successfully");
    } catch (error) {
      console.error("Error deleting parcel:", error);
      alert(error.response?.data?.message || "Failed to delete parcel");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/parcels/${editingParcel._id}`,
        {
          ...editingParcel,
          dimensions: {
            length: parseFloat(editingParcel.length),
            width: parseFloat(editingParcel.width),
            height: parseFloat(editingParcel.height),
          },
          weight: parseFloat(editingParcel.weight),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowEditModal(false);
      fetchParcels(); // Refresh the list
      alert("Parcel updated successfully");
    } catch (error) {
      console.error("Error updating parcel:", error);
      alert(error.response?.data?.message || "Failed to update parcel");
    } finally {
      setLoading(false);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingParcel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewBarcode = (parcel) => {
    setSelectedBarcodeParcel(parcel);
    setShowBarcodeModal(true);
  };

  return (
    <div className="container my-4">
      <h4 className="mb-4">Parcel Management</h4>

      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Customer Details */}
              <div className="col-12">
                <h6 className="mb-3">Customer Details</h6>
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Parcel Details */}
              <div className="col-12">
                <h6 className="mb-3 mt-2">Parcel Details</h6>
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Weight (kg)</label>
                <input
                  type="number"
                  className="form-control"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Length (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Width (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Height (cm)</label>
                <input
                  type="number"
                  className="form-control"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                />
              </div>

              {/* Station Details */}
              <div className="col-12">
                <h6 className="mb-3 mt-2">Route Details</h6>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Source Station</label>
                <select
                  className="form-select"
                  name="sourceStation"
                  value={formData.sourceStation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Source Station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station.stationCode}>
                      {station.name} ({station.stationCode})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Destination Station</label>
                <select
                  className="form-select"
                  name="destinationStation"
                  value={formData.destinationStation}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Destination Station</option>
                  {stations.map((station) => (
                    <option key={station._id} value={station.stationCode}>
                      {station.name} ({station.stationCode})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Accept Parcel"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title mb-4">All Parcels</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer Name</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td>{parcel.trackingNumber}</td>
                    <td>{parcel.customerName}</td>
                    <td>{parcel.sourceStation}</td>
                    <td>{parcel.destinationStation}</td>
                    <td>
                      <span
                        className={`badge ${getStatusBadgeClass(
                          parcel.status
                        )}`}
                      >
                        {parcel.status}
                      </span>
                    </td>
                    <td>{new Date(parcel.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-info"
                          onClick={() => handleViewBarcode(parcel)}
                        >
                          Barcode
                        </button>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleEdit(parcel)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(parcel._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center mt-4">
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                </li>
                {[...Array(totalPages)].map((_, index) => (
                  <li
                    key={index + 1}
                    className={`page-item ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingParcel && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Parcel</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditSubmit}>
                  <div className="row">
                    {/* Customer Details */}
                    <div className="col-12">
                      <h6 className="mb-3">Customer Details</h6>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Customer Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="customerName"
                        value={editingParcel.customerName}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="customerPhone"
                        value={editingParcel.customerPhone}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="customerEmail"
                        value={editingParcel.customerEmail}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>

                    {/* Parcel Details */}
                    <div className="col-12">
                      <h6 className="mb-3">Parcel Details</h6>
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Weight (kg)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="weight"
                        value={editingParcel.weight}
                        onChange={handleEditInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Length (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="length"
                        value={editingParcel.length}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Width (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="width"
                        value={editingParcel.width}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label className="form-label">Height (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="height"
                        value={editingParcel.height}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    {/* Station Details */}
                    <div className="col-12">
                      <h6 className="mb-3">Route Details</h6>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Source Station</label>
                      <select
                        className="form-select"
                        name="sourceStation"
                        value={editingParcel.sourceStation}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="">Select Source Station</option>
                        {stations.map((station) => (
                          <option key={station._id} value={station.stationCode}>
                            {station.name} ({station.stationCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Destination Station</label>
                      <select
                        className="form-select"
                        name="destinationStation"
                        value={editingParcel.destinationStation}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="">Select Destination Station</option>
                        {stations.map((station) => (
                          <option key={station._id} value={station.stationCode}>
                            {station.name} ({station.stationCode})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        rows="4"
                        value={editingParcel.description}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="status"
                        value={editingParcel.status}
                        onChange={handleEditInputChange}
                        required
                      >
                        <option value="accepted">Accepted</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleEditSubmit}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tracking Number Modal */}
      {showTracking && selectedParcel && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Parcel Tracking Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTracking(false)}
                />
              </div>
              <div className="modal-body text-center">
                <h6 className="mb-4">
                  Tracking Number: {selectedParcel.trackingNumber}
                </h6>
                <p className="mb-3">
                  Share this tracking number with the customer to track their
                  parcel.
                </p>
                <div className="alert alert-info">
                  Tracking URL: {window.location.origin}/track/
                  {selectedParcel.trackingNumber}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTracking(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {showBarcodeModal && selectedBarcodeParcel && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Parcel Barcode</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowBarcodeModal(false)}
                />
              </div>
              <div className="modal-body text-center">
                <div className="mb-3">
                  <strong>Tracking Number:</strong>{" "}
                  {selectedBarcodeParcel.trackingNumber}
                </div>
                <div className="mb-3">
                  <strong>Customer:</strong>{" "}
                  {selectedBarcodeParcel.customerName}
                </div>
                <div
                  className="barcode-container"
                  style={{ overflowX: "auto" }}
                >
                  <Barcode
                    value={selectedBarcodeParcel.trackingNumber}
                    width={1.5}
                    height={50}
                    fontSize={14}
                    margin={10}
                    displayValue={true}
                  />
                </div>
                <button
                  className="btn btn-primary mt-3"
                  onClick={() => window.print()}
                >
                  Print Barcode
                </button>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBarcodeModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelManagement;
