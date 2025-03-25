import React from "react";

export const Complain = () => {
  return (
    <div class="w-50">
      <div class="mb-3">
        <h4>Complains</h4>
      </div>

      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"></label>
        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="date"
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"></label>

        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="name"
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"></label>

        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="ID no"
        />
      </div>

      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label"></label>

        <input
          type="text"
          class="form-control"
          id="exampleFormControlInput1"
          placeholder="Package No"
        />
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">
          Description
        </label>
        <textarea
          class="form-control"
          id="exampleFormControlTextarea1"
          rows="3"
        ></textarea>
      </div>

      <button type="button" class="btn btn-primary">
        Submit
      </button>
    </div>
  );
};
