// src/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Optional: for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock login logic (replace with actual API call)
    const validEmail = "user@example.com"; // Example email
    const validPassword = "password123"; // Example password

    if (email === validEmail && password === validPassword) {
      // If login is successful:
      navigate("/home"); // Navigate to Home page
    } else {
      // Handle login failure (e.g., show an error message)
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
