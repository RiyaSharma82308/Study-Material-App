import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Upload = () => {
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [file, setFile] = useState(null);
    const [role, setRole] = useState(""); // To check user role
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check user role from localStorage or API
        const userRole = localStorage.getItem("role"); // Assume role is stored in localStorage
        if (!userRole || !["admin", "server"].includes(userRole)) {
            alert("Access Denied: Only Admins & Servers can upload materials.");
            navigate("/"); // Redirect unauthorized users
        }
        setRole(userRole);
    }, [navigate]);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        if (!title || !subject || !file) {
            setMessage({ type: "error", text: "All fields are required." });
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("subject", subject);
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch("http://localhost:5000/api/files/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            const result = await response.json();
            if (response.ok) {
                setMessage({ type: "success", text: "File uploaded successfully!" });
                setTitle("");
                setSubject("");
                setFile(null);
            } else {
                setMessage({ type: "error", text: result.message || "Upload failed." });
            }
        } catch (error) {
            console.error("Upload Error:", error);
            setMessage({ type: "error", text: "Server error. Please try again." });
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
                    <label className="form-label">Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
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
                    <input type="file" className="form-control" onChange={handleFileChange} required />
                </div>

                <button type="submit" className="btn btn-primary">Upload</button>
            </form>
        </div>
    );
};

export default Upload;
