export const LogiAdmin = () => {
    return (

        <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
        <div style={{ background: "#333", color: "white", padding: "15px", textAlign: "center", fontSize: "24px" }}>
            Logistics Manager Dashboard
        </div>
        <div style={{ padding: "20px" }}>
            <div style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                <h2 style={{ margin: 0 }}>Shipment Overview</h2>
                <p>Total Shipments: 120</p>
                <p>Pending Deliveries: 35</p>
            </div>
            <div style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                <h2 style={{ margin: 0 }}>Track Parcel</h2>
                <input type="text" placeholder="Enter tracking number" style={{ padding: "8px", width: "80%" }} />
                <button style={{ padding: "8px", background: "#333", color: "white", border: "none", cursor: "pointer" }}>Search</button>
            </div>
            <div style={{ background: "white", padding: "15px", borderRadius: "5px" }}>
                <h2 style={{ margin: 0 }}>Recent Deliveries</h2>
                <ul>
                    <li>Parcel #12345 - Delivered</li>
                    <li>Parcel #12346 - In Transit</li>
                    <li>Parcel #12347 - Pending</li>
                </ul>
            </div>
        </div>
    </div>
    );
  };