import { useEffect, useState } from "react";
import { getPackages, getPackage } from "../services/packageApi";
import { Link } from "react-router-dom";

export const Package = () => {
  const [packages, setPackage] = useState([]);

  useEffect(() => {
    getPackages().then((data) => {
      setPackage(data.response);
      console.log(data);
    });
  }, []);

  return (
    <div>
      <h3 className="h3">Package</h3>
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

      <table class="table">
        <thead>
          <tr>
            <th scope="col">NO</th>
            <th scope="col">From</th>
            <th scope="col">To</th>
            <th scope="col">weight</th>
            <th scope="col">Cost</th>
            <th scope="col">Telephon No</th>
            <th scope="col">mail</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((package_, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{package_.from.stationName}</td>
              <td>{package_.to.stationName}</td>
              <td>{package_.weight}</td>
              <td>{150}</td>
              <td>{package_.deliverySender.telephone}</td>
              <td>{package_.deliverySender.email}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link
        className="btn btn-primary w-20"
        style={{ marginRight: "10px", width: "120px" }}
        to="/packages/new"
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
