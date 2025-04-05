const BASE_URL = "http://localhost:5000/api/v1/packages";

export const getPackages = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const addPackage = async (postData) => {
  console.log(postData);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const updatePackage = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const deletePackage = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return response.ok; // Returns true if successful
};
