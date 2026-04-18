import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../Style/auth.css";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [serverMsg, setServerMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetErrors, setResetErrors] = useState({});

  const [timeLeft, setTimeLeft] = useState(600);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();

  // OTP Timer
  useEffect(() => {
    let timer;
    if (forgotStep === 2 && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [forgotStep, timeLeft]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  
  // ==================== MISSING FUNCTIONS (Fixed) ====================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateLogin = () => {
    let newErrors = {};
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!form.password.trim()) newErrors.password = "Password is required";
    else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== FIXED handleSubmit ====================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMsg("");
    setErrors({});

    if (!validateLogin()) return;

    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/auth/login", form);
      
      const { token, email: userEmail, name, roles, message } = res.data;

      console.log("🔍 Roles from Backend:", roles);

      if (message && message.toLowerCase().includes("successful")) {
        
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user", JSON.stringify({ 
          email: userEmail, 
          name, 
          roles: roles || [] 
        }));

        let storedRole = "donor";

        if (roles && roles.length > 0) {
          const roleList = roles.map(r => String(r).toUpperCase());

          if (roleList.some(r => r.includes("ADMIN"))) storedRole = "admin";
          else if (roleList.some(r => r.includes("MANAGER") || r === "3")) storedRole = "manager";
          else storedRole = "donor";
        }

        localStorage.setItem("role", storedRole);

       // ... inside handleSubmit, after localStorage.setItem("role", storedRole) ...

setServerMsg("Login successful! Redirecting...");

setTimeout(() => {
  // Check if the user came from the donation page
  const redirectTo = localStorage.getItem('redirectAfterLogin');

  if (redirectTo === '/donation') {
    // 1. Remove the flag so future logins go to dashboard normally
    localStorage.removeItem('redirectAfterLogin');
    // 2. Redirect to donation
    navigate('/donation');
  } else {
    // 3. Default behavior: Go to dashboard
    navigate("/admin/dashboard");
  }
}, 1400);
      } else {
        setServerMsg(message || "Login failed");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed. Please try again.";
      setServerMsg(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ====================== Forgot Password Handlers ======================
  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setForgotStep(1);
    setServerMsg("");
    setResetErrors({});
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeLeft(600);
    setCanResend(false);
  };

  const sendOTP = async (isResend = false) => {
    const emailToUse = isResend ? forgotEmail : forgotEmail.trim();
    if (!emailToUse) {
      setResetErrors({ email: "Email is required" });
      return;
    }
    if (!/^[A-Za-z0-9+_.-]+@(.+)$/.test(emailToUse)) {
      setResetErrors({ email: "Invalid email format" });
      return;
    }

    if (isResend) setResendLoading(true);
    else setIsLoading(true);
    setServerMsg("");

    try {
      await axios.post("http://localhost:8080/auth/forgot-password", { email: emailToUse });
      setServerMsg(isResend ? "New OTP sent successfully!" : "OTP sent successfully!");
      setForgotStep(2);
      setTimeLeft(600);
      setCanResend(false);
      setResetErrors({});
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      if (isResend) setResendLoading(false);
      else setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setResetErrors({ otp: "Please enter valid 6-digit OTP" });
      return;
    }

    setIsLoading(true);
    setServerMsg("");

    try {
      await axios.post("http://localhost:8080/auth/verify-otp", { email: forgotEmail, otp });
      setServerMsg("OTP verified successfully!");
      setForgotStep(3);
      setResetErrors({});
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    let errs = {};
    if (!newPassword || newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters";
    if (newPassword !== confirmPassword) errs.confirmPassword = "Passwords do not match";

    if (Object.keys(errs).length > 0) {
      setResetErrors(errs);
      return;
    }

    setIsLoading(true);
    setServerMsg("");

    try {
      await axios.post("http://localhost:8080/auth/reset-password", { email: forgotEmail, newPassword });
      setServerMsg("Password reset successful!");
      
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotStep(1);
        setForm({ email: forgotEmail, password: "" });
        setServerMsg("");
      }, 2000);
    } catch (err) {
      setServerMsg(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeForgotPassword = () => {
    setShowForgotPassword(false);
    setServerMsg("");
  };

  return (
    <div className="auth-container">
      <h2>Login to Jeevdaya</h2>

      {serverMsg && (
        <p className={`server-message ${
          serverMsg.toLowerCase().includes("successful") || 
          serverMsg.toLowerCase().includes("sent") || 
          serverMsg.toLowerCase().includes("verified") ? "success" : "error"
        }`}>
          {serverMsg}
        </p>
      )}

      {!showForgotPassword && (
        <>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input 
                type="email" 
                name="email" 
                placeholder="Enter Email" 
                value={form.email} 
                onChange={handleChange}
                className={errors.email ? "error-input" : ""} 
                disabled={isLoading} 
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <input 
                type="password" 
                name="password" 
                placeholder="Enter Password" 
                value={form.password} 
                onChange={handleChange}
                className={errors.password ? "error-input" : ""} 
                disabled={isLoading} 
              />
              {errors.password && <p className="field-error">{errors.password}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="btn btn-primary w-100">
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div style={{ textAlign: "right", margin: "10px 0" }}>
            <button 
              type="button" 
              onClick={handleForgotPasswordClick} 
              style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
            >
              Forgot Password?
            </button>
          </div>

          <Link className="switch-link" to="/signup">
            Don't have an account? Register here
          </Link>
        </>
      )}

      {/* Forgot Password Section - Keep as it is */}
      {showForgotPassword && (
        <div className="forgot-password-section">
          <h3>Forgot Password</h3>
          <button onClick={closeForgotPassword} style={{ float: "right", background: "none", border: "none", fontSize: "18px" }}>✕</button>

          {forgotStep === 1 && (
            <div>
              <p>Enter your registered email to receive OTP</p>
              <input
                type="email"
                placeholder="Enter Email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className={resetErrors.email ? "error-input" : ""}
                disabled={isLoading}
              />
              {resetErrors.email && <p className="field-error">{resetErrors.email}</p>}
              <button onClick={() => sendOTP(false)} disabled={isLoading} className="btn btn-primary w-100" style={{ marginTop: "15px" }}>
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {forgotStep === 2 && (
            <div>
              <p>Enter 6-digit OTP sent to <strong>{forgotEmail}</strong></p>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className={resetErrors.otp ? "error-input" : ""}
                disabled={isLoading}
              />
              {resetErrors.otp && <p className="field-error">{resetErrors.otp}</p>}

              <p style={{ margin: "10px 0", color: timeLeft < 120 ? "red" : "#666" }}>
                OTP expires in: <strong>{formatTime(timeLeft)}</strong>
              </p>

              <button onClick={verifyOTP} disabled={isLoading} className="btn btn-primary w-100">
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <button 
                onClick={() => sendOTP(true)} 
                disabled={!canResend || resendLoading}
                className="btn btn-secondary w-100"
                style={{ marginTop: "10px", background: canResend ? "#28a745" : "#ccc" }}
              >
                {resendLoading ? "Sending..." : canResend ? "Resend OTP" : `Resend (${formatTime(timeLeft)})`}
              </button>
            </div>
          )}

          {forgotStep === 3 && (
            <div>
              <p>Set new password for <strong>{forgotEmail}</strong></p>
              <input 
                type="password" 
                placeholder="New Password (min 8 chars)" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} 
                className={resetErrors.newPassword ? "error-input" : ""} 
              />
              {resetErrors.newPassword && <p className="field-error">{resetErrors.newPassword}</p>}

              <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} 
                className={resetErrors.confirmPassword ? "error-input" : ""} 
                style={{ marginTop: "10px" }} 
              />
              {resetErrors.confirmPassword && <p className="field-error">{resetErrors.confirmPassword}</p>}

              <button onClick={resetPassword} disabled={isLoading} className="btn btn-primary w-100" style={{ marginTop: "15px" }}>
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Login;