const BASE_URL = "http://localhost:5000/api/v1/stations";

export const getStations = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const addStation = async (postData) => {
  console.log(postData);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const updateStation = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

const patchStation = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const deleteStation = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return response.ok; // Returns true if successful
};
