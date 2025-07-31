import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; 
import axios from "axios";
import { toast } from "react-toastify"; 
import {
  CheckCircle,
  XCircle,
  Loader2,
  MailOpen,
  Send,
  LogIn,
} from "lucide-react"; 

const VerifyEmailPage = () => {
  const navigate = useNavigate(); 
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const [verificationStatus, setVerificationStatus] = useState("verifying"); 
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState(""); 

  useEffect(() => {
    if (!token) {
      setVerificationStatus("error");
      toast.error("Verification token is missing.");
      return;
    }

    const verifyEmail = async () => {
      try {
        await axios.get(`http://localhost:5000/api/verify?token=${token}`);
        setVerificationStatus("success");
        toast.success(
          "🥳 Your email has been successfully verified! You can now log in."
        );
      } catch (err) {
        setVerificationStatus("error");
        const errorMessage =
          err.response?.data?.message ||
          "Something went wrong during verification.";
        toast.error(`😔 ${errorMessage}`);
      }
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0 && isResending) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setIsResending(false); 
      setResendCountdown(60);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, isResending]);

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendError(""); 
    try {
  
      await axios.post("http://localhost:5000/api/resend-verification", {
        token,
      }); 
      toast.info("📩 New verification email sent! Please check your inbox.");
      setResendCountdown(60);
    } catch (err) {
      const errMsg =
        err.response?.data?.message || "Failed to resend verification email.";
      setResendError(`❌ ${errMsg}`);
      toast.error(`❌ ${errMsg}`);
      setIsResending(false); 
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "verifying":
        return (
          <div className="flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-teal-500 animate-spin-slow mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Verifying your email...
            </h2>
            <p className="text-gray-600 text-lg">Please wait a moment.</p>
          </div>
        );
      case "success":
        return (
          <div className="flex flex-col items-center">
            <CheckCircle className="w-20 h-20 text-emerald-500 animate-scale-bounce mb-6" />
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Email Verified! 🎉
            </h2>
            <p className="text-gray-700 text-xl text-center mb-8 max-w-sm">
              Your account is now active. Welcome aboard!
            </p>
            <button
              onClick={() => navigate("/")}
              className="group relative flex items-center justify-center py-4 px-8 rounded-full font-semibold text-lg
                bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/40
                hover:from-teal-600 hover:to-emerald-700 hover:scale-105 transition-all duration-300 ease-out
                focus:outline-none focus:ring-4 focus:ring-teal-300/60"
            >
              Go to Login
              <LogIn className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        );
      case "error":
        return (
          <div className="flex flex-col items-center">
            <XCircle className="w-20 h-20 text-red-500 animate-jiggle mb-6" />
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              Verification Failed 😔
            </h2>
            <p className="text-gray-700 text-lg text-center mb-6 max-w-md">
              The verification link is invalid or has expired.
            </p>
            {resendError && (
              <p className="text-red-500 text-md font-medium mb-4">
                {resendError}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending && resendCountdown > 0}
                className={`group relative flex items-center justify-center py-3 px-6 rounded-full font-semibold text-lg
                  transition-all duration-300 ease-out focus:outline-none focus:ring-4
                  ${
                    isResending && resendCountdown > 0
                      ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-700 to-teal-400 text-white shadow-md shadow-teal-500/30 hover:from-teal-600 hover:to-indigo-700 hover:scale-105 focus:ring-teal-300/60"
                  }
                `}
              >
                {isResending && resendCountdown > 0 ? (
                  <>
                    Resend in {resendCountdown}s
                    <Send className="w-5 h-5 ml-3" />
                  </>
                ) : (
                  <>
                    Resend Verification Email
                    <MailOpen className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </button>
              <button
                onClick={() => navigate("/")}
                className="group relative flex items-center justify-center py-3 px-6 rounded-full font-semibold text-lg
                  bg-gray-200 text-gray-800 shadow-md shadow-gray-300/50
                  hover:bg-gray-300 hover:scale-105 transition-all duration-300 ease-out
                  focus:outline-none focus:ring-4 focus:ring-gray-400/60"
              >
                Go to Login
                <LogIn className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 flex items-center justify-center p-4">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-pulse-slow opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-teal-200/15 rounded-full blur-3xl animate-pulse-slow delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse-slow delay-500 opacity-60 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gray-300/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-lg rounded-3xl p-10 md:p-12 border border-gray-200 shadow-2xl shadow-gray-400/40 text-center animate-fade-in-up">
        {renderContent()}
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }

        @keyframes scale-bounce {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.15);
            opacity: 1;
          }
          75% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes jiggle {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-5px) translateX(5px);
          }
          50% {
            transform: translateY(0) translateX(0);
          }
          75% {
            transform: translateY(5px) translateX(-5px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 5s ease-in-out infinite;
        }
        .animate-scale-bounce {
          animation: scale-bounce 0.6s ease-out forwards;
        }
        .animate-jiggle {
          animation: jiggle 0.2s infinite alternate;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmailPage;
