import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
  const [studyMaterials, setStudyMaterials] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const role = localStorage.getItem("role"); // Get role from localStorage

  // Fetch study materials from the backend
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }
  
        const response = await fetch("http://localhost:5000/api/files/files", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched Data:", data); // 🔹 Debugging response
  
        if (Array.isArray(data)) {
          const groupedMaterials = data.reduce((acc, material) => {
            if (!acc[material.subject]) {
              acc[material.subject] = [];
            }
            acc[material.subject].push(material);
            return acc;
          }, {});
  
          console.log("Grouped Data:", groupedMaterials);
          setStudyMaterials(groupedMaterials);
        } else {
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching study materials:", error);
      }
    };
  
    fetchMaterials();
  }, []);
  

  // Filter materials based on the search term
  const filteredMaterials = Object.entries(studyMaterials).reduce(
    (acc, [subject, materials]) => {
      if (subject.toLowerCase().includes(searchTerm.toLowerCase())) {
        acc[subject] = materials;
      }
      return acc;
    },
    {}
  );

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary">
        <div className="container d-flex justify-content-between">
          <a className="navbar-brand" href="/">
            Study Materials
          </a>

          <div className="d-flex gap-2">
            {/* Upload Button (Visible for Admin & Server) */}
            {["admin", "server"].includes(role) && (
              <a className="btn btn-light" href="/upload">
                Upload Material
              </a>
            )}

            {/* NEW: "My Uploads" Button (Visible Only for Servers) */}
            {role === "server" && (
              <a className="btn btn-light" href="/my-uploads">
                My Uploads
              </a>
            )}

            {/* Logout Button */}
            <a className="btn btn-light" href="/login">
              Logout
            </a>
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className="container mt-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Dashboard Content */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">Available Study Materials</h2>

        {Object.keys(filteredMaterials).length > 0 ? (
          Object.entries(filteredMaterials).map(([subject, materials]) => (
            <div key={subject} className="mb-4">
              <h3 className="text-primary">{subject}</h3>
              <div className="row">
                {materials.map((material, index) => (
                  <div key={index} className="col-md-4">
                    <div className="card mb-3 shadow-sm">
                      <div className="card-body">
                        {/* Display filename */}
                        <p className="card-text">
                          <strong>File:</strong> {material.filename || "Unnamed File"}
                        </p>{" "}
                        <a
                          href={material.filepath}
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
          <p className="text-center mt-3">No matching study materials found.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
