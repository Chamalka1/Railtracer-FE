import React, { useState, useEffect } from "react";
import axios from "axios";

const InTransitParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const fetchInTransitParcels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/parcels/status/in-transit?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParcels(response.data.data);
      setTotalPages(response.data.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch in-transit parcels. Please try again.");
      console.error("Error fetching in-transit parcels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenConfirmModal = (parcel) => {
    setSelectedParcel(parcel);
    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    setShowConfirmModal(false);
    setSelectedParcel(null);
  };

  const handleUpdateToReachedDestination = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/parcels/${selectedParcel._id}/reached-destination`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("Parcel successfully marked as reached destination", "success");

      // Refresh the list of in-transit parcels
      fetchInTransitParcels();
      handleCloseConfirmModal();
    } catch (err) {
      console.error("Error updating parcel status:", err);
      showNotification(
        err.response?.data?.error || "Failed to update parcel status",
        "danger"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    
    // Auto hide after 5 seconds
    setTimeout(() => {
      setNotification(prev => ({...prev, show: false}));
    }, 5000);
  };

  useEffect(() => {
    fetchInTransitParcels();
  }, [page]);

  return (
    <div>
      <h5 className="mb-3">In-Transit Parcels</h5>

      {notification.show && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show`} role="alert">
          {notification.message}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setNotification(prev => ({...prev, show: false}))}
          ></button>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : parcels.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer Name</th>
                  <th>Source Station</th>
                  <th>Destination Station</th>
                  <th>Assigned Train</th>
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
                      {parcel.assignedTrain
                        ? `${parcel.assignedTrain.trainNumber} - ${parcel.assignedTrain.name}`
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() => handleOpenConfirmModal(parcel)}
                      >
                        <i className="bi bi-geo-alt me-1"></i> Mark as Reached Destination
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Parcel pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${page === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleChangePage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="alert alert-info">
          No in-transit parcels found.
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedParcel && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mark Parcel as Reached Destination</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseConfirmModal}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to update this parcel's status to "Reached Destination"? 
                  This indicates that the parcel has arrived at the destination station.
                </p>
                {selectedParcel && (
                  <div className="card bg-light p-3 mt-3">
                    <p className="mb-1">
                      <strong>Tracking Number:</strong> {selectedParcel.trackingNumber}
                    </p>
                    <p className="mb-0">
                      <strong>Destination:</strong> {selectedParcel.destinationStation}
                    </p>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseConfirmModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleUpdateToReachedDestination}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InTransitParcels;
