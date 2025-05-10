import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MiniTracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      navigate(`/track/${trackingNumber}`);
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h5 className="card-title mb-3 text-center">
          <i className="bi bi-search me-2"></i>
          Track Your Parcel
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter tracking number"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              aria-label="Tracking Number"
              required
            />
            <button className="btn btn-primary" type="submit">
              <i className="bi bi-box-seam me-1"></i> Track
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MiniTracking;
