import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
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
      let res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:7000"}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      res = await res.json();
      
      if (res.token) {
        setUser({ email: "", password: "" });
        localStorage.setItem("token", res.token);
        navigate("/tasks");
      } else {
        setMessage(res.message || "Login failed");
      }
    } catch (error) {
      setMessage("An error occurred during login");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="auth-title">Welcome Back! 👋</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
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
          <div className="error-message" style={{ color: 'var(--danger-color)', textAlign: 'center', marginBottom: '1rem' }}>
            {message}
          </div>
        )}
        <button type="submit" className="auth-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;