import React, { useState } from "react";
import * as pdfMake from "pdfmake/build/pdfmake";
import UnassignedParcels from "./UnassignedParcels";
import AssignedParcels from "./AssignedParcels";
import InTransitParcels from "./InTransitParcels";
import ReachedDestinationParcels from "./ReachedDestinationParcels";
import DeliveredParcels from "./DeliveredParcels";
import axios from "axios";

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

const WarehouseDashboard = () => {
  const [activeTab, setActiveTab] = useState("unassigned");

  // Report generation states
  const [reportType, setReportType] = useState("pdf");
  const [reportDateRange, setReportDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0], // 7 days ago
    endDate: new Date().toISOString().split("T")[0], // today
  });
  const [generatingReport, setGeneratingReport] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case "unassigned":
        return <UnassignedParcels />;
      case "assigned":
        return <AssignedParcels />;
      case "in-transit":
        return <InTransitParcels />;
      case "reached-destination":
        return <ReachedDestinationParcels />;
      case "delivered":
        return <DeliveredParcels />;
      default:
        return <UnassignedParcels />;
    }
  };

  // Report generation functions
  const handleReportInputChange = (e) => {
    const { name, value } = e.target;
    setReportDateRange((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to fetch parcels for report generation from API
  const fetchParcelsForReport = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      // Create date filters for the API query
      const dateFilters = `startDate=${reportDateRange.startDate}&endDate=${reportDateRange.endDate}`;

      // Fetch all parcel statuses for the report
      const responses = await Promise.all([
        axios.get(
          `http://localhost:5000/api/v1/parcels/status/unassigned?${dateFilters}&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `http://localhost:5000/api/v1/parcels/status/assigned?${dateFilters}&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `http://localhost:5000/api/v1/parcels/status/in-transit?${dateFilters}&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `http://localhost:5000/api/v1/parcels/status/reached-destination?${dateFilters}&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get(
          `http://localhost:5000/api/v1/parcels/status/delivered?${dateFilters}&limit=100`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
      ]);

      // Combine all parcels from different status endpoints
      let allParcels = [];
      responses.forEach((response) => {
        if (response.data && response.data.data) {
          allParcels = [...allParcels, ...response.data.data];
        }
      });

      // Sort parcels by creation date (newest first)
      allParcels.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      return allParcels;
    } catch (error) {
      console.error("Error fetching parcels for report:", error);

      // Show notification for the error
      showNotification("Failed to fetch parcel data from API", "danger");

      // If API fails, return empty array to avoid breaking the report generation
      return [];
    }
  };

  const generateCSV = (data) => {
    // Define CSV headers
    const headers = [
      "Tracking Number",
      "Customer Name",
      "Source Station",
      "Destination Station",
      "Status",
      "Created Date",
      "Weight (kg)",
      "Dimensions",
      "Priority",
      "Assigned Train",
      "Status Date",
    ].join(",");

    // Safely access properties with null/undefined checks - defined at function level
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

    // Convert parcel data to CSV rows
    const rows = data.map((parcel) => {
      try {
        // Determine the status date based on the parcel's status
        let statusDate = "";
        if (parcel.deliveredAt) statusDate = safeGetDate(parcel, "deliveredAt");
        else if (parcel.reachedDestinationAt)
          statusDate = safeGetDate(parcel, "reachedDestinationAt");
        else if (parcel.departedAt)
          statusDate = safeGetDate(parcel, "departedAt");
        else if (parcel.assignedAt)
          statusDate = safeGetDate(parcel, "assignedAt");

        let trainInfo = "";
        if (parcel.assignedTrain) {
          const trainNumber = safeGetString(
            parcel.assignedTrain,
            "trainNumber"
          );
          const trainName = safeGetString(parcel.assignedTrain, "name");
          if (trainNumber || trainName) {
            trainInfo = `"${trainNumber} - ${trainName}"`;
          }
        }

        return [
          safeGetString(parcel, "trackingNumber"),
          `"${safeGetString(parcel, "customerName")}"`,
          `"${safeGetString(parcel, "sourceStation")}"`,
          `"${safeGetString(parcel, "destinationStation")}"`,
          safeGetString(parcel, "status"),
          safeGetDate(parcel, "createdAt"),
          safeGetString(parcel, "weight"),
          safeGetString(parcel, "dimensions"),
          safeGetString(parcel, "priority", "standard"),
          trainInfo,
          statusDate,
        ].join(",");
      } catch (error) {
        console.error("Error processing parcel for CSV:", error, parcel);
        // Return a row with minimal info if there was an error
        return [
          safeGetString(parcel, "trackingNumber", "Error"),
          `"Error processing parcel data"`,
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
    const title = `Warehouse Parcel Report (${new Date(
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

    // Group parcels by status for the summary section
    const parcelsByStatus = data.reduce((acc, parcel) => {
      const status = safeGetString(parcel, "status", "unknown");
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Create status summary content
    const statusSummary = Object.entries(parcelsByStatus).map(
      ([status, count]) => ({
        status:
          status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, " "),
        count,
      })
    );

    // Generate table data
    const tableBody = [
      [
        { text: "Tracking #", style: "tableHeader" },
        { text: "Customer", style: "tableHeader" },
        { text: "Source", style: "tableHeader" },
        { text: "Destination", style: "tableHeader" },
        { text: "Status", style: "tableHeader" },
        { text: "Date", style: "tableHeader" },
      ],
    ];

    data.forEach((parcel) => {
      tableBody.push([
        safeGetString(parcel, "trackingNumber", "N/A"),
        safeGetString(parcel, "customerName", "N/A"),
        safeGetString(parcel, "sourceStation", "N/A"),
        safeGetString(parcel, "destinationStation", "N/A"),
        safeGetString(parcel, "status", "unknown").replace(/-/g, " "),
        safeGetDate(parcel, "createdAt"),
      ]);
    });

    // Create content for the detail section
    const detailsContent = [{ text: "Parcel Details", style: "subheader" }];

    data.forEach((parcel, index) => {
      try {
        // Determine the status-specific details
        let statusInfo = "";
        const status = safeGetString(parcel, "status", "unknown");

        if (status === "assigned") {
          const trainNumber = safeGetString(
            parcel,
            "assignedTrain.trainNumber"
          );
          const trainName = safeGetString(parcel, "assignedTrain.name");
          if (trainNumber || trainName) {
            statusInfo = `Assigned to train: ${trainNumber} - ${trainName}`;
          } else {
            statusInfo = "Assigned (train details unavailable)";
          }
        } else if (status === "in-transit") {
          const trainNumber = safeGetString(
            parcel,
            "assignedTrain.trainNumber"
          );
          const trainName = safeGetString(parcel, "assignedTrain.name");
          if (trainNumber || trainName) {
            statusInfo = `In transit via train: ${trainNumber} - ${trainName}`;
          } else {
            statusInfo = "In transit (train details unavailable)";
          }

          if (parcel.estimatedArrival) {
            statusInfo += `, Est. arrival: ${safeGetDate(
              parcel,
              "estimatedArrival"
            )}`;
          }
        } else if (status === "reached-destination") {
          statusInfo = `Arrived at destination on: ${safeGetDate(
            parcel,
            "reachedDestinationAt"
          )}`;
        } else if (status === "delivered") {
          statusInfo = `Delivered on: ${safeGetDate(parcel, "deliveredAt")}`;
        }

        detailsContent.push(
          {
            text: `${index + 1}. ${safeGetString(
              parcel,
              "trackingNumber",
              "N/A"
            )} - ${safeGetString(parcel, "customerName", "N/A")}`,
            style: "detailHeader",
          },
          {
            text: `Route: ${safeGetString(
              parcel,
              "sourceStation",
              "N/A"
            )} → ${safeGetString(parcel, "destinationStation", "N/A")}`,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Status: ${status.replace(/-/g, " ")}${
              statusInfo ? ` (${statusInfo})` : ""
            }`,
            margin: [0, 5, 0, 0],
          },
          {
            text: `Specifications: ${safeGetString(
              parcel,
              "weight",
              "N/A"
            )} kg, ${safeGetString(
              parcel,
              "dimensions",
              "N/A"
            )}, Priority: ${safeGetString(parcel, "priority", "standard")}`,
            margin: [0, 5, 0, 10],
          }
        );
      } catch (error) {
        console.error("Error processing parcel for PDF details:", error);
        // Add a simplified entry if there was an error
        detailsContent.push(
          {
            text: `${index + 1}. Error processing parcel details`,
            style: "detailHeader",
            color: "red",
          },
          {
            text: `Tracking Number: ${safeGetString(
              parcel,
              "trackingNumber",
              "N/A"
            )}`,
            margin: [0, 5, 0, 10],
          }
        );
      }
    });

    // Create status summary table
    const statusTable = {
      style: "summaryTable",
      table: {
        widths: ["*", "auto"],
        body: [
          [
            { text: "Parcel Status", style: "tableHeader" },
            { text: "Count", style: "tableHeader" },
          ],
          ...statusSummary.map((item) => [item.status, item.count.toString()]),
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
        { text: "Status Summary", style: "subheader" },
        statusTable,
        {
          text: "Total Parcels: " + data.length,
          style: "subheader",
          margin: [0, 10, 0, 10],
        },
        { text: "Parcels List", style: "subheader" },
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
        `warehouse-parcels-report-${reportDateRange.startDate}-to-${reportDateRange.endDate}.pdf`
      );
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);

    try {
      // Fetch parcels data for report
      const parcelsData = await fetchParcelsForReport();

      if (parcelsData.length === 0) {
        showNotification(
          "No parcels found in the selected date range",
          "warning"
        );
        setGeneratingReport(false);
        return;
      }

      if (reportType === "csv") {
        const csvData = generateCSV(parcelsData);
        const filename = `warehouse_parcels_report_${reportDateRange.startDate}_to_${reportDateRange.endDate}.csv`;
        downloadCSV(csvData, filename);
        showNotification("CSV report downloaded successfully", "success");
      } else if (reportType === "pdf") {
        generatePDF(parcelsData);
        showNotification("PDF report downloaded successfully", "success");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      showNotification("Failed to generate report", "danger");
    } finally {
      setGeneratingReport(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 5000);
  };

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <i className="bi bi-box-seam me-2"></i>
          Warehouse Dashboard
        </h2>
        <button
          className="btn btn-primary d-flex align-items-center"
          onClick={handleGenerateReport}
          disabled={generatingReport}
        >
          <i className="bi bi-download me-2"></i>
          Generate Report
        </button>
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
          <h5 className="card-title">Generate Warehouse Report</h5>
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
        <div className="card-header bg-white">
          <ul className="nav nav-tabs card-header-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "unassigned" ? "active" : ""
                }`}
                onClick={() => setActiveTab("unassigned")}
              >
                <i className="bi bi-box me-2"></i>
                Unassigned Parcels
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "assigned" ? "active" : ""
                }`}
                onClick={() => setActiveTab("assigned")}
              >
                <i className="bi bi-bookmark-check me-2"></i>
                Assigned to Train
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "in-transit" ? "active" : ""
                }`}
                onClick={() => setActiveTab("in-transit")}
              >
                <i className="bi bi-train-front me-2"></i>
                In Transit
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "reached-destination" ? "active" : ""
                }`}
                onClick={() => setActiveTab("reached-destination")}
              >
                <i className="bi bi-geo-alt me-2"></i>
                Reached Destination
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "delivered" ? "active" : ""
                }`}
                onClick={() => setActiveTab("delivered")}
              >
                <i className="bi bi-check-circle me-2"></i>
                Delivered
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default WarehouseDashboard;
