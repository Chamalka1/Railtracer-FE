import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTrains } from "../services/trainApi";
import { getStations } from "../services/stationApi";
import TrainScheduleReport from "../../components/TrainScheduleReport";

export const Train = () => {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editingTrain, setEditingTrain] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    trainNumber: "",
    name: "",
    type: "",
    capacity: "",
    source: "",
    destination: "",
    schedulePattern: "daily", // daily, weekends, or custom
    runningDays: [], // array of days when the train runs
    schedules: [
      {
        departureTime: "",
        arrivalTime: "",
      },
    ],
    status: "active",
    fare: "",
    amenities: [],
  });

  const trainTypes = ["Express", "Local", "Freight", "SuperFast", "Mail"];
  const schedulePatterns = [
    { value: "daily", label: "Daily" },
    { value: "weekends", label: "Weekends Only" },
    { value: "custom", label: "Custom Days" },
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    fetchTrains();
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
      setStations(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Station fetch error:", error);
      toast.error("Failed to fetch stations");
      setStations([]);
    }
  };

  const fetchTrains = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching trains..."); // Debug log
      const response = await axios.get("http://localhost:5000/api/v1/trains", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response.data); // Debug log
      setTrains(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Train fetch error:", error.response || error);
      toast.error(error.response?.data?.message || "Failed to fetch trains");
      setTrains([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (name === "schedulePattern") {
      let runningDays = [];
      if (value === "daily") {
        runningDays = [...daysOfWeek];
      } else if (value === "weekends") {
        runningDays = ["Saturday", "Sunday"];
      }
      setFormData({
        ...formData,
        schedulePattern: value,
        runningDays,
      });
    } else if (type === "checkbox") {
      const updatedDays = [...formData.runningDays];
      if (e.target.checked) {
        updatedDays.push(value);
      } else {
        const index = updatedDays.indexOf(value);
        if (index > -1) {
          updatedDays.splice(index, 1);
        }
      }
      setFormData({
        ...formData,
        runningDays: updatedDays,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updatedSchedules = [...formData.schedules];
    updatedSchedules[index] = {
      ...updatedSchedules[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      schedules: updatedSchedules,
    });
  };

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedules: [
        ...formData.schedules,
        {
          departureTime: "",
          arrivalTime: "",
        },
      ],
    });
  };

  const removeSchedule = (index) => {
    const updatedSchedules = [...formData.schedules];
    updatedSchedules.splice(index, 1);
    setFormData({
      ...formData,
      schedules: updatedSchedules,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      console.log("Submitting train data:", formData); // Debug log

      if (editingTrain) {
        await axios.put(
          `http://localhost:5000/api/v1/trains/${editingTrain._id}`,
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        toast.success("Train updated successfully");
      } else {
        await axios.post("http://localhost:5000/api/v1/trains", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Train added successfully");
      }

      setFormData({
        trainNumber: "",
        name: "",
        type: "",
        capacity: "",
        source: "",
        destination: "",
        schedulePattern: "daily",
        runningDays: [],
        schedules: [
          {
            departureTime: "",
            arrivalTime: "",
          },
        ],
        status: "active",
        fare: "",
        amenities: [],
      });
      setEditingTrain(null);
      setShowForm(false);
      fetchTrains();
    } catch (error) {
      console.error("Train submit error:", error.response || error); // Debug log
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (train) => {
    setEditingTrain(train);
    setFormData({
      trainNumber: train.trainNumber,
      name: train.name,
      type: train.type,
      capacity: train.capacity,
      source: train.source,
      destination: train.destination,
      schedulePattern: train.schedulePattern || "daily",
      runningDays: train.runningDays || [],
      schedules: train.schedules || [
        {
          departureTime: train.departureTime,
          arrivalTime: train.arrivalTime,
        },
      ],
      status: train.status,
      fare: train.fare || "",
      amenities: train.amenities || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (trainId) => {
    if (!window.confirm("Are you sure you want to delete this train?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/v1/trains/${trainId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Train deleted successfully");
      fetchTrains();
    } catch (error) {
      toast.error("Failed to delete train");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{editingTrain ? "Edit Train" : "Train Management"}</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            setEditingTrain(null);
            setShowForm(!showForm);
            setFormData({
              trainNumber: "",
              name: "",
              type: "",
              capacity: "",
              source: "",
              destination: "",
              schedulePattern: "daily",
              runningDays: [],
              schedules: [
                {
                  departureTime: "",
                  arrivalTime: "",
                },
              ],
              status: "active",
              fare: "",
              amenities: [],
            });
          }}
        >
          {showForm ? "Cancel" : "Add New Train"}
        </button>
      </div>

      <TrainScheduleReport trains={trains} />

      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Train Number</label>
                  <input
                    type="text"
                    className="form-control"
                    name="trainNumber"
                    value={formData.trainNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Train Name</label>
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
                  <label className="form-label">Type</label>
                  <select
                    className="form-select"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {trainTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Capacity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Source Station</label>
                  <select
                    className="form-select"
                    name="source"
                    value={formData.source}
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
                <div className="col-md-6">
                  <label className="form-label">Destination Station</label>
                  <select
                    className="form-select"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Destination Station</option>
                    {stations
                      .filter(
                        (station) => station.stationCode !== formData.source
                      )
                      .map((station) => (
                        <option key={station._id} value={station.stationCode}>
                          {station.name} ({station.stationCode})
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-md-12">
                  <label className="form-label">Schedule Pattern</label>
                  <select
                    className="form-select"
                    name="schedulePattern"
                    value={formData.schedulePattern}
                    onChange={handleInputChange}
                    required
                  >
                    {schedulePatterns.map((pattern) => (
                      <option key={pattern.value} value={pattern.value}>
                        {pattern.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.schedulePattern === "custom" && (
                  <div className="col-md-12">
                    <label className="form-label">Running Days</label>
                    <div className="row g-2">
                      {daysOfWeek.map((day) => (
                        <div key={day} className="col-auto">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id={`day-${day}`}
                              name="runningDays"
                              value={day}
                              checked={formData.runningDays.includes(day)}
                              onChange={handleInputChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`day-${day}`}
                            >
                              {day}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label">Train Schedules</label>
                  {formData.schedules.map((schedule, index) => (
                    <div key={index} className="row g-3 mb-3 align-items-end">
                      <div className="col-md-5">
                        <label className="form-label">Departure Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={schedule.departureTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "departureTime",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="col-md-5">
                        <label className="form-label">Arrival Time</label>
                        <input
                          type="time"
                          className="form-control"
                          value={schedule.arrivalTime}
                          onChange={(e) =>
                            handleScheduleChange(
                              index,
                              "arrivalTime",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div className="col-md-2">
                        {formData.schedules.length > 1 && (
                          <button
                            type="button"
                            className="btn btn-danger"
                            onClick={() => removeSchedule(index)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={addSchedule}
                  >
                    Add Another Schedule
                  </button>
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
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <button type="submit" className="btn btn-primary">
                  {editingTrain ? "Update Train" : "Add Train"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() => {
                    setShowForm(false);
                    setEditingTrain(null);
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
                  <th>Train Number</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>Schedule</th>
                  <th>Running Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trains && trains.length > 0 ? (
                  trains.map((train) => (
                    <tr key={train._id}>
                      <td>{train.trainNumber}</td>
                      <td>{train.name}</td>
                      <td>{train.type}</td>
                      <td>{train.source}</td>
                      <td>{train.destination}</td>
                      <td>
                        {train.schedules?.map((schedule, index) => (
                          <div key={index} className="mb-1">
                            {schedule.departureTime} - {schedule.arrivalTime}
                          </div>
                        ))}
                      </td>
                      <td>
                        {train.schedulePattern === "daily"
                          ? "Daily"
                          : train.schedulePattern === "weekends"
                          ? "Weekends Only"
                          : train.runningDays?.join(", ")}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${
                            train.status === "active"
                              ? "success"
                              : train.status === "inactive"
                              ? "danger"
                              : "warning"
                          }`}
                        >
                          {train.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(train)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(train._id)}
                        >
                          <i className="bi bi-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center">
                      No trains found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
