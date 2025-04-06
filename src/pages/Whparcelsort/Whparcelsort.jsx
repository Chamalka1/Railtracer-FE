import React from "react";
import "./Whparcelsort.css";

export const Whparcelsort = () => {
  return (
    <div className="container mt-4">
     
      <h3 className="mb-4">Warehouse Log</h3>

      <button className="btn btn-primary mb-3">Fetch Parcels</button>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Parcel ID</th>
            <th>Parcel Description</th>
            <th>To</th>
            <th>From</th>
            <th>Warehouse Name</th>
            <th>Train Schedule</th>
            <th>Priority</th>
            <th>Parcel Status</th>
            <th>Parcel Size</th>
            <th>Station Name</th>
            <th>Arrived Time</th>
            <th>Dispatched Time</th>
            <th>Damage Status</th>
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
              <select className="form-select">
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Warehouse C">Warehouse C</option>
              </select>
            </td>

            <td>
              <select className="form-select">
                <option value="Train A">Train A</option>
                <option value="Train B">Train B</option>
                <option value="Train C">Train C</option>
              </select>
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
              <select className="form-select">
                <option value="Station A">Station A</option>
                <option value="Station B">Station B</option>
                <option value="Station C">Station C</option>
              </select>
            </td>

            
            <td>
              <input
                type="time"
                className="form-control"
                placeholder="Arrived Time"
              />
            </td>

            
            <td>
              <input
                type="time"
                className="form-control"
                placeholder="Dispatched Time"
              />
            </td>

            
            <td>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="damageStatus1"
                  value="Damaged"
                  id="damageDamaged1"
                />
                <label className="form-check-label" htmlFor="damageDamaged1">
                  Yes
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="damageStatus1"
                  value="Not Damaged"
                  id="damageNotDamaged1"
                />
                <label className="form-check-label" htmlFor="damageNotDamaged1">
                  No 
                </label>
              </div>
            </td>

            
            <td>
            <input class="btn btn-primary" type="button" value="Save"></input>
            <input class="btn btn-primary" type="button" value="Edit"></input>
            <input class="btn btn-primary" type="button" value="Delete"></input>
            </td>
          </tr>
      </tbody>
      </table>
    </div>
  );};

export default Whparcelsort;
