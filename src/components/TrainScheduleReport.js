import React, { useState, useEffect } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import * as pdfMake from 'pdfmake/build/pdfmake';

pdfMake.vfs = {};

pdfMake.DynamicContent = {
    content: {
        widths: '100%'
    }
};
pdfMake.fonts = {
    Roboto: {
        normal: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
        italics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
        bolditalics: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf'
    },
};


const TrainScheduleReport = ({ trains }) => {
  const [reportType, setReportType] = useState("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());

  const generatePDF = () => {
    let title, dateRange, filteredTrains;
    const today = new Date(selectedDate);

    switch (reportType) {
      case "weekly":
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });
        title = `Weekly Train Schedule (${format(
          weekStart,
          "MMM d"
        )} - ${format(weekEnd, "MMM d, yyyy")})`;
        dateRange = { start: weekStart, end: weekEnd };
        break;
      case "monthly":
        const monthStart = startOfMonth(today);
        const monthEnd = endOfMonth(today);
        title = `Monthly Train Schedule (${format(monthStart, "MMMM yyyy")})`;
        dateRange = { start: monthStart, end: monthEnd };
        break;
      default: // daily
        title = `Daily Train Schedule (${format(today, "MMMM d, yyyy")})`;
        dateRange = { start: today, end: today };
    }

    // Filter trains based on schedule pattern and running days
    filteredTrains = trains.filter((train) => {
      if (train.schedulePattern === "daily") return true;
      if (train.schedulePattern === "weekends") {
        const day = format(today, "EEEE");
        return ["Saturday", "Sunday"].includes(day);
      }
      if (train.schedulePattern === "custom") {
        const day = format(today, "EEEE");
        return train.runningDays.includes(day);
      }
      return false;
    });

    // Sort trains by departure time
    filteredTrains.sort((a, b) => {
      const timeA = a.schedules[0]?.departureTime || "";
      const timeB = b.schedules[0]?.departureTime || "";
      return timeA.localeCompare(timeB);
    });

    // Generate table data
    const tableBody = [
      [
        { text: "Train Number", style: "tableHeader" },
        { text: "Name", style: "tableHeader" },
        { text: "Type", style: "tableHeader" },
        { text: "Source", style: "tableHeader" },
        { text: "Destination", style: "tableHeader" },
        { text: "Departure", style: "tableHeader" },
        { text: "Arrival", style: "tableHeader" },
        { text: "Status", style: "tableHeader" },
      ],
    ];

    filteredTrains.forEach((train) => {
      train.schedules.forEach((schedule) => {
        tableBody.push([
          train.trainNumber,
          train.name,
          train.type,
          train.source,
          train.destination,
          schedule.departureTime,
          schedule.arrivalTime,
          train.status,
        ]);
      });
    });

    const docDefinition = {
      content: [
        { text: title, style: "header" },
        {
          style: "table",
          table: {
            headerRows: 1,
            widths: [
              "auto",
              "*",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
              "auto",
            ],
            body: tableBody,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        tableHeader: {
          bold: true,
          fontSize: 12,
          fillColor: "#f8f9fa",
        },
        table: {
          margin: [0, 5, 0, 15],
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(
        `train-schedule-${reportType}-${format(today, "yyyy-MM-dd")}.pdf`
      );
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Generate Schedule Report</h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Report Type</label>
            <select
              className="form-select"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
            >
              <option value="daily">Daily Schedule</option>
              <option value="weekly">Weekly Schedule</option>
              <option value="monthly">Monthly Schedule</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-control"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">&nbsp;</label>
            <button className="btn btn-primary d-block" onClick={generatePDF}>
              <i className="bi bi-download me-2"></i>
              Download{" "}
              {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainScheduleReport;
