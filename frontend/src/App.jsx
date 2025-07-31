import { Routes, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import UserLandingPage from "./LandingPages/UserLandingPage";
import RecordsLandingPage from "./LandingPages/RecordsLandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminAndSuperAdminPage from "./authentication/Admin-SuperAdminPage"; 
import VerifyEmailPage from "./authentication/VerifyEmailPage";
import EntryPage from "./FrontPage/EntryPage"; 

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<EntryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/landing" element={<UserLandingPage />} />
        <Route path="/records" element={<RecordsLandingPage />} />
        <Route path="/admin" element={<AdminAndSuperAdminPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
      </Routes>
    </>
  );
};

export default App;
