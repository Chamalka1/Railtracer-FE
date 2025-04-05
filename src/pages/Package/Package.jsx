import { useEffect, useState } from "react";
import { getPackages, getPackage } from "../services/packageApi";
import { Link } from "react-router-dom";

export const Package = () => {
  const [stations, setPackage] = useState([]);

  useEffect(() => {
    getPackages().then((data) => {
      setPackage(data.response);
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
            <th scope="col">Sender Address</th>
            <th scope="col">diliver Adress</th>
            <th scope="col">weight</th>
            <th scope="col">Cost</th>
            <th scope="col">Telephon No</th>
            <th scope="col">mail</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>@mdo</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>@fat</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>John</td>
            <td>Doe</td>
            <td>@social</td>
            <td>John</td>
            <td>Doe</td>
            <td>@social</td>
          </tr>
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
