import React from "react";

const ErrorDisplay = ({ errors }) => {
  // If errors is a string, display it directly
  if (typeof errors === "string") {
    return (
      <div className="alert alert-danger" role="alert">
        {errors}
      </div>
    );
  }

  // If errors is an object (validation errors)
  if (typeof errors === "object" && errors !== null) {
    // If it's an empty object, don't display anything
    if (Object.keys(errors).length === 0) return null;

    return (
      <div className="alert alert-danger" role="alert">
        <h6 className="alert-heading">Please fix the following errors:</h6>
        <ul className="mb-0">
          {Object.entries(errors).map(([field, message]) => (
            <li key={field}>
              {/* Convert field name to title case and remove camelCase */}
              <strong>
                {field
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
                :
              </strong>{" "}
              {message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default ErrorDisplay;
