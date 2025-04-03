import React from 'react';
import './ReportsGeneration.css'; 

const ReportPage = () => {
  return (
    <div className="report-page">
      <h1>Parcel Sorting Report</h1>
      
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="dateFrom">Date Range:</label>
          <input type="date" id="dateFrom" name="from" />
          to
          <input type="date" id="dateTo" name="to" />
        </div>
        
        <div className="filter-item">
          <button className="generate-btn">Generate Report</button>
        </div>
      </div>

      {/* Report Table */}
      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Parcel ID</th>
              <th>Destination</th>
              <th>Train Number</th>
              <th>Priority</th>
              <th>Size</th>
              <th>Status</th>
              <th>Zone</th>
              <th>Date Sorted</th>
              <th>Assigned Personnel</th>
            </tr>
          </thead>
          <tbody>
            {/* Example rows, this would be dynamically rendered */}
            <tr>
              <td>1</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
            {/* Add more rows as necessary */}
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button className="export-btn">Export to PDF</button>
        {/* More export buttons as needed */}
      </div>
    </div>
  );
};

export default ReportPage;

