import { useState } from "react";

export const LogiAdmin = () => {
    const [searchResult, setSearchResult] = useState(null);
    const [message, setMessage] = useState("");
    const username = "John Doe"; // Replace with dynamic username if available

    const handleSearch = () => {
        // Simulating a search result
        setTimeout(() => {
            setSearchResult("Sample Search Result");
        }, 1000);
    };

    const handleAction = (action) => {
        if (window.confirm(`Are you sure you want to ${action} this item?`)) {
            setMessage(`${action} action completed successfully!`);
            setTimeout(() => setMessage(""), 3000); // Clear message after 3 seconds
        }
    };

    return (

        <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
            {/* Header */}
            <div style={{ background: "#333", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "24px" }}>Logistics Manager Dashboard - Admin Page</div>

                <div>
            <span style={{ marginRight: "15px" }}>Admin Page</span>
            <span style={{ marginRight: "15px" }}>Details</span>
            <span style={{ marginRight: "15px" }}>Dashboard</span>
            <span style={{ marginRight: "15px" }}>Damage Details</span>
            </div>

                <div>
                    <span style={{ marginRight: "15px" }}>{username}</span>
                    <button style={{ padding: "8px 12px", background: "red", color: "white", border: "none", cursor: "pointer" }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Shipment Overview */}
                <div style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                    <h2 style={{ margin: 0 }}>Package Overview</h2>
                </div>
                
                {/* Track Parcel */}
                <div style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                    <h2 style={{ margin: 0 }}>Track Parcel</h2>
                    <input type="text" placeholder="Enter tracking number" style={{ padding: "8px", width: "80%", marginRight: "10px" }} />
                    <button 
                        style={{ padding: "8px", background: "#333", color: "white", border: "none", cursor: "pointer" }} 
                        onClick={handleSearch}
                    >
                        Search
                    </button>
                    {searchResult && <p style={{ marginTop: "10px", color: "green" }}>{searchResult}</p>}

                    {message && <p style={{ marginTop: "10px", color: "blue" }}>{message}</p>}
                </div>
            </div>
        </div>
        
    );
};
