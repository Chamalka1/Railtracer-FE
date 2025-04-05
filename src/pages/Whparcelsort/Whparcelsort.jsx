import React from "react";
import "./Whparcelsort.css";

export const Whparcelsort = () => {
  return (
    <div className="container mt-4">
      <button className="btn btn-primary mb-3">Fetch Parcels</button>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Parcel ID</th>
            <th>Parcel Description</th>
            <th>To</th>
            <th>From</th>
            <th>Train Schedule</th>
            <th>Priority</th>
            <th>Parcel Status</th>
            <th>Parcel Size</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Parcel 1 Description</td>
            <td>Destination A</td>
            <td>Origin B</td>

            <td>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Train Schedule"
              />
            </td>
            <td>
              <select className="form-select">
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </td>
            <td>
              <select className="form-select">
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Dispatched">Dispatched</option>
              </select>
            </td>

            <td>
              <select className="form-select">
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </select>
            </td>

            <td>
              <button className="btn btn-success">Save</button>
            </td>
            <td>
              <button className="btn btn-warning">Edit</button>
            </td>
            <td>
              <button className="btn btn-danger">Delete</button>
            </td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
};
  

export default Whparcelsort;