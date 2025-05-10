import React, { useState } from "react";
import UnassignedParcels from "./UnassignedParcels";
import AssignedParcels from "./AssignedParcels";
import InTransitParcels from "./InTransitParcels";
import ReachedDestinationParcels from "./ReachedDestinationParcels";
import DeliveredParcels from "./DeliveredParcels";

const WarehouseDashboard = () => {
  const [activeTab, setActiveTab] = useState("unassigned");

  const renderTabContent = () => {
    switch (activeTab) {
      case "unassigned":
        return <UnassignedParcels />;
      case "assigned":
        return <AssignedParcels />;
      case "in-transit":
        return <InTransitParcels />;
      case "reached-destination":
        return <ReachedDestinationParcels />;
      case "delivered":
        return <DeliveredParcels />;
      default:
        return <UnassignedParcels />;
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Warehouse Dashboard</h2>

      <div className="card shadow-sm">
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "unassigned" ? "active" : ""
                }`}
                onClick={() => setActiveTab("unassigned")}
              >
                <i className="bi bi-box me-2"></i>
                Unassigned Parcels
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "assigned" ? "active" : ""
                }`}
                onClick={() => setActiveTab("assigned")}
              >
                <i className="bi bi-bookmark-check me-2"></i>
                Assigned to Train
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "in-transit" ? "active" : ""
                }`}
                onClick={() => setActiveTab("in-transit")}
              >
                <i className="bi bi-train-front me-2"></i>
                In Transit
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "reached-destination" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reached-destination")}
              >
                <i className="bi bi-geo-alt me-2"></i>
                Reached Destination
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "delivered" ? "active" : ""
                }`}
                onClick={() => setActiveTab("delivered")}
              >
                <i className="bi bi-check-circle me-2"></i>
                Delivered
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
