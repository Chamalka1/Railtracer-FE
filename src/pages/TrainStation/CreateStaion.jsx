import React, { useEffect, useState } from "react";
import { getStations, addStation } from "../services/stationApi";
import { Link } from "react-router-dom";

export const CreateStation = () => {
  const [stations, setStations] = useState([]);
  const [selectedStations, setSelectedStations] = useState([]);
  const [adjStationPrefix, setAdjStationPrefix] = useState("");
  const [formData, setFormData] = useState({
    stationName: "",
    stationAddress: "",
    stationContactNo: "",
    adjacentStations: [],
    warehouses: [],
  });

  useEffect(() => {
    getStations().then((data) => {
      setStations(data.response);
    });
  }, []);

  const removeSelection = (option) => {
    setSelectedStations((prev) => prev.filter((item) => item !== option));
  };

  const toggleSelection = (station) => {
    setSelectedStations((prev) =>
      prev.includes(station)
        ? prev.filter((item) => item !== station)
        : [...prev, station]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formData.adjacentStations = selectedStations.map((s) => {
      return { stationId: s._id, name: s.stationName };
    });
    addStation(formData).then((res) => {
      resetFields();
      console.log("created");
    });
  };

  const resetFields = (e) => {
    setFormData({
      stationName: "",
      stationAddress: "",
      stationContactNo: "",
      adjacentStations: "",
      warehouses: "",
    });
    setAdjStationPrefix("");
    setSelectedStations([]);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form className="row g-3 w-50 mx-auto" onSubmit={handleSubmit}>
      <div className="col-md-6">
        <label htmlFor="inputStationName" className="form-label">
          Station Name
        </label>
        <input
          type="text"
          className="form-control"
          id="inputStationName"
          name="stationName"
          value={formData.stationName}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="inputContactNo" className="form-label">
          Contact No:
        </label>
        <input
          type="text"
          className="form-control"
          id="inputContactNo"
          name="stationContactNo"
          value={formData.stationContactNo}
          onChange={handleChange}
        />
      </div>
      <div className="col-12">
        <label htmlFor="inputAddress" className="form-label">
          Address
        </label>
        <input
          type="text"
          className="form-control"
          id="inputAddress"
          placeholder="Address"
          name="stationAddress"
          value={formData.stationAddress}
          onChange={handleChange}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="adjStationName" className="form-label">
          Adjacent Stations
        </label>
        <input
          type="text"
          className="form-control"
          id="adjStationName"
          placeholder="adjacent station name"
          onChange={(e) => setAdjStationPrefix(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="adjStationName" className="form-label">
          Adjacent Stations
        </label>
        <div
          className="col-md-6 align-items-center"
          style={{ cursor: "pointer", minHeight: "38px" }}
        >
          {selectedStations.length === 0 ? (
            <span className="text-muted">Adjacent stations...</span>
          ) : (
            selectedStations.map((station, index) => (
              <span key={index} className="badge bg-primary me-1">
                {station.stationName}{" "}
                <button
                  type="button"
                  className="btn-close btn-close-white btn-sm ms-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelection(station);
                  }}
                ></button>
              </span>
            ))
          )}
        </div>
      </div>

      <div className="col-md-6 align-items-center">
        <div
          className="border rounded p-2 mt-2"
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            background: "#f8f9fa",
          }}
        >
          {stations
            .filter((s) =>
              s.stationName
                .toLowerCase()
                .startsWith(adjStationPrefix.toLowerCase())
            )
            .map((station, index) => (
              <label
                key={index}
                className="dropdown-item d-flex align-items-center"
              >
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={selectedStations.includes(station)}
                  onChange={() => toggleSelection(station)}
                />
                {station.stationName}
              </label>
            ))}
        </div>
      </div>

      <div className="col-12">
        <button
          type="submit"
          className="btn btn-primary me-2"
          style={{ width: "100px" }}
        >
          Submit
        </button>
        <Link
          className="btn btn-secondary"
          style={{ width: "100px" }}
          to="/stations"
        >
          Back
        </Link>
      </div>
    </form>
  );
};
