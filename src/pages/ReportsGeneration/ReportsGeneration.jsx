import React from 'react';
import './ReportsGeneration.css'; 

const ReportsGeneration = () => {
  return (
    <div className="report-page">
      <h1>Summary Report</h1>
      
      <div className="filters">
        <div className="filter-item">
          <label htmlFor="dateFrom">Date Range:</label>
          <input type="date" id="dateFrom" name="from" />
          to
          <input type="date" id="dateTo" name="to" />
        </div>
        
        
      </div>


      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Station Name</th>
              <th>Warehouse Name</th>
              <th>Sorted parcels</th>
              <th>Damaged parcels</th>
              
              <th></th>
            </tr>
          </thead>
          <tbody>
            
            <tr>
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
              
            </tr>
            
          </tbody>
        </table>
      </div>

      
      <div className="filter-item">
      <input class="btn btn-primary" type="button" value="Submit"></input>
        </div>
      </div>
    
  );
};

export default ReportsGeneration;

