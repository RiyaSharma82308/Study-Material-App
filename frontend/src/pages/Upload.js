import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Upload = () => {
    const [filename, setFilename] = useState(""); // Renamed from title to filename
    const [subject, setSubject] = useState("");
    const [file, setFile] = useState(null);
    const [role, setRole] = useState(""); 
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userRole = localStorage.getItem("role"); 
        if (!userRole || !["admin", "server"].includes(userRole)) {
            alert("Access Denied: Only Admins & Servers can upload materials.");
            navigate("/");
        }
        setRole(userRole);
    }, [navigate]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
    
        const fileInput = document.getElementById("file");
        const selectedFile = fileInput.files[0];
    
        if (!selectedFile) {
            alert("Please select a file.");
            return;
        }
    
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("filename", filename.trim() !== "" ? filename.trim() : selectedFile.name); 
        formData.append("subject", subject);
    
        console.log("FormData content:");
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);  // Debugging: check what is actually being sent
        }
    
        try {
            const response = await fetch("http://localhost:5000/api/files/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: formData,
            });
    
            const result = await response.json();
            console.log("Upload response:", result);
        } catch (error) {
            console.error("Upload error:", error);
        }
    };
    

    return (
        <div className="container mt-5">
            <h2 className="text-center">Upload Study Material</h2>

            {message && (
                <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`} role="alert">
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpload} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Filename</label> 
                    <input
                        type="text"
                        className="form-control"
                        value={filename} 
                        onChange={(e) => setFilename(e.target.value)}
                        placeholder="Enter filename"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Subject</label>
                    <input
                        type="text"
                        className="form-control"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Upload File</label>
                    <input type="file" id="file" className="form-control" onChange={handleFileChange} required />
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default Upload;
