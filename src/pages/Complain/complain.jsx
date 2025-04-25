import React from "react";

export const Complain = () => {
  return (
    <div className="w-50">
      <div className="mb-3">
        <h4>Complains</h4>
      </div>

      <div className="mb-3">
        <label for="exampleFormControlInput1" className="form-label"></label>
        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="date"
        />
      </div>
      <div className="mb-3">
        <label for="exampleFormControlInput1" className="form-label"></label>

        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="name"
        />
      </div>
      <div className="mb-3">
        <label for="exampleFormControlInput1" className="form-label"></label>

        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="ID no"
        />
      </div>

      <div className="mb-3">
        <label for="exampleFormControlInput1" className="form-label"></label>

        <input
          type="text"
          className="form-control"
          id="exampleFormControlInput1"
          placeholder="Package No"
        />
      </div>
      <div className="mb-3">
        <label for="exampleFormControlTextarea1" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
      </div>

      <button type="button" className="btn btn-primary">
        Submit
      </button>
    </div>
  );
};
