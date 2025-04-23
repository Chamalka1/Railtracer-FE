const BASE_URL = "http://localhost:5000/api/sortpackages";

// Fetch all sort packages
export const getSortPackages = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

// Fetch a single sort package by ID
export const getSortPackageById = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`);
  return response.json();
};

// Add a new sort package
export const addSortPackage = async (postData) => {
  console.log("Adding sort package:", postData);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Update an existing sort package (PUT)
export const updateSortPackage = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Partially update a sort package (PATCH)
export const patchSortPackage = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

// Delete a sort package
export const deleteSortPackage = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return response.ok; // Returns true if successful
};
