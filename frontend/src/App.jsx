import { Routes, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import UserLandingPage from "./LandingPages/UserLandingPage";
import AdminAndSuperAdminLandingPage from "./LandingPages/Admin-SuperAdmin-LandingPage";
import RecordsLandingPage from "./LandingPages/RecordsLandingPage";
import IndigencyRequest from "./LandingPages/IndigencyRequest";
import IndigencyAdmin from "./LandingPagesAdmin/IndigencyAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminAndSuperAdminUserApproval from "./authentication/Admin-SuperAdminUserApproval";
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
        <Route path="/admin" element={<AdminAndSuperAdminLandingPage />} />
        <Route path="/records" element={<RecordsLandingPage />} />
        <Route
          path="user-approval-by-admin"
          element={<AdminAndSuperAdminUserApproval />}
        />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/indigency-request" element={<IndigencyRequest />} />
        <Route path="/admin/indigency" element={<IndigencyAdmin />} />
      </Routes>
    </>
  );
};

export default App;
