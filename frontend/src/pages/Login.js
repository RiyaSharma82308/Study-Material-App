import React, { useState } from "react";
import { login } from "../utils/api";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(email, password);
            console.log("Full API Response:", response); // Debugging full response
            console.log("Login Response Data:", response.data); // Debugging data part
    
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.user?.role); // Ensure 'user' exists
    
            console.log("Saved Role:", localStorage.getItem("role")); // Check if saved properly
    
            alert("Login successful!");
            navigate("/");
        } catch (error) {
            console.error("Login failed", error);
            alert("Error: " + (error.response?.data?.message || "Invalid credentials"));
        }
    };
    
    

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100">
            <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
                <h2 className="text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
                <p className="text-center mt-3">
                    Don't have an account? <a href="/register" className="text-decoration-none">Register</a>
                </p>
            </div>
        </div>
    );
};

export default Login;
