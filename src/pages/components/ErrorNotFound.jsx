import React from "react";
import { Link } from "react-router-dom";

export const ErrorNotFound = () => {
  return (
    <div className="mt-5">
      <img
        style={{ height: "100px", display: "inline-block" }}
        src="/404.png"
      ></img>
      <p className="fs-2">
        Could not found the URL.. Please try different URL or contact support.
      </p>
      <Link className="fs-2" to="/">
        Home
      </Link>
    </div>
  );
};
