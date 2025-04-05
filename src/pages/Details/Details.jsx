import { useState } from "react";

export const Details = () => {
    const username = "John Doe";
    let TrackingId = "RT0001";


    return (

        <><div style={{ background: "#333", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "24px" }}>Logistics Manager Dashboard - Details</div>

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
    <h1>Tracking Id : {TrackingId}</h1>
 </div>

        <div>
        <table class="table table-hover">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">##</th>

    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Name</th>
      <td>Mark</td>

    </tr>
    <tr>
      <th scope="row">Destination Address</th>
      <td>Jacob</td>
    </tr>
    <tr>
      <th scope="row">Accepted Station </th>
      <td colspan="2">Larry the Bird</td>
    </tr>
    <tr>
      <th scope="row">Destination Station </th>
      <td colspan="2">Larry the Bird</td>
    </tr>
  </tbody>
</table>


        </div>
        
        <button type="button" class="btn btn-primary">Damage details</button>

        
        </>

       
    );
};

export default Details;