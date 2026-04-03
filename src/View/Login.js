import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Style/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8080/auth/login", form);
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
   <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link className="switch-link" to="/signup">
        Don't have an account? Register here
      </Link>
    </div>
  );
}

export default Login;