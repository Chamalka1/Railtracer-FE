import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTrains } from "../services/trainApi";
import { getStations } from "../services/stationApi";

export const Train = () => {
  const [trains, setTrains] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    getTrains().then((data) => {
      setTrains(data.response);
    });
  }, []);

  useEffect(() => {
    getStations().then((data) => {
      console.log(data);
      setStations(data.response);
    });
  }, []);

  return (
    <div className="w-50 mt-20 mx-auto">
      <h2>Search Tain</h2>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          From
        </label>
        <select className="form-select " id="inputGroupSelect01">
          {stations.map((station, index) => (
            <option key={index} value="3">
              {station.stationName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          To
        </label>
        <select
          className="form-select "
          id="inputGroupSelect01"
          defaultValue={"Choose.."}
        >
          {stations.map((station, index) => (
            <option key={index} value="3">
              {station.stationName}
            </option>
          ))}
        </select>
      </div>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          Start Time
        </label>
        <select className="form-select " id="inputGroupSelect01">
          <option selected>Choose...</option>
          <option value="1">00.00.00</option>
          <option value="2">00.30.00</option>
          <option value="3">01.00.00</option>
          <option value="4">01.30.00</option>
          <option value="5">02.00.00</option>
          <option value="3">02.30.00</option>
        </select>
      </div>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="datePicker">
          Date
        </label>
        <DatePicker
          id="datePicker"
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          className="form-control"
          dateFormat="yyyy-MM-dd"
          placeholderText="Select Date"
        />
      </div>
      <div>
        <button type="button" className="btn btn-primary">
          Search
        </button>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">From Station</th>
            <th scope="col">Arrival Time</th>
            <th scope="col">Departure Time</th>
            <th scope="col">Destination Time</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{train.trainName}</td>
              <td>{train.schedule[0].arrivalTime}</td>
              <td>{train.schedule[0].departureTime}</td>
              <td>{train.schedule[0].arrivalTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
