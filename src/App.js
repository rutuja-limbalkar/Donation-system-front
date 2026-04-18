import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

// Public Components
import Home from "./View/Home";
import Udesh from "./Udesh/Udesh";
import Commite from "./Commite/Commite";
import Donation from "./View/Donation";
import GaushalaHelp from "./GaushalaHelp/GaushalaHelp";
import GalleryPage from "./Gallery/GalleryPage";
import Contact from "./View/Contact";
import Login from "./View/Login";
import UserDonation from "./User/UserDonation";
import UserProfile from "./User/UserProfile";
import SignUp from "./View/SignUp";
import PaymentButton from "./PaymentButton/PaymentButton";
import DynamicRenderer from "./Pages/DynamicRenderer";
import AllDonation from "./Admin/AllDonation"

// Admin Components
import AssignRole from "./Role/AssignRole";
import GalleryAdmin from "./Admin/GalleryAdmin";
import GaushalaHelpAdmin from "./Admin/GaushalaHelpAdmin";
import UdeshAdmin from "./Admin/UdeshAdmin";
import ContactAdmin from "./Admin/ContactAdmin";
import CommiteAdmin from "./Admin/CommiteAdmin";
import AdminLayout from "./Admin/AdminLayout";
import AdminPageCreator from "./Admin/AdminPageCreater";
import DonationAdmin from "./Admin/DonationAdmin";
import Dashboard from "./Admin/Dashboard";
import OfflineDonationForm from "./Admin/OfflineDonationForm";
import UserList from "./User/UserList";
// Protected Route
import ProtectedRoute from "./Role/ProtectedRoute";

function App() {

  // ==================== SESSION MANAGEMENT ====================
  useEffect(() => {
    // Clear old session when app starts fresh (after stopping and restarting server)
    const lastLoginTime = localStorage.getItem("lastLoginTime");
    const currentTime = Date.now();

    // If more than 30 minutes have passed since last login, auto logout
    if (lastLoginTime && (currentTime - parseInt(lastLoginTime) > 30 * 60 * 1000)) {
      localStorage.clear();
    }

    // Record current login time
    localStorage.setItem("lastLoginTime", currentTime.toString());

    // Also clear on browser close
    const handleBeforeUnload = () => {
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("lastLoginTime");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return (
    <Router basename="/">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/udesh" element={<Udesh />} />
        <Route path="/commite" element={<Commite />} />
        <Route path="/donation" element={<Donation />} />
        <Route path="/gaushala-help" element={<GaushalaHelp />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-donations" element={<UserDonation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/payment" element={<PaymentButton />} />
        <Route path="/pages/:slug" element={<DynamicRenderer />} />
        

        {/* Protected Routes */}
        <Route
          path="/assign-role"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER"]}>
              <AssignRole />
            </ProtectedRoute>
          }
        />

        {/* Admin Layout */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN", "ROLE_MANAGER", "ROLE_DONOR", "ROLE_USER", "1", "3"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route index element={<Dashboard />} />

          <Route path="gallery" element={<GalleryAdmin />} />
          <Route path="gaushala" element={<GaushalaHelpAdmin />} />
          <Route path="donation" element={<DonationAdmin />} />
          <Route path="udesh" element={<UdeshAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="commite" element={<CommiteAdmin />} />
          <Route path="create-page" element={<AdminPageCreator />} />
          <Route path="all-donations" element={<AllDonation/>} />
          <Route path="offline-donation" element={<OfflineDonationForm />} />
          <Route path="userlist" element={<UserList/>} />
          <Route path="assign-role" element={<AssignRole/>} />
        </Route> 

        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/unauthorized" element={<h2>403 - You don't have permission to access this page</h2>} />
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;