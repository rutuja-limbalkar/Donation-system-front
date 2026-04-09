import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../Style/auth.css";

function SignUp() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    panCard: "",
    aadhaarCard: ""
  });

  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // ==================== FULL FRONTEND VALIDATION ====================
  const validateForm = () => {
    let newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(form.name)) {
      newErrors.name = "Name must contain only alphabets and spaces";
    } else if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    } else if (form.name.trim().length > 50) {
      newErrors.name = "Name must not exceed 50 characters";
    }

    // Email
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Password
    if (!form.password.trim()) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (form.password.length > 100) {
      newErrors.password = "Password must not exceed 100 characters";
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(form.password)) {
      newErrors.password = "Password must contain at least one special character";
    }

    // PAN Card
    const pan = form.panCard.trim().toUpperCase();
    if (!pan) {
      newErrors.panCard = "PAN is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      newErrors.panCard = "Invalid PAN format. Example: ABCDE1234F";
    }

    // Aadhaar Card
    if (!form.aadhaarCard.trim()) {
      newErrors.aadhaarCard = "Aadhaar is required";
    } else if (!/^\d{12}$/.test(form.aadhaarCard)) {
      newErrors.aadhaarCard = "Aadhaar must be exactly 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setErrors({});

    // Step 1: Frontend Validation
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", form);

      setServerMsg(res.data.message || "Registration successful!");

      // Clear form on success
      if (res.data.success) {
        setForm({ name: "", email: "", password: "", panCard: "", aadhaarCard: "" });
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setServerMsg(err.response.data.message);
      } else {
        setServerMsg("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>

      {serverMsg && <p className={`server-message ${serverMsg.includes("success") ? "success" : "error"}`}>{serverMsg}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <p className="field-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <p className="field-error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password (min 8 chars + 1 special)"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? "error-input" : ""}
          />
          {errors.password && <p className="field-error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="panCard"
            placeholder="PAN (e.g., ABCDE1234F)"
            value={form.panCard}
            onChange={handleChange}
            className={errors.panCard ? "error-input" : ""}
          />
          {errors.panCard && <p className="field-error">{errors.panCard}</p>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="aadhaarCard"
            placeholder="Aadhaar (12 digits)"
            value={form.aadhaarCard}
            onChange={handleChange}
            className={errors.aadhaarCard ? "error-input" : ""}
          />
          {errors.aadhaarCard && <p className="field-error">{errors.aadhaarCard}</p>}
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Registering..." : "Register"}
        </button>
      </form>

      <Link className="switch-link" to="/login">
        Already have an account? Login here
      </Link>
    </div>
  );
}

export default SignUp;