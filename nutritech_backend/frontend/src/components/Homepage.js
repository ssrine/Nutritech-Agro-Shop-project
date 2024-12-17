import React, { useEffect, useState } from "react";
import axios from "axios";

const Homepage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/home/`)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error("Error fetching homepage data:", error));
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {data ? (
        <>
          <h1>{data.company_name}</h1>
          <h2>{data.tagline}</h2>
          <p>{data.description}</p>
          <h3>Features:</h3>
          <ul>
            {data.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Homepage;
