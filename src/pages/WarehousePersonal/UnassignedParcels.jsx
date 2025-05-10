import React, { useState, useEffect } from "react";
import axios from "axios";

const UnassignedParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [trains, setTrains] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [assignLoading, setAssignLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const fetchUnassignedParcels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/parcels/unassigned?page=${page}&limit=10`,
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
      setError("Failed to fetch unassigned parcels. Please try again.");
      console.error("Error fetching unassigned parcels:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEligibleTrains = async (parcel) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/trains?source=${parcel.sourceStation}&destination=${parcel.destinationStation}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      return response.data;
    } catch (err) {
      console.error("Error fetching eligible trains:", err);
      showNotification("Failed to fetch eligible trains", "danger");
      return [];
    }
  };

  const handleOpenAssignModal = async (parcel) => {
    setSelectedParcel(parcel);
    setSelectedTrain("");
    setSelectedSchedule("");
    setSchedules([]);

    // Fetch eligible trains
    const eligibleTrains = await fetchEligibleTrains(parcel);
    console.log(eligibleTrains)
    setTrains(eligibleTrains);

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedParcel(null);
    setSelectedTrain("");
    setSelectedSchedule("");
    setSchedules([]);
  };

  const handleTrainChange = (e) => {
    const trainId = e.target.value;
    setSelectedTrain(trainId);
    setSelectedSchedule("");
    
    if (trainId) {
      // Find the selected train and get its schedules
      const train = trains.find(train => train._id === trainId);
      if (train && train.schedules && train.schedules.length > 0) {
        setSchedules(train.schedules);
      } else {
        setSchedules([]);
      }
    } else {
      setSchedules([]);
    }
  };

  const handleAssignParcel = async () => {
    if (!selectedTrain) {
      showNotification("Please select a train", "warning");
      return;
    }

    if (schedules.length > 0 && !selectedSchedule) {
      showNotification("Please select a schedule", "warning");
      return;
    }

    try {
      setAssignLoading(true);
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/v1/parcels/${selectedParcel._id}/assign`,
        { 
          trainId: selectedTrain,
          scheduleId: selectedSchedule || undefined 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      showNotification("Parcel successfully assigned to train", "success");

      // Refresh the list of unassigned parcels
      fetchUnassignedParcels();
      handleCloseModal();
    } catch (err) {
      console.error("Error assigning parcel to train:", err);
      showNotification(
        err.response?.data?.error || "Failed to assign parcel to train",
        "danger"
      );
    } finally {
      setAssignLoading(false);
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

  // Format time to display in a readable format
  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    
    try {
      // Convert 24-hour format to 12-hour format with AM/PM
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (err) {
      return timeString; // Return original string if parsing fails
    }
  };

  useEffect(() => {
    fetchUnassignedParcels();
  }, [page]);

  return (
    <div>
      <h5 className="mb-3">Unassigned Parcels</h5>

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
                  <th>Weight</th>
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
                    <td>{parcel.weight} kg</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => handleOpenAssignModal(parcel)}
                      >
                        <i className="bi bi-link me-1"></i> Assign to Train
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
          No unassigned parcels found.
        </div>
      )}

      {/* Assign to Train Modal */}
      {showModal && selectedParcel && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Assign Parcel to Train</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Parcel Details:</h6>
                  <p className="mb-1">
                    <strong>Tracking Number:</strong> {selectedParcel.trackingNumber}
                  </p>
                  <p className="mb-1">
                    <strong>Customer:</strong> {selectedParcel.customerName}
                  </p>
                  <p className="mb-1">
                    <strong>Source:</strong> {selectedParcel.sourceStation}
                  </p>
                  <p className="mb-1">
                    <strong>Destination:</strong> {selectedParcel.destinationStation}
                  </p>
                  <p className="mb-1">
                    <strong>Weight:</strong> {selectedParcel.weight} kg
                  </p>
                </div>

                <div className="form-group mt-3">
                  <label htmlFor="train-select" className="form-label">Select Train</label>
                  <select
                    id="train-select"
                    className="form-select"
                    value={selectedTrain}
                    onChange={handleTrainChange}
                  >
                    <option value="">-- Select a train --</option>
                    {trains && trains.length > 0 ? (
                      trains.map((train) => (
                        <option key={train._id} value={train._id}>
                          {train.trainNumber} - {train.name} ({train.source} to {train.destination})
                        </option>
                      ))
                    ) : (
                      <option disabled>No eligible trains available</option>
                    )}
                  </select>
                </div>

                {selectedTrain && schedules.length > 0 && (
                  <div className="form-group mt-3">
                    <label htmlFor="schedule-select" className="form-label">Select Schedule</label>
                    <select
                      id="schedule-select"
                      className="form-select"
                      value={selectedSchedule}
                      onChange={(e) => setSelectedSchedule(e.target.value)}
                    >
                      <option value="">-- Select a schedule --</option>
                      {schedules.map((schedule, index) => (
                        <option key={schedule._id || index} value={schedule._id || index}>
                          Departure: {formatTime(schedule.departureTime)} - Arrival: {formatTime(schedule.arrivalTime)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedTrain && schedules.length === 0 && (
                  <div className="alert alert-warning mt-3">
                    This train has no available schedules. You can still assign the parcel to this train.
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAssignParcel}
                  disabled={!selectedTrain || (schedules.length > 0 && !selectedSchedule) || assignLoading}
                >
                  {assignLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Assigning...
                    </>
                  ) : (
                    "Assign to Train"
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

export default UnassignedParcels;
