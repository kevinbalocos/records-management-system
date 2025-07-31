import { Routes, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import LandingPage from "./authentication/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./authentication/Admin-SuperAdminPage";
import VerifyEmailPage from "./authentication/VerifyEmailPage";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
      </Routes>
    </>
  );
};

export default App;
