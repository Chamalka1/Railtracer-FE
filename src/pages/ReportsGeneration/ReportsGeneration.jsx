import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jsPDF } from 'jspdf';

const ReportsGeneration = () => {
  const [formData, setFormData] = useState({
    reportDate: '',
    warehouseName: '',
    stationName: '',
    submittedBy: '',
    arrived: '',
    dispatched: '',
    sorted: '',
    damaged: '',
    unsorted: '',
    arrivedTime: '',
    dispatchedTime: '',
    remarks: ''
  });

  const [previewData, setPreviewData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportList, setReportList] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Fetch Reports - Defined the function getReports
  const getReports = async () => {
    try {
      // Replace the URL with your backend API endpoint that fetches the reports
      const response = await axios.get('http://localhost:5000/api/reports');
      return response.data; // Return the data fetched from API
    } catch (error) {
      console.error('Error fetching reports:', error);
      return []; // Return an empty array in case of an error
    }
  };

  // Fetch reports when component mounts
  const fetchReports = async () => {
    try {
      const reports = await getReports();
      setReportList(reports); // Update the report list state with fetched reports
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  useEffect(() => {
    fetchReports(); // Fetch reports when component loads
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value
    }));
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = [
      'reportDate', 'warehouseName', 'stationName', 'submittedBy',
      'arrived', 'dispatched', 'sorted', 'damaged'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        errors[field] = 'This field is required.';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/reports', formData);
      alert('Report submitted successfully!');
      setFormData({
        reportDate: '',
        warehouseName: '',
        stationName: '',
        submittedBy: '',
        arrived: '',
        dispatched: '',
        sorted: '',
        damaged: '',
        unsorted: '',
        arrivedTime: '',
        dispatchedTime: '',
        remarks: ''
      });
      setPreviewData(null);
      fetchReports(); // Refresh the report list
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Submission failed!');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (!validateForm()) {
      alert('Please fix validation errors before previewing.');
      return;
    }
    setPreviewData(formData); // Set the form data for preview
  };

  // Function to generate PDF (defined the generatePDF function)
  const generatePDF = (data) => {
    const doc = new jsPDF();
    doc.text('Warehouse Daily Log Report', 10, 10);

    let y = 20;
    Object.entries(data).forEach(([key, value]) => {
      doc.text(`${key}: ${value}`, 10, y);
      y += 10;
    });

    doc.save('report.pdf'); // Save the generated PDF
  };

  const handleGeneratePDF = () => {
    if (previewData) {
      generatePDF(previewData); // Generate PDF from preview data
    } else {
      alert('Preview data not available!');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Warehouse Daily Log Report</h2>

      <form className="needs-validation" noValidate onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="reportDate" className="form-label">
              Report Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className={`form-control ${formErrors.reportDate ? 'is-invalid' : ''}`}
              id="reportDate"
              value={formData.reportDate}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{formErrors.reportDate}</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="warehouseName" className="form-label">
              Warehouse Name <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${formErrors.warehouseName ? 'is-invalid' : ''}`}
              id="warehouseName"
              value={formData.warehouseName}
              onChange={handleInputChange}
            >
              <option value="">Select Warehouse</option>
              <option value="Warehouse A">Warehouse A</option>
              <option value="Warehouse B">Warehouse B</option>
              <option value="Warehouse C">Warehouse C</option>
            </select>
            <div className="invalid-feedback">{formErrors.warehouseName}</div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="stationName" className="form-label">
              Station Name <span className="text-danger">*</span>
            </label>
            <select
              className={`form-select ${formErrors.stationName ? 'is-invalid' : ''}`}
              id="stationName"
              value={formData.stationName}
              onChange={handleInputChange}
            >
              <option value="">Select Station</option>
              <option value="Colombo">Colombo</option>
              <option value="Fort">Fort</option>
              <option value="Nugegoda">Nugegoda</option>
              <option value="Jaffna">Jaffna</option>
            </select>
            <div className="invalid-feedback">{formErrors.stationName}</div>
          </div>

          <div className="col-md-6">
            <label htmlFor="submittedBy" className="form-label">
              Submitted By <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={`form-control ${formErrors.submittedBy ? 'is-invalid' : ''}`}
              id="submittedBy"
              value={formData.submittedBy}
              onChange={handleInputChange}
              placeholder="Your name or ID"
            />
            <div className="invalid-feedback">{formErrors.submittedBy}</div>
          </div>
        </div>

        {/* Parcel Summary Section */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="arrived" className="form-label">Arrived</label>
            <input
              type="number"
              className="form-control"
              id="arrived"
              value={formData.arrived}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="dispatched" className="form-label">Dispatched</label>
            <input
              type="number"
              className="form-control"
              id="dispatched"
              value={formData.dispatched}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="sorted" className="form-label">Sorted</label>
            <input
              type="number"
              className="form-control"
              id="sorted"
              value={formData.sorted}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="damaged" className="form-label">Damaged</label>
            <input
              type="number"
              className="form-control"
              id="damaged"
              value={formData.damaged}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Remarks Section */}
        <div className="row mb-3">
          <div className="col-md-12">
            <label htmlFor="remarks" className="form-label">Remarks</label>
            <textarea
              className="form-control"
              id="remarks"
              value={formData.remarks}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Parcel Time Log */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="arrivedTime" className="form-label">Arrived Time</label>
            <input
              type="time"
              className="form-control"
              id="arrivedTime"
              value={formData.arrivedTime}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="dispatchedTime" className="form-label">Dispatched Time</label>
            <input
              type="time"
              className="form-control"
              id="dispatchedTime"
              value={formData.dispatchedTime}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="text-center mb-4">
          <button type="button" className="btn btn-primary me-2" onClick={handlePreview}>
            Preview
          </button>
          <button type="submit" className="btn btn-success me-2" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
          <button type="button" className="btn btn-danger" onClick={handleGeneratePDF}>
            Export as PDF
          </button>
        </div>
      </form>

      {previewData && (
        <div className="mt-5">
          <h4>Preview</h4>
          <table className="table table-bordered">
            <tbody>
              {Object.entries(previewData).map(([key, value]) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{value || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h4 className="mt-5">Previous Reports</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Warehouse</th>
            <th>Station</th>
            <th>Arrived</th>
            <th>Dispatched</th>
            <th>Sorted</th>
            <th>Damaged</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reportList.map((report) => (
            <tr key={report._id}>
              <td>{report.reportDate}</td>
              <td>{report.warehouseName}</td>
              <td>{report.stationName}</td>
              <td>{report.arrived}</td>
              <td>{report.dispatched}</td>
              <td>{report.sorted}</td>
              <td>{report.damaged}</td>
              <td>
                {/* You can add action buttons like view/edit/delete */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsGeneration;
