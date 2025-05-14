// src/Login.js
/*import React, { useState } from "react";
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

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Optional: for styling
import axios from "axios"; // Make sure to install axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        navigate("/home"); // Navigate to Home page
      }
    } catch (error) {
      alert(error.response.data.error || "Login failed. Please try again.");
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

export default Login;*/

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Optional: for styling
import axios from "axios"; // Make sure to install axios

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      if (response.data.message === "Login successful") {
        navigate("/home"); // Navigate to Home page
      }
    } catch (error) {
      alert(error.response.data.error || "Login failed. Please try again.");
    }
  };

  const handleRegisterRedirect = () => {
    navigate("/register"); // Navigate to Register page
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
      <div className="register-link">
        <p>
          Don't have an account?{" "}
          <button
            onClick={handleRegisterRedirect}
            style={{
              color: "blue",
              textDecoration: "underline",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
