import { useState } from "react";
import './WarehouseDashboard.css';

export default function WarehouseDashboard() {
  const [scannedCode, setScannedCode] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: "250px", backgroundColor: "#2d3748", color: "white", padding: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "600" }}>Warehouse Dashboard</h2>
        <nav style={{ marginTop: "20px" }}>
          <SidebarItem label="Dashboard" />
          <SidebarItem label="QR Code Scanning" />
          <SidebarItem label="Parcel Sorting Management" />
          <SidebarItem label="Report Generation" />
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px", backgroundColor: "#f7fafc" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "600", marginBottom: "20px" }}>Dashboard Overview</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
          <DashboardCard title="Pending Parcels" count={25} />
          <DashboardCard title="Sorted Parcels" count={120} />
          <DashboardCard title="Dispatched Parcels" count={85} />
        </div>

        {/* QR Code Scanner */}
        <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "600", marginBottom: "10px" }}>Scan QR Code</h2>
          <div style={{ width: "100%", maxWidth: "400px", height: "300px", margin: "0 auto" }}>
           
          </div>

          {/* Scanned Result */}
          {scannedCode && <p style={{ marginTop: "10px", fontWeight: "bold", color: "#2d3748" }}>Scanned Parcel ID: {scannedCode}</p>}
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ label }) {
  return <div style={{ padding: "10px 0", cursor: "pointer", fontWeight: "500" }}>{label}</div>;
}

function DashboardCard({ title, count }) {
  return (
    <div style={{ padding: "20px", backgroundColor: "white", borderRadius: "10px", textAlign: "center", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "22px", fontWeight: "bold", color: "#2d3748" }}>{count}</p>
    </div>
  );
}

