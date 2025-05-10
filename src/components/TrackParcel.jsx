import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./TrackParcel.css";
import TrackingNav from "./TrackingNav";

const TrackParcel = () => {
  const { trackingNumber: urlTrackingNumber } = useParams();
  const navigate = useNavigate();
  const [trackingNumber, setTrackingNumber] = useState(urlTrackingNumber || "");
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setTrackingNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError("Please enter a tracking number");
      return;
    }

    // Update URL with tracking number for sharing without triggering a page reload
    if (trackingNumber !== urlTrackingNumber) {
      navigate(`/track/${trackingNumber}`, { replace: true });
    }

    await fetchParcelDetails(trackingNumber);
  };

  const fetchParcelDetails = async (trackingNum) => {
    if (!trackingNum) return;

    setLoading(true);
    setError(null);
    setParcel(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/parcels/tracking/${trackingNum}`
      );
      setParcel(response.data.data);
    } catch (err) {
      console.error("Error fetching parcel:", err);
      setError(
        err.response?.data?.error ||
          "Parcel not found. Please check the tracking number."
      );
    } finally {
      setLoading(false);
    }
  };

  // Load parcel details if tracking number is in URL
  useEffect(() => {
    if (urlTrackingNumber) {
      fetchParcelDetails(urlTrackingNumber);
    }
  }, [urlTrackingNumber]);

  // Function to get the status index for progress calculation
  const getStatusIndex = (status) => {
    const statuses = [
      "accepted",
      "assigned",
      "in-transit",
      "reached-destination",
      "delivered",
    ];
    return statuses.indexOf(status);
  };

  // Function to calculate progress percentage based on status
  const calculateProgress = (status) => {
    const index = getStatusIndex(status);
    const totalStatuses = 5; // Total number of statuses
    return index >= 0 ? (index / (totalStatuses - 1)) * 100 : 0;
  };

  // Function to get appropriate status text for display
  const getStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Accepted";
      case "assigned":
        return "Assigned to Train";
      case "in-transit":
        return "In Transit";
      case "reached-destination":
        return "Reached Destination";
      case "delivered":
        return "Delivered";
      default:
        return "Unknown";
    }
  };

  // Function to get badge color based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-info";
      case "assigned":
        return "bg-primary";
      case "in-transit":
        return "bg-warning text-dark";
      case "reached-destination":
        return "bg-info text-dark";
      case "delivered":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  // Function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
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

  return (
    <>
      <TrackingNav />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Track Your Parcel</h2>

                <form onSubmit={handleSubmit} className="mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      placeholder="Enter your tracking number"
                      value={trackingNumber}
                      onChange={handleInputChange}
                      aria-label="Tracking Number"
                      required
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Tracking...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-search me-2"></i>Track
                        </>
                      )}
                    </button>
                  </div>
                  {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}
                </form>

                {parcel && (
                  <div className="tracking-result mt-4">
                    <div className="tracking-header mb-4">
                      <div className="row align-items-center">
                        <div className="col-md-6">
                          <h4 className="mb-1">
                            Tracking Number: {parcel.trackingNumber}
                          </h4>
                          <p className="text-muted mb-0">
                            Current Status:
                            <span
                              className={`badge ms-2 ${getStatusBadgeClass(
                                parcel.status
                              )}`}
                            >
                              {getStatusText(parcel.status)}
                            </span>
                          </p>
                        </div>
                        <div className="col-md-6 text-md-end">
                          <p className="mb-0">
                            <strong>Accepted Date:</strong>{" "}
                            {formatDate(parcel.createdAt)}
                          </p>
                          {parcel.deliveredAt && (
                            <p className="mb-0">
                              <strong>Delivered Date:</strong>{" "}
                              {formatDate(parcel.deliveredAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Tracker */}
                    <div className="tracking-progress mb-5">
                      <div className="progress" style={{ height: "8px" }}>
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{
                            width: `${calculateProgress(parcel.status)}%`,
                          }}
                          aria-valuenow={calculateProgress(parcel.status)}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>

                      <div className="position-relative mt-4">
                        <div className="row text-center">
                          <div className="col">
                            <div
                              className={`status-point ${
                                getStatusIndex(parcel.status) >= 0
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="bi bi-check-circle-fill"></i>
                            </div>
                            <p className="small mt-2">Accepted</p>
                          </div>
                          <div className="col">
                            <div
                              className={`status-point ${
                                getStatusIndex(parcel.status) >= 1
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="bi bi-train-front-fill"></i>
                            </div>
                            <p className="small mt-2">Assigned</p>
                          </div>
                          <div className="col">
                            <div
                              className={`status-point ${
                                getStatusIndex(parcel.status) >= 2
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="bi bi-truck"></i>
                            </div>
                            <p className="small mt-2">In Transit</p>
                          </div>
                          <div className="col">
                            <div
                              className={`status-point ${
                                getStatusIndex(parcel.status) >= 3
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="bi bi-geo-alt-fill"></i>
                            </div>
                            <p className="small mt-2">Destination</p>
                          </div>
                          <div className="col">
                            <div
                              className={`status-point ${
                                getStatusIndex(parcel.status) >= 4
                                  ? "active"
                                  : ""
                              }`}
                            >
                              <i className="bi bi-box-seam-fill"></i>
                            </div>
                            <p className="small mt-2">Delivered</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row g-4">
                      {/* Customer Information */}
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h5 className="card-title border-bottom pb-2">
                              <i className="bi bi-person-circle me-2"></i>
                              Customer Details
                            </h5>
                            <div className="mt-3">
                              <p className="mb-2">
                                <strong>Name:</strong> {parcel.customerName}
                              </p>
                              <p className="mb-2">
                                <strong>Phone:</strong> {parcel.customerPhone}
                              </p>
                              <p className="mb-0">
                                <strong>Email:</strong> {parcel.customerEmail}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Parcel Information */}
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h5 className="card-title border-bottom pb-2">
                              <i className="bi bi-box me-2"></i>Parcel Details
                            </h5>
                            <div className="mt-3">
                              <p className="mb-2">
                                <strong>Weight:</strong> {parcel.weight} kg
                              </p>
                              {parcel.dimensions && (
                                <p className="mb-2">
                                  <strong>Dimensions:</strong>{" "}
                                  {parcel.dimensions.length}×
                                  {parcel.dimensions.width}×
                                  {parcel.dimensions.height} cm
                                </p>
                              )}
                              {parcel.description && (
                                <p className="mb-0">
                                  <strong>Description:</strong>{" "}
                                  {parcel.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Route Information */}
                      <div className="col-md-6">
                        <div className="card border-0 bg-light h-100">
                          <div className="card-body">
                            <h5 className="card-title border-bottom pb-2">
                              <i className="bi bi-geo-alt me-2"></i>Route
                              Information
                            </h5>
                            <div className="mt-3">
                              <div className="d-flex justify-content-between route-path mb-3">
                                <div className="text-center">
                                  <span className="badge bg-danger p-2 rounded-circle">
                                    <i className="bi bi-geo-alt-fill"></i>
                                  </span>
                                  <p className="mt-2 mb-0">
                                    {parcel.sourceStation}
                                  </p>
                                  <small className="text-muted">Source</small>
                                </div>
                                <div className="route-line flex-grow-1 align-self-center mx-2"></div>
                                <div className="text-center">
                                  <span className="badge bg-success p-2 rounded-circle">
                                    <i className="bi bi-geo-alt-fill"></i>
                                  </span>
                                  <p className="mt-2 mb-0">
                                    {parcel.destinationStation}
                                  </p>
                                  <small className="text-muted">
                                    Destination
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Train and Schedule Information */}
                      {parcel.assignedTrain && (
                        <div className="col-md-6">
                          <div className="card border-0 bg-light h-100">
                            <div className="card-body">
                              <h5 className="card-title border-bottom pb-2">
                                <i className="bi bi-train-front me-2"></i>
                                Transport Details
                              </h5>
                              <div className="mt-3">
                                <p className="mb-2">
                                  <strong>Train:</strong>{" "}
                                  {parcel.assignedTrain.trainNumber} -{" "}
                                  {parcel.assignedTrain.name}
                                </p>
                                <p className="mb-2">
                                  <strong>Assigned:</strong>{" "}
                                  {formatDate(parcel.assignedAt)}
                                </p>
                                {parcel.assignedSchedule && (
                                  <p className="mb-0">
                                    <strong>Schedule:</strong> Departure:{" "}
                                    {formatTime(
                                      parcel.assignedSchedule.departureTime
                                    )}
                                    , Arrival:{" "}
                                    {formatTime(
                                      parcel.assignedSchedule.arrivalTime
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Timeline/History */}
                    <div className="tracking-timeline mt-4">
                      <h5 className="border-bottom pb-2">Tracking History</h5>
                      <div className="timeline mt-4">
                        {parcel.deliveredAt && (
                          <div className="timeline-item">
                            <div className="timeline-point">
                              <i className="bi bi-check-circle-fill text-success"></i>
                            </div>
                            <div className="timeline-content">
                              <h6 className="mb-0">Delivered</h6>
                              <p className="text-muted small mb-0">
                                {formatDate(parcel.deliveredAt)}
                              </p>
                              <p>Parcel has been delivered successfully.</p>
                            </div>
                          </div>
                        )}

                        {parcel.reachedDestinationAt && (
                          <div className="timeline-item">
                            <div className="timeline-point">
                              <i className="bi bi-geo-alt-fill text-info"></i>
                            </div>
                            <div className="timeline-content">
                              <h6 className="mb-0">Reached Destination</h6>
                              <p className="text-muted small mb-0">
                                {formatDate(parcel.reachedDestinationAt)}
                              </p>
                              <p>
                                Parcel has arrived at{" "}
                                {parcel.destinationStation} station.
                              </p>
                            </div>
                          </div>
                        )}

                        {parcel.status === "in-transit" && (
                          <div className="timeline-item">
                            <div className="timeline-point">
                              <i className="bi bi-truck text-warning"></i>
                            </div>
                            <div className="timeline-content">
                              <h6 className="mb-0">In Transit</h6>
                              <p className="text-muted small mb-0">
                                {formatDate(parcel.updatedAt)}
                              </p>
                              <p>
                                Parcel is in transit from {parcel.sourceStation}{" "}
                                to {parcel.destinationStation}.
                              </p>
                            </div>
                          </div>
                        )}

                        {parcel.assignedAt && (
                          <div className="timeline-item">
                            <div className="timeline-point">
                              <i className="bi bi-train-front-fill text-primary"></i>
                            </div>
                            <div className="timeline-content">
                              <h6 className="mb-0">Assigned to Train</h6>
                              <p className="text-muted small mb-0">
                                {formatDate(parcel.assignedAt)}
                              </p>
                              {parcel.assignedTrain && (
                                <p>
                                  Parcel assigned to train:{" "}
                                  {parcel.assignedTrain.trainNumber} -{" "}
                                  {parcel.assignedTrain.name}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="timeline-item">
                          <div className="timeline-point">
                            <i className="bi bi-box-seam text-info"></i>
                          </div>
                          <div className="timeline-content">
                            <h6 className="mb-0">Parcel Accepted</h6>
                            <p className="text-muted small mb-0">
                              {formatDate(parcel.createdAt)}
                            </p>
                            <p>
                              Parcel has been accepted at {parcel.sourceStation}{" "}
                              station.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TrackParcel;
