import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TrackingPage = () => {
  const { trackingNumber } = useParams();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParcelDetails();
  }, [trackingNumber]);

  const fetchParcelDetails = async () => {
    try {
      const response = await axios.get(
        `/api/parcels/tracking/${trackingNumber}`
      );
      setParcel(response.data.data);
      setError(null);
    } catch (error) {
      setError("Parcel not found or error fetching details");
      console.error("Error fetching parcel:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      </div>
    );
  }

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

  return (
    <div className="container my-4">
      <h4 className="text-center mb-4">Parcel Tracking Details</h4>

      <div className="card">
        <div className="card-body">
          <div className="mb-4">
            <h5 className="card-title mb-3">
              Tracking Number: {trackingNumber}
            </h5>
            <span className={`badge ${getStatusBadgeClass(parcel.status)}`}>
              {parcel.status.toUpperCase()}
            </span>
          </div>

          <hr />

          <div className="row g-4">
            {/* Customer Information */}
            <div className="col-12">
              <h6 className="mb-3">Customer Information</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-person me-2"></i>
                    <span>{parcel.customerName}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-telephone me-2"></i>
                    <span>{parcel.customerPhone}</span>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-envelope me-2"></i>
                    <span>{parcel.customerEmail}</span>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Route Information */}
            <div className="col-12">
              <h6 className="mb-3">Route Information</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt text-danger me-2"></i>
                    <div>
                      <small className="text-muted d-block">From</small>
                      <span>{parcel.sourceStation}</span>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-geo-alt text-success me-2"></i>
                    <div>
                      <small className="text-muted d-block">To</small>
                      <span>{parcel.destinationStation}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* Parcel Information */}
            <div className="col-12">
              <h6 className="mb-3">Parcel Information</h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-box me-2"></i>
                    <span>Weight: {parcel.weight} kg</span>
                  </div>
                </div>
                {parcel.dimensions && (
                  <div className="col-md-6">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-rulers me-2"></i>
                      <span>
                        Dimensions: {parcel.dimensions.length}x
                        {parcel.dimensions.width}x{parcel.dimensions.height} cm
                      </span>
                    </div>
                  </div>
                )}
                {parcel.description && (
                  <div className="col-12">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-card-text me-2"></i>
                      <span>{parcel.description}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingPage;
