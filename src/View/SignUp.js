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

  // ==================== UPDATED HANDLE CHANGE ====================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Aadhaar: Only allow digits and limit to 12
    if (name === "aadhaarCard") {
      const val = value.replace(/\D/g, ""); // Remove non-digits
      if (val.length <= 12) {
        setForm({ ...form, [name]: val });
      }
      setErrors({ ...errors, [name]: "" });
      return;
    }

    // 2. PAN: Convert to UpperCase automatically and limit to 10
    if (name === "panCard") {
      const val = value.toUpperCase();
      if (val.length <= 10) {
        setForm({ ...form, [name]: val });
      }
      setErrors({ ...errors, [name]: "" });
      return;
    }

    // Default for other fields
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
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

    // PAN Card Validation
    if (!form.panCard) {
      newErrors.panCard = "PAN is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.panCard)) {
      newErrors.panCard = "Invalid PAN format. Example: ABCDE1234F";
    }

    // Aadhaar Card Validation
    if (!form.aadhaarCard) {
      newErrors.aadhaarCard = "Aadhaar is required";
    } else if (form.aadhaarCard.length !== 12) {
      newErrors.aadhaarCard = "Aadhaar must be exactly 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/users/register", form);
      setServerMsg(res.data.message || "Registration successful!");

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

      {serverMsg && (
        <p className={`server-message ${serverMsg.toLowerCase().includes("success") ? "success" : "error"}`}>
          {serverMsg}
        </p>
      )}

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
            maxLength="10"
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
            maxLength="12"
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