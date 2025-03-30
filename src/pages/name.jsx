import { useEffect, useState } from "react";

export const Name = () => {
  const [name, setName] = useState("Rail Tracer");
  const [description, setDescription] = useState(
    "Transparent and Secured Devilery service from Sri Lanka Railway!"
  );

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await fetch("http://localhost:5000/");
        const text = await response.text();

        setName(text);
      } catch (error) {
        console.error("Failed to fetch name:", error);
        setName("Error fetching name");
      }
    };

    const fetchDescription = async () => {
      try {
        const desResponse = await fetch("http://localhost:5000/abc");
        const description = await desResponse.text();

        setDescription(description);
      } catch (error) {
        console.error("Failed to fetch description:", error);
        setDescription("Error fetching name");
      }
    };
  }, []);

  return (
    <div>
      <h1>{name}</h1>
      <p>{description}</p>
    </div>
  );
};
