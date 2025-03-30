import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Train = () => {
  const [parcel, setParcel] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="w-50 mt-20">
      <h2>Search Tain</h2>

      <div className="input-group mb-3">
        <label className="input-group-text" htmlFor="inputGroupSelect01">
          From
        </label>
        <select className="form-select " id="inputGroupSelect01">
          <option selected>Choose...</option>
          <option value="1">Fort</option>
          <option value="2">Maradana</option>
          <option value="3">Moratuwa</option>
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
          <option>Choose...</option>
          <option value="1">Fort</option>
          <option value="2">Maradana</option>
          <option value="3">Moratuwa</option>
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
    </div>
  );
};
