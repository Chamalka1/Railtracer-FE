import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const TrainStation = () => {
  const [stations, setStations] = useState([]);
  const [editingStation, setEditingStation] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    stationCode: "",
    name: "",
    city: "",
    state: "",
    platforms: "",
    status: "operational",
    facilities: [],
  });

  const facilityOptions = [
    "Parking",
    "Food Court",
    "Waiting Room",
    "Ticket Counter",
    "Restrooms",
    "Medical Facility",
    "Luggage Storage",
    "WiFi",
  ];

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/v1/stations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("API Response:", response.data);
      setStations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Station fetch error:", error);
      toast.error("Failed to fetch stations");
      setStations([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const facilities = formData.facilities || [];
      if (e.target.checked) {
        setFormData({
          ...formData,
          facilities: [...facilities, value],
        });
      } else {
        setFormData({
          ...formData,
          facilities: facilities.filter((facility) => facility !== value),
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editingStation) {
        await axios.put(
          `http://localhost:5000/api/v1/stations/${editingStation._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Station updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/v1/stations", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Station added successfully");
      }

      setFormData({
        stationCode: "",
        name: "",
        city: "",
        state: "",
        platforms: "",
        status: "operational",
        facilities: [],
      });
      setEditingStation(null);
      setShowForm(false);
      fetchStations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    setFormData({
      stationCode: station.stationCode,
      name: station.name,
      city: station.city,
      state: station.state,
      platforms: station.platforms,
      status: station.status,
      facilities: station.facilities || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (stationId) => {
    if (!window.confirm("Are you sure you want to delete this station?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/stations/${stationId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Station deleted successfully");
      fetchStations();
    } catch (error) {
      toast.error("Failed to delete station");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{editingStation ? "Edit Station" : "Station Management"}</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingStation(null);
            setShowForm(!showForm);
            setFormData({
              stationCode: "",
              name: "",
              city: "",
              state: "",
              platforms: "",
              status: "operational",
              facilities: [],
            });
          }}
        >
          {showForm ? "Cancel" : "Add New Station"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Station Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="stationCode"
                    value={formData.stationCode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Station Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Number of Platforms</label>
                  <input
                    type="number"
                    className="form-control"
                    name="platforms"
                    value={formData.platforms}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="operational">Operational</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Facilities</label>
                  <div className="row g-3">
                    {facilityOptions.map((facility) => (
                      <div className="col-md-3" key={facility}>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={facility}
                            name="facilities"
                            value={facility}
                            checked={formData.facilities.includes(facility)}
                            onChange={handleInputChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor={facility}
                          >
                            {facility}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  {editingStation ? "Update Station" : "Add Station"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setShowForm(false);
                    setEditingStation(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Platforms</th>
                  <th>Status</th>
                  <th>Facilities</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(stations || []).map((station) => (
                  <tr key={station._id}>
                    <td>{station.stationCode}</td>
                    <td>{station.name}</td>
                    <td>{station.city}</td>
                    <td>{station.state}</td>
                    <td>{station.platforms}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          station.status === "operational"
                            ? "success"
                            : station.status === "maintenance"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {station.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ maxWidth: "200px" }}>
                        {station.facilities?.map((facility, index) => (
                          <span key={index} className="badge bg-info me-1 mb-1">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(station)}
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(station._id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
