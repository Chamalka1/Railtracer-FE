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
        <table class="table">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">First</th>
      <th scope="col">Last</th>
      <th scope="col">Handle</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1</th>
      <td>Mark</td>
      <td>Otto</td>
      <td>@mdo</td>
    </tr>
    <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>John</td>
      <td>Doe</td>
      <td>@social</td>
    </tr>
  </tbody>
</table>
            </div>
            
            <button>Search Packages</button>
            
            </>

            

       
    );
};

export default LogiDashboard;