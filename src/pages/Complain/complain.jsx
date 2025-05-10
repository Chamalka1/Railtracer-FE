import React, { useState, useEffect } from "react";
import axios from "axios";
import * as pdfMake from "pdfmake/build/pdfmake";

// Configure pdfMake
pdfMake.vfs = {};
pdfMake.fonts = {
  Roboto: {
    normal:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf",
    bold: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf",
    italics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf",
    bolditalics:
      "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf",
  },
};

export const Complain = () => {
  const API_BASE_URL = "http://localhost:5000/api/v1";
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = useState({
    customerName: "",
    packageId: "",
    description: "",
    issueType: "damaged",
    contactEmail: "",
    contactPhone: "",
  });
  const [resolution, setResolution] = useState("");
  const [activeTab, setActiveTab] = useState("open");

  // Report generation states
  const [reportType, setReportType] = useState("pdf");
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 30 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  // Fetch complaints from API
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Status mapping from frontend to backend
      const complainStatus =
        activeTab === "open" ? "SUMBITTED,IN_PROGRESS,PAUSED" : "SOLVED";

      // Fetch complaints from the API with proper pagination and status filter
      const response = await axios.get(
        `${API_BASE_URL}/complains?complainStatus=${complainStatus}&limit=100`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Process the response data
      if (response.data && response.data.response) {
        // The backend returns data in a different format, so we need to convert it
        const formattedComplaints = await Promise.all(
          response.data.response.map(async (complaint) => {
            // Try to get the parcel details to display the tracking number
            let trackingNumber = "Unknown";
            try {
              if (complaint.packageId) {
                const parcelResponse = await axios.get(
                  `${API_BASE_URL}/parcels/${complaint.packageId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (parcelResponse.data && parcelResponse.data.data) {
                  trackingNumber =
                    parcelResponse.data.data.trackingNumber || "Unknown";
                }
              }
            } catch (parcelError) {
              console.warn("Could not fetch parcel details:", parcelError);
            }

            // Convert backend format to frontend format
            return {
              _id: complaint._id,
              customerName: complaint.user?.name || "Unknown Customer",
              packageId: trackingNumber,
              description: complaint.discription || "",
              issueType: complaint.complainerCategory
                ? complaint.complainerCategory.toLowerCase()
                : "other",
              status:
                complaint.complainStatus === "SOLVED" ? "resolved" : "open",
              contactEmail: complaint.user?.email || "",
              contactPhone: complaint.user?.phonNumber || "",
              createdAt: complaint.createdAt || new Date().toISOString(),
              resolvedAt:
                complaint.complainStatus === "SOLVED"
                  ? complaint.updatedAt
                  : null,
              resolution:
                complaint.logs && complaint.logs.length > 0
                  ? complaint.logs[complaint.logs.length - 1].description
                  : "",
            };
          })
        );

        setComplaints(formattedComplaints);
      } else {
        // Handle empty or invalid response
        setComplaints([]);
        console.warn("API returned empty or invalid data", response);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setError("Failed to load complaints. Please try again.");
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // Create new complaint
  const handleCreateComplaint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      setLoading(true);

      // First, search for the parcel by tracking number to get its ObjectId
      let parcelObjectId;
      try {
        const parcelResponse = await axios.get(
          `${API_BASE_URL}/parcels?trackingNumber=${formData.packageId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (
          parcelResponse.data &&
          parcelResponse.data.data &&
          parcelResponse.data.data.length > 0
        ) {
          parcelObjectId = parcelResponse.data.data[0]._id;
        } else {
          throw new Error("Parcel not found with the provided tracking number");
        }
      } catch (parcelError) {
        console.error("Error finding parcel:", parcelError);
        showNotification(
          "Could not find a parcel with the provided tracking number. Please verify and try again.",
          "danger"
        );
        setLoading(false);
        return;
      }

      // Format data according to the backend's expected structure
      const complainData = {
        user: {
          name: formData.customerName,
          email: formData.contactEmail,
          phonNumber: formData.contactPhone,
        },
        packageId: parcelObjectId,
        complainerCategory: formData.issueType.toUpperCase(),
        discription: formData.description,
        complainStatus: "SUMBITTED",
      };

      // Perform the actual API call to create a complaint
      const response = await axios.post(
        `${API_BASE_URL}/complains`,
        complainData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // If the API call was successful, add the new complaint to the list
      if (response.data && response.data.response) {
        // Add the new complaint to the existing list and convert backend format to frontend format
        const newComplaint = {
          _id: response.data.response._id,
          customerName: formData.customerName,
          packageId: formData.packageId,
          description: formData.description,
          issueType: formData.issueType,
          status: "open",
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          createdAt: new Date().toISOString(),
        };

        setComplaints([newComplaint, ...complaints]);
        showNotification("Complaint created successfully", "success");
      } else {
        showNotification(
          "Created complaint but received unexpected response format",
          "warning"
        );
      }

      // Close the modal and reset the form
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error("Error creating complaint:", err);
      showNotification(
        err.response?.data?.error?.message || "Failed to create complaint",
        "danger"
      );
    } finally {
      setLoading(false);
    }
  };

  // Resolve complaint
  const handleResolveComplaint = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      setActionLoading(true);

      // Format the update data according to backend's expected structure
      const updateData = {
        id: selectedComplaint._id,
        complainStatus: "SOLVED",
        logs: [
          {
            date: new Date(),
            description: resolution,
          },
        ],
      };

      // Perform the actual API call to resolve a complaint
      await axios.put(`${API_BASE_URL}/complains`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the resolved complaint from the list of open complaints
      // or refetch the complaints if we're viewing resolved complaints
      if (activeTab === "open") {
        setComplaints(
          complaints.filter((c) => c._id !== selectedComplaint._id)
        );
      } else {
        // Refetch complaints to get the updated list with the newly resolved complaint
        fetchComplaints();
      }

      showNotification("Complaint resolved successfully", "success");
      setShowResolveModal(false);
      setSelectedComplaint(null);
      setResolution("");
    } catch (err) {
      console.error("Error resolving complaint:", err);
      showNotification(
        err.response?.data?.error?.message || "Failed to resolve complaint",
        "danger"
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Helper functions
  const resetForm = () => {
    setFormData({
      customerName: "",
      packageId: "",
      description: "",
      issueType: "damaged",
      contactEmail: "",
      contactPhone: "",
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openResolveModal = (complaint) => {
    setSelectedComplaint(complaint);
    setShowResolveModal(true);
  };

  // Report generation functions
  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateCSV = (data) => {
    // Define CSV headers
    const headers = [
      "ID",
      "Customer Name",
      "Package ID",
      "Issue Type",
      "Description",
      "Status",
      "Created Date",
      "Resolved Date",
      "Resolution",
      "Contact Email",
      "Contact Phone",
    ].join(",");

    // Safely access properties with null/undefined checks
    const safeGetString = (obj, path, defaultVal = "") => {
      if (!obj) return defaultVal;
      const parts = path.split(".");
      let current = obj;
      for (const part of parts) {
        if (current[part] === undefined || current[part] === null) {
          return defaultVal;
        }
        current = current[part];
      }
      return current.toString().replace(/"/g, '""');
    };

    const safeGetDate = (obj, prop) => {
      if (!obj || !obj[prop]) return "";
      try {
        return new Date(obj[prop]).toLocaleDateString();
      } catch (err) {
        return "";
      }
    };

    // Convert complaint data to CSV rows
    const rows = data.map((complaint) => {
      try {
        return [
          safeGetString(complaint, "_id"),
          `"${safeGetString(complaint, "customerName")}"`,
          safeGetString(complaint, "packageId"),
          safeGetString(complaint, "issueType"),
          `"${safeGetString(complaint, "description")}"`,
          safeGetString(complaint, "status"),
          safeGetDate(complaint, "createdAt"),
          safeGetDate(complaint, "resolvedAt"),
          complaint.resolution
            ? `"${safeGetString(complaint, "resolution")}"`
            : "",
          safeGetString(complaint, "contactEmail"),
          safeGetString(complaint, "contactPhone"),
        ].join(",");
      } catch (error) {
        console.error("Error processing complaint for CSV:", error, complaint);
        // Return a row with minimal info if there was an error
        return [
          safeGetString(complaint, "_id", "Error"),
          `"Error processing complaint data"`,
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
        ].join(",");
      }
    });

    // Combine headers and rows
    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (csvData, filename) => {
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generatePDF = (data) => {
    const title = `Complaints Report (${new Date(
      reportDateRange.startDate
    ).toLocaleDateString()} - ${new Date(
      reportDateRange.endDate
    ).toLocaleDateString()})`;

    // Safely access properties with null/undefined checks
    const safeGetString = (obj, path, defaultVal = "") => {
      if (!obj) return defaultVal;
      const parts = path.split(".");
      let current = obj;
      for (const part of parts) {
        if (current[part] === undefined || current[part] === null) {
          return defaultVal;
        }
        current = current[part];
      }
      return current.toString();
    };

    const safeGetDate = (obj, prop) => {
      if (!obj || !obj[prop]) return "N/A";
      try {
        return new Date(obj[prop]).toLocaleDateString();
      } catch (err) {
        return "Invalid date";
      }
    };

    // Group complaints by status for summary
    const complaintsStatus = {
      open: 0,
      resolved: 0,
      total: data.length,
    };

    data.forEach((complaint) => {
      const status = safeGetString(complaint, "status", "unknown");
      if (status === "open") complaintsStatus.open++;
      else if (status === "resolved") complaintsStatus.resolved++;
    });

    // Generate table data
    const tableBody = [
      [
        { text: "ID", style: "tableHeader" },
        { text: "Customer", style: "tableHeader" },
        { text: "Package ID", style: "tableHeader" },
        { text: "Issue Type", style: "tableHeader" },
        { text: "Status", style: "tableHeader" },
        { text: "Date", style: "tableHeader" },
      ],
    ];

    data.forEach((complaint) => {
      try {
        const id = safeGetString(complaint, "_id", "N/A");
        tableBody.push([
          id.substring(0, 8),
          safeGetString(complaint, "customerName", "N/A"),
          safeGetString(complaint, "packageId", "N/A"),
          safeGetString(complaint, "issueType", "other").replace("-", " "),
          safeGetString(complaint, "status", "unknown"),
          safeGetDate(complaint, "createdAt"),
        ]);
      } catch (error) {
        console.error("Error adding complaint to PDF table:", error);
        tableBody.push(["Error", "Error processing row", "", "", "", ""]);
      }
    });

    // Create content for the detail section
    const detailsContent = [{ text: "Complaint Details", style: "subheader" }];

    data.forEach((complaint, index) => {
      try {
        detailsContent.push(
          {
            text: `${index + 1}. ${safeGetString(
              complaint,
              "customerName",
              "Unknown Customer"
            )} (ID: ${safeGetString(complaint, "_id", "N/A").substring(0, 8)})`,
            style: "detailHeader",
          },
          {
            text: `Issue: ${safeGetString(
              complaint,
              "issueType",
              "other"
            ).replace("-", " ")}`,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Description: ${safeGetString(
              complaint,
              "description",
              "No description provided"
            )}`,
            margin: [0, 5, 0, 0],
          },
          safeGetString(complaint, "resolution")
            ? {
                text: `Resolution: ${safeGetString(complaint, "resolution")}`,
                margin: [0, 5, 0, 10],
              }
            : {
                text: "Status: Unresolved",
                margin: [0, 5, 0, 10],
              }
        );
      } catch (error) {
        console.error("Error processing complaint for PDF details:", error);
        // Add a simplified entry if there was an error
        detailsContent.push(
          {
            text: `${index + 1}. Error processing complaint details`,
            style: "detailHeader",
            color: "red",
          },
          {
            text: `ID: ${safeGetString(complaint, "_id", "N/A").substring(
              0,
              8
            )}`,
            margin: [0, 5, 0, 10],
          }
        );
      }
    });

    // Create status summary content
    const summaryTable = {
      style: "summaryTable",
      table: {
        widths: ["*", "auto"],
        body: [
          [
            { text: "Status", style: "tableHeader" },
            { text: "Count", style: "tableHeader" },
          ],
          ["Open Complaints", complaintsStatus.open.toString()],
          ["Resolved Complaints", complaintsStatus.resolved.toString()],
          ["Total Complaints", complaintsStatus.total.toString()],
        ],
      },
      layout: {
        hLineWidth: function (i, node) {
          return 1;
        },
        vLineWidth: function (i, node) {
          return 1;
        },
        hLineColor: function (i, node) {
          return "#dddddd";
        },
        vLineColor: function (i, node) {
          return "#dddddd";
        },
      },
    };

    const docDefinition = {
      content: [
        { text: "RailTracer Railway Management System", style: "companyName" },
        { text: title, style: "header" },
        { text: "Complaints Summary", style: "subheader" },
        summaryTable,
        { text: "Complaints List", style: "subheader", margin: [0, 15, 0, 5] },
        {
          style: "table",
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto"],
            body: tableBody,
          },
          layout: {
            hLineWidth: function (i, node) {
              return 1;
            },
            vLineWidth: function (i, node) {
              return 1;
            },
            hLineColor: function (i, node) {
              return "#dddddd";
            },
            vLineColor: function (i, node) {
              return "#dddddd";
            },
          },
        },
        {
          text: "Generated on: " + new Date().toLocaleString(),
          style: "footer",
        },
        { text: "", pageBreak: "before" },
        ...detailsContent,
      ],
      styles: {
        companyName: {
          fontSize: 16,
          bold: true,
          color: "#0d6efd",
          margin: [0, 0, 0, 5],
        },
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 5, 0, 5],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          color: "#212529",
          fillColor: "#f8f9fa",
        },
        table: {
          margin: [0, 5, 0, 15],
        },
        summaryTable: {
          margin: [0, 5, 0, 15],
          width: "50%",
        },
        footer: {
          fontSize: 10,
          italics: true,
          margin: [0, 10, 0, 0],
        },
        detailHeader: {
          fontSize: 13,
          bold: true,
          margin: [0, 10, 0, 5],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `complaints-report-${reportDateRange.startDate}-to-${reportDateRange.endDate}.pdf`
      );
  };

  // Function to fetch complaints for report generation
  const fetchComplaintsForReport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create date filters for the API query
      // Note: Backend may not support date range filtering, so we'll handle filtering in the frontend

      // Fetch complaints with different statuses
      const openResponse = await axios.get(
        `${API_BASE_URL}/complains?complainStatus=SUMBITTED,IN_PROGRESS,PAUSED`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const resolvedResponse = await axios.get(
        `${API_BASE_URL}/complains?complainStatus=SOLVED`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Process and combine the responses
      let allComplaints = [];

      if (openResponse.data && openResponse.data.response) {
        allComplaints = [...allComplaints, ...openResponse.data.response];
      }

      if (resolvedResponse.data && resolvedResponse.data.response) {
        allComplaints = [...allComplaints, ...resolvedResponse.data.response];
      }

      // Convert backend format to frontend format and filter by date range
      const startDate = new Date(reportDateRange.startDate);
      const endDate = new Date(reportDateRange.endDate);
      endDate.setHours(23, 59, 59, 999); // Include the entire end date

      // Format and filter the complaints
      const formattedComplaints = await Promise.all(
        allComplaints
          .filter((complaint) => {
            const createdAt = new Date(complaint.createdAt);
            return createdAt >= startDate && createdAt <= endDate;
          })
          .map(async (complaint) => {
            // Try to get the parcel details to display the tracking number
            let trackingNumber = "Unknown";
            try {
              if (complaint.packageId) {
                const parcelResponse = await axios.get(
                  `${API_BASE_URL}/parcels/${complaint.packageId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );

                if (parcelResponse.data && parcelResponse.data.data) {
                  trackingNumber =
                    parcelResponse.data.data.trackingNumber || "Unknown";
                }
              }
            } catch (parcelError) {
              console.warn(
                "Could not fetch parcel details for report:",
                parcelError
              );
            }

            // Convert backend format to frontend format
            return {
              _id: complaint._id,
              customerName: complaint.user?.name || "Unknown Customer",
              packageId: trackingNumber,
              description: complaint.discription || "",
              issueType: complaint.complainerCategory
                ? complaint.complainerCategory.toLowerCase()
                : "other",
              status:
                complaint.complainStatus === "SOLVED" ? "resolved" : "open",
              contactEmail: complaint.user?.email || "",
              contactPhone: complaint.user?.phonNumber || "",
              createdAt: complaint.createdAt || new Date().toISOString(),
              resolvedAt:
                complaint.complainStatus === "SOLVED"
                  ? complaint.updatedAt
                  : null,
              resolution:
                complaint.logs && complaint.logs.length > 0
                  ? complaint.logs[complaint.logs.length - 1].description
                  : "",
            };
          })
      );

      // Sort complaints by creation date (newest first)
      formattedComplaints.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      return formattedComplaints;
    } catch (error) {
      console.error("Error fetching complaints for report:", error);
      showNotification("Failed to fetch complaint data from API", "danger");
      throw error;
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);

    try {
      // Fetch complaints data for report instead of filtering the current state
      const complaintsData = await fetchComplaintsForReport();

      if (complaintsData.length === 0) {
        showNotification(
          "No complaints found in the selected date range",
          "warning"
        );
        setGeneratingReport(false);
        return;
      }

      if (reportType === "csv") {
        const csvData = generateCSV(complaintsData);
        const filename = `complaints_report_${reportDateRange.startDate}_to_${reportDateRange.endDate}.csv`;
        downloadCSV(csvData, filename);
        showNotification("CSV report downloaded successfully", "success");
      } else if (reportType === "pdf") {
        generatePDF(complaintsData);
        showNotification("PDF report downloaded successfully", "success");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      showNotification("Failed to generate report", "danger");
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [activeTab]);

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          <i className="bi bi-file-earmark-text me-2"></i>
          Complaints Management
        </h3>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary d-flex align-items-center"
            onClick={handleGenerateReport}
            disabled={generatingReport}
          >
            <i className="bi bi-download me-2"></i>
            Generate Report
          </button>
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            New Complaint
          </button>
        </div>
      </div>

      {notification.show && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show`}
          role="alert"
        >
          {notification.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setNotification({ ...notification, show: false })}
          ></button>
        </div>
      )}

      {/* Report Generation Card */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Generate Complaints Report</h5>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Report Format</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="pdf">PDF Report</option>
                <option value="csv">CSV Export</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={reportDateRange.startDate}
                onChange={handleReportInputChange}
                max={reportDateRange.endDate}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                name="endDate"
                value={reportDateRange.endDate}
                onChange={handleReportInputChange}
                min={reportDateRange.startDate}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">&nbsp;</label>
              <button
                className="btn btn-primary d-block w-100"
                onClick={handleGenerateReport}
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-download me-2"></i>
                    Download Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white pb-0">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "open" ? "active" : ""}`}
                onClick={() => setActiveTab("open")}
              >
                <i className="bi bi-exclamation-triangle me-2"></i>
                Open Complaints
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "resolved" ? "active" : ""
                }`}
                onClick={() => setActiveTab("resolved")}
              >
                <i className="bi bi-check-circle me-2"></i>
                Resolved Complaints
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center my-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : complaints.length === 0 ? (
            <div className="alert alert-info">
              No {activeTab} complaints found.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Package ID</th>
                    <th>Issue Type</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((complaint) => (
                    <tr key={complaint._id}>
                      <td>#{complaint._id.substring(0, 8)}</td>
                      <td>{complaint.customerName}</td>
                      <td>{complaint.packageId}</td>
                      <td>
                        <span
                          className={`badge ${
                            complaint.issueType === "damaged"
                              ? "bg-danger"
                              : complaint.issueType === "missing-items"
                              ? "bg-warning text-dark"
                              : "bg-info"
                          }`}
                        >
                          {complaint.issueType.replace("-", " ")}
                        </span>
                      </td>
                      <td>
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            complaint.status === "open"
                              ? "bg-primary"
                              : "bg-success"
                          }`}
                        >
                          {complaint.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            data-bs-toggle="tooltip"
                            title="View Details"
                            onClick={() => {
                              setSelectedComplaint(complaint);
                              // View details functionality could be added here
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {complaint.status === "open" && (
                            <button
                              className="btn btn-sm btn-success"
                              data-bs-toggle="tooltip"
                              title="Resolve Complaint"
                              onClick={() => openResolveModal(complaint)}
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Complaint Modal */}
      {showCreateModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create New Complaint</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateComplaint}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label htmlFor="customerName" className="form-label">
                      Customer Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="packageId" className="form-label">
                      Package ID/Tracking Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="packageId"
                      name="packageId"
                      value={formData.packageId}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="issueType" className="form-label">
                      Issue Type
                    </label>
                    <select
                      className="form-select"
                      id="issueType"
                      name="issueType"
                      value={formData.issueType}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="damaged">Damaged Package</option>
                      <option value="missing-items">Missing Items</option>
                      <option value="delay">Delivery Delay</option>
                      <option value="other">Other Issue</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      rows="3"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactEmail" className="form-label">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="contactPhone" className="form-label">
                        Contact Phone
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="contactPhone"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Complaint
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {showResolveModal && selectedComplaint && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Resolve Complaint</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowResolveModal(false)}
                ></button>
              </div>
              <form onSubmit={handleResolveComplaint}>
                <div className="modal-body">
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <p>
                        <strong>Customer:</strong>{" "}
                        {selectedComplaint.customerName}
                      </p>
                      <p>
                        <strong>Package ID:</strong>{" "}
                        {selectedComplaint.packageId}
                      </p>
                      <p>
                        <strong>Issue Type:</strong>{" "}
                        {selectedComplaint.issueType.replace("-", " ")}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {selectedComplaint.description}
                      </p>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="resolution" className="form-label">
                      Resolution Notes
                    </label>
                    <textarea
                      className="form-control"
                      id="resolution"
                      rows="4"
                      value={resolution}
                      onChange={(e) => setResolution(e.target.value)}
                      required
                      placeholder="Explain how the issue was resolved..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowResolveModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    Mark as Resolved
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
