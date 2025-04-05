const BASE_URL = "http://localhost:5000/api/v1/complains";

export const getComplains = async () => {
  const response = await fetch(BASE_URL);
  return response.json();
};

export const addComplain = async (postData) => {
  console.log(postData);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const updateComplain = async (id, postData) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(postData),
  });
  return response.json();
};

export const deleteComplain = async (id) => {
  const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  return response.ok; // Returns true if successful
};
