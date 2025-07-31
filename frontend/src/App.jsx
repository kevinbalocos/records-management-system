import { Routes, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import UserLandingPage from "./LandingPages/UserLandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminAndSuperAdminPage from "./authentication/Admin-SuperAdminPage"; // Corrected import name
import VerifyEmailPage from "./authentication/VerifyEmailPage";
import EntryPage from "./FrontPage/EntryPage"; // Import the new EntryPage

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Entry Page is now the default route */}
        <Route path="/" element={<EntryPage />} />
        {/* Login Page now has its own explicit route */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<UserLandingPage />} />
        <Route path="/admin" element={<AdminAndSuperAdminPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
      </Routes>
    </>
  );
};

export default App;
