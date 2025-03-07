import React from "react";

export const GoodRetreve = () => {
  return (
    <div>
      <div class="w-50 m-3">
        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Name
          </label>
          <input
            type="Name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="name"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Email address
          </label>
          <input
            type="email"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="name@example.com"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Address
          </label>
          <input
            type="Name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Adress"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Telephon No
          </label>
          <input
            type="Name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Telephone No"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            ID NO
          </label>
          <input
            type="Name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="ID no"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlInput1" class="form-label">
            Traking no
          </label>
          <input
            type="Name"
            class="form-control"
            id="exampleFormControlInput1"
            placeholder="Traking No"
          ></input>
        </div>

        <div class="mb-3">
          <label for="exampleFormControlTextarea1" class="form-label">
            {" "}
            Goods discription
          </label>
          <textarea
            class="form-control"
            id="exampleFormControlTextarea1"
            rows="Goods discription"
          ></textarea>
        </div>

        <div class="mb-5">
          <input class="btn btn-primary" type="submit" value="Submit" />
        </div>
      </div>
    </div>
  );
};
