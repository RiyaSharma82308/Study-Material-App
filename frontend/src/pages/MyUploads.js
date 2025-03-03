import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const MyUploads = () => {
  const [myMaterials, setMyMaterials] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyUploads = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await fetch("http://localhost:5000/api/users/my-files", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("My Uploaded Files:", data);

        if (Array.isArray(data)) {
          // Group materials by subject
          const groupedMaterials = data.reduce((acc, material) => {
            if (!acc[material.subject]) {
              acc[material.subject] = [];
            }
            acc[material.subject].push(material);
            return acc;
          }, {});

          setMyMaterials(groupedMaterials);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching uploaded materials:", error);
        setError("Failed to load your uploads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyUploads();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">My Uploaded Study Materials</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : Object.keys(myMaterials).length > 0 ? (
        Object.entries(myMaterials).map(([subject, materials]) => (
          <div key={subject} className="mb-4">
            <h3 className="text-primary">{subject}</h3>
            <div className="row">
              {materials.map((material, index) => (
                <div key={index} className="col-md-4">
                  <div className="card mb-3 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{material.title}</h5>
                      <a
                        href={material.fileUrl}
                        className="btn btn-primary"
                        download
                      >
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p className="text-center mt-3">No uploaded materials found.</p>
      )}
    </div>
  );
};

export default MyUploads;
