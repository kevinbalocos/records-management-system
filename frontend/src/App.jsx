import { Routes, Route } from "react-router-dom";
import LoginPage from "./authentication/LoginPage";
import RegisterPage from "./authentication/RegisterPage";
import UserLandingPage from "./UserLandingPage/UserLandingPage";
import AdminAndSuperAdminLandingPage from "./AdminLandingPage/AdminLandingPage";
import IndigencyRequest from "./UserLandingPage/IndigencyRequest";
import IndigencyAdmin from "./AdminLandingPage/IndigencyAdmin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/indigency-request" element={<IndigencyRequest />} />
        <Route path="/admin/indigency" element={<IndigencyAdmin />} />
      </Routes>
    </>
  );
};

export default App;
