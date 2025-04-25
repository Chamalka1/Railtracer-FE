import React from "react";

export const GoodRetreve = () => {
  return (
    <div className="w-50 m-3">
      <div>
        <h4 className="mb-4">Good Retrever</h4>
      </div>
      <div>
        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            Name
          </label>
          <input
            type="Name"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="name"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            Address
          </label>
          <input
            type="Name"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Adress"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            Telephon No
          </label>
          <input
            type="Name"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Telephone No"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            ID NO
          </label>
          <input
            type="Name"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="ID no"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlInput1" className="form-label">
            Traking no
          </label>
          <input
            type="Name"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="Traking No"
          ></input>
        </div>

        <div className="mb-3">
          <label for="exampleFormControlTextarea1" className="form-label">
            {" "}
            Goods discription
          </label>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="Goods discription"
          ></textarea>
        </div>

        <div className="mb-5">
          <input className="btn btn-primary" type="submit" value="Submit" />
        </div>
      </div>
    </div>
  );
};
