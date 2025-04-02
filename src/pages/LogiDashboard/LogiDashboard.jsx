import { useState } from "react";

export const LogiDashboard = () => {
    const username = "John Doe";


    return (

        <><div style={{ background: "#333", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "24px" }}>Logistics Manager Dashboard - Main Dashboard</div>

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
        
        <div>
                <ul class="list-group">
                    <li class="list-group-item">An item</li>
                    <li class="list-group-item">A second item</li>
                    <li class="list-group-item">A third item</li>
                    <li class="list-group-item">A fourth item</li>
                    <li class="list-group-item">And a fifth one</li>
                </ul>
            </div></>

       
    );
};

export default LogiDashboard;