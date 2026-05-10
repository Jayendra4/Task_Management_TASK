import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:7000"}/api/registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      res = await res.json();
      
      if (res.message && res.message.includes("Successfully")) {
        setUser({ name: "", email: "", password: "" });
        setMessage("Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.message || "Registration failed");
      }
    } catch (error) {
      setMessage("An error occurred during registration");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="auth-title">Create Account 🚀</h2>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={user.name}
            onChange={handleChange}
            required
            placeholder="Enter your name"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            placeholder="Enter your Email"
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
            className="form-input"
          />
        </div>
        {message && (
          <div className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`} style={{ 
            color: message.includes('success') ? 'var(--success-color)' : 'var(--danger-color)', 
            textAlign: 'center', 
            marginBottom: '1rem' 
          }}>
            {message}
          </div>
        )}
        <button type="submit" className="auth-btn">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;