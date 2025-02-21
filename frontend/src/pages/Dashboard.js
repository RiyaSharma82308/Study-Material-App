import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Dashboard = () => {
    const [studyMaterials, setStudyMaterials] = useState([]);

    // Fetch study materials from the backend
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const token = localStorage.getItem("token"); // Ensure token exists
                if (!token) {
                    throw new Error("User not authenticated");
                }
        
                const response = await fetch("http://localhost:5000/api/files", {
                    headers: {
                        "Authorization": `Bearer ${token}`, 
                        "Content-Type": "application/json"
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
        
                const data = await response.json();
                console.log("Fetched Data:", data); // Debugging
        
                if (Array.isArray(data)) {
                    setStudyMaterials(data);
                } else {
                    console.error("Unexpected response format:", data);
                }
            } catch (error) {
                console.error("Error fetching study materials:", error);
            }
        };
        
        fetchMaterials();
    }, []);

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-primary">
                <div className="container">
                    <a className="navbar-brand" href="/">Study Materials</a>
                    <a className="btn btn-light" href="/logout">Logout</a>
                </div>
            </nav>

            {/* Dashboard Content */}
            <div className="container mt-4">
                <h2 className="text-center mb-4">Available Study Materials</h2>
                <div className="row">
                    {studyMaterials.length > 0 ? (
                        studyMaterials.map((material, index) => (
                            <div key={index} className="col-md-4">
                                <div className="card mb-4 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{material.title}</h5>
                                        <a href={material.fileUrl} className="btn btn-primary" download>
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center">No study materials available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
