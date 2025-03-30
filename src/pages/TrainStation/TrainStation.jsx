import { useEffect, useState } from "react";
import { getStations } from "../../services/stationApi";
import { Link } from "react-router-dom";

export const TrainStation = () => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    getStations().then((data) => {
      setStations(data.response);
    });
  }, []);

  return (
    <div>
      <h3 className="h3">Train Stations</h3>
      <form className="d-flex mb-5" role="search">
        <input
          className="form-control me-2 w-75 ms-5"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Station Name</th>
            <th scope="col">Station Address</th>
            <th scope="col">Contact Number</th>
            <th scope="col">Adjacent Station</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((station, index) => (
            <tr key={station.stationName}>
              <th scope="row">{index + 1}</th>
              <td>{station.stationName}</td>
              <td>{station.stationAddress}</td>
              <td>{station.stationContactNo}</td>
              <td>{station.adjacentStations.map((s) => s.name).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link
        className="btn btn-primary w-20"
        style={{ marginRight: "10px", width: "120px" }}
        to="/stations/new"
      >
        Add New
      </Link>

      <input
        className="btn btn-primary w-20"
        type="submit"
        value="Edit"
        style={{ marginRight: "10px", width: "120px" }}
      ></input>

      <input
        className="btn btn-primary w-20"
        type="submit"
        value="Delete"
        style={{ marginRight: "10px", width: "120px" }}
      ></input>
    </div>
  );
};
