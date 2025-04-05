import React from "react";
import './WhComplains.css'; 

export const WhComplains = () => {
    return(
        <div className="complaint-form-container">
      <h2>Submit a Complaint</h2>
      <form>
        <div className="form-group">
          <label htmlFor="complaintID">Complaint ID</label>
          <input type="text" id="complaintID" required />
        </div>

        <div className="form-group">
          <label htmlFor="parcelID">Parcel ID</label>
          <input type="text" id="parcelID" required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Complaint Description</label>
          <textarea id="description" required />
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" required />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" required>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select id="status" required>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">Submit Complaint</button>
      </form>
    </div>
  );
};

export default WhComplains;

      
    
