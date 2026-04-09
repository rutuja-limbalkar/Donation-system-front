import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Home from "./View/Home";

import Udesh from "./Udesh/Udesh";

import Commite from "./Commite/Commite"

import Donation from "./View/Donation";

import GaushalaHelp from "./Help/GaushalaHelp";

import GalleryPage from "./Gallery/GalleryPage";

import Contact from "./View/Contact";

import Login from "./View/Login";

import DonationHistory from "./View/DonationHistory";

import Profile from "./View/Profile";

import SignUp from "./View/SignUp";

import AssignRole from "./Role/AssignRole";

import GalleryAdmin from "./Admin/GalleryAdmin";

import GaushalaHelpAdmin from "./Admin/GaushalaHelpAdmin";

import UdeshAdmin from "./Admin/UdeshAdmin";

import ContactAdmin from "./Admin/ContactAdmin";


import PaymentButton from "./PaymentButton/PaymentButton";

import CommiteAdmin from "./Admin/CommiteAdmin";

import AdminLayout from "./Admin/AdminLayout";
import Dashboard from "./Admin/dashboard";
// ... (all your other imports stay the same)

function App() {
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
        <Route path="/DonationHistory" element={<DonationHistory />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/assign-role" element={<AssignRole />} />
        <Route path="/payment" element={<PaymentButton />} />

        {/* Admin Dashboard with Layout (Nested Routes) */}
        <Route path="/admin" element={<AdminLayout />}>

          <Route path="gallery" element={<GalleryAdmin />} /> {/* /admin/gallery */}
          <Route path="gaushala" element={<GaushalaHelpAdmin />} /> {/* /admin/gaushala */}
          <Route path="udesh" element={<UdeshAdmin />} />
          <Route path="contact" element={<ContactAdmin />} />
          <Route path="commite" element={<CommiteAdmin />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>

        {/* Fallback for /dashboard if you still use it */}
        <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
}

export default App;