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
    // Clear specific field error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setErrors({});
    setIsLoading(true);

    try {
const res = await axios.post("http://localhost:8080/api/users/register", form);

const {message,success} = res.data; // backend returns plain string

setServerMsg(message);

// 🔴 Check if it's success
if (success) {
  setErrors({});
  setForm({
    name: "",
    email: "",
    password: "",
    panCard: "",
    aadhaarCard: ""
  });
} else {
  // ❌ Handle errors
  if (message.includes("Email")) {
    setErrors(prev => ({ ...prev, email: "This email is already registered" }));
  }
  if (message.includes("PAN")) {
    setErrors(prev => ({ ...prev, panCard: "PAN number format is invalid. Format: ABCDE1234F" }));
  }
  if (message.includes("Aadhaar")) {
    setErrors(prev => ({ ...prev, aadhaarCard: "Aadhaar number must be 12 digits" }));
  }
}
    } catch (err) {
      if (err.response) {
        // Handle 400 Bad Request with validation errors
        if (err.response.status === 400) {
          const backendErrors = err.response.data;
          
          // Map backend field names to frontend field names
          const errorMap = {
            name: backendErrors.name,
            email: backendErrors.email,
            password: backendErrors.password,
            panCard: backendErrors.panCard,  // Note: backend uses "panCard"
            aadhaarCard: backendErrors.aadhaarCard  // Note: backend uses "aadhaarCard"
          };
          
          setErrors(errorMap);
          
          // If there's a general error message
          if (backendErrors.message) {
            setServerMsg(backendErrors.message);
          }
          
          // Check for specific PAN/Aadhaar validation messages
          if (backendErrors.panCard === "Invalid PAN format") {
            setErrors(prev => ({ ...prev, pan: "PAN number format is invalid. Format: ABCDE1234F" }));
          }
          if (backendErrors.aadhaarCard === "Invalid Aadhaar format") {
            setErrors(prev => ({ ...prev, aadhaar: "Aadhaar number must be 12 digits" }));
          }
          if (backendErrors.email === "Email already exists") {
            setErrors(prev => ({ ...prev, email: "This email is already registered" }));
          }
          
        } else if (err.response.status === 500) {
          setServerMsg("Server error. Please try again later.");
        } else {
          setServerMsg(err.response.data.message || "Registration failed");
        }
      } else {
        setServerMsg("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      
      {/* Success Message */}
      {serverMsg && !errors.name && !errors.email && !errors.password && !errors.panCard && !errors.aadhaarCard && (
        <p className="success-message">{serverMsg}</p>
      )}
      
      {/* Error Message (non-field specific) */}
      {serverMsg && (errors.name || errors.email || errors.password || errors.panCard || errors.aadhaarCard) && (
        <p className="error-message">{serverMsg}</p>
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
            placeholder="Password (min 6 characters)" 
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