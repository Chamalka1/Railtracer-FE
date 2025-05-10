import React, { useState, useEffect } from "react";
import axios from "axios";

const DeliveredParcels = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDeliveredParcels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/v1/parcels/status/delivered?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setParcels(response.data.data);
      setTotalPages(response.data.pagination.total);
      setError(null);
    } catch (err) {
      setError("Failed to fetch parcels. Please try again.");
      console.error("Error fetching delivered parcels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    fetchDeliveredParcels();
  }, [page]);

  return (
    <div>
      <h5 className="mb-3">Delivered Parcels</h5>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : parcels.length > 0 ? (
        <>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Tracking Number</th>
                  <th>Customer Name</th>
                  <th>Destination Station</th>
                  <th>Delivery Date</th>
                  <th>Sender</th>
                </tr>
              </thead>
              <tbody>
                {parcels.map((parcel) => (
                  <tr key={parcel._id}>
                    <td>{parcel.trackingNumber}</td>
                    <td>{parcel.customerName}</td>
                    <td>{parcel.destinationStation}</td>
                    <td>
                      {new Date(parcel.deliveredAt).toLocaleString()}
                    </td>
                    <td>{parcel.senderName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav aria-label="Parcel pagination">
            <ul className="pagination justify-content-center">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handleChangePage(page - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
              </li>
              {[...Array(totalPages)].map((_, index) => (
                <li
                  key={index + 1}
                  className={`page-item ${page === index + 1 ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => handleChangePage(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => handleChangePage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <div className="alert alert-info">
          No delivered parcels found.
        </div>
      )}
    </div>
  );
};

export default DeliveredParcels;
