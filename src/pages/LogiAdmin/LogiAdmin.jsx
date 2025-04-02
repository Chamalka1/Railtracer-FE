import { useState } from "react";

export const LogiAdmin = () => {
    const [searchResult, setSearchResult] = useState(null);
    const username = "John Doe"; // Replace with dynamic username if available

    const handleSearch = () => {
        // Simulating a search result
        setTimeout(() => {
            setSearchResult("Sample Search Result");
        }, 1000);
    };

    return (
        <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0, backgroundColor: "#f4f4f4" }}>
            {/* Header */}
            <div style={{ background: "#333", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "24px" }}>Logistics Manager Dashboard</div>
                <div>
                    <span style={{ marginRight: "15px" }}>{username}</span>
                    <button style={{ padding: "8px 12px", background: "red", color: "white", border: "none", cursor: "pointer" }}>Logout</button>
                </div>
            </div>

            <div style={{ padding: "20px" }}>
                {/* Shipment Overview */}
                <div style={{ background: "white", padding: "15px", marginBottom: "15px", borderRadius: "5px" }}>
                    <h2 style={{ margin: 0 }}>Shipment Overview</h2>
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
                    
                    {/* Action Buttons */}
                    <div style={{ marginTop: "10px" }}>
                        <button disabled={!searchResult} style={{ padding: "8px", marginRight: "5px", background: searchResult ? "blue" : "gray", color: "white", border: "none", cursor: searchResult ? "pointer" : "not-allowed" }}>Add</button>
                        <button disabled={!searchResult} style={{ padding: "8px", marginRight: "5px", background: searchResult ? "green" : "gray", color: "white", border: "none", cursor: searchResult ? "pointer" : "not-allowed" }}>Modify</button>
                        <button disabled={!searchResult} style={{ padding: "8px", background: searchResult ? "red" : "gray", color: "white", border: "none", cursor: searchResult ? "pointer" : "not-allowed" }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
