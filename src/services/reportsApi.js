const BASE_URL = "http://localhost:5000/api/reports";

// Fetch all reports
export const getReports = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

// Add a new report
export const addReport = async (postData) => {
  console.log(postData);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Update an existing report
export const updateReport = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Partially update a report
const patchReport = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Delete a report
export const deleteReport = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return response.ok; // Returns true if successful
};
