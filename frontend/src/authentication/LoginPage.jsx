import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle,
} from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(""); 
  const [validations, setValidations] = useState({
    email: false,
    password: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      setValidations((prev) => ({
        ...prev,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      }));
    }
    if (name === "password") {
      setValidations((prev) => ({
        ...prev,
        password: value.length >= 6,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("All fields are required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/login", form);

      const { role, status } = res.data;

      localStorage.setItem("userRole", role);
      localStorage.setItem("userStatus", status);
      localStorage.setItem("userEmail", form.email); 

      toast.success("Login successful!");

      if (role === "superadmin") {
        navigate("/admin"); 
      } else if (role === "admin") {
        if (status === "approved") {
          navigate("/admin"); 
        } else {
     
          toast.error("Your admin account is pending approval.");
      
          navigate("/");
        }
      } else if (role === "user") {
        if (status === "approved") {
          navigate("/landing"); 
        } else {
      
          toast.error("Your user account is pending approval.");
       
          navigate("/");
        }
      } else {
       
        toast.error(
          "Login successful, but role/status not recognized. Contact support."
        );
        navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (fieldName) => `
    w-full px-4 py-4 pl-12 bg-white/5 border rounded-xl
    transition-all duration-300 ease-out text-gray-800 placeholder-gray-400
    focus:outline-none focus:border-teal-400 focus:bg-white
    hover:bg-gray-50 hover:border-gray-300
    ${focusedField === fieldName ? "shadow-lg shadow-teal-200/50" : ""}
    ${validations[fieldName] ? "border-emerald-500" : "border-gray-300"}
  `;

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gray-300/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random()}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-200/50 rounded-2xl mb-4 animate-bounce">
              <Sparkles className="w-8 h-8 text-teal-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600 text-lg">Sign in to your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-300/50">
              {/* Email Field */}
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Mail
                    className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === "email"
                        ? "text-teal-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  className={inputClasses("email")}
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  required
                />
                {validations.email && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 animate-scale-in" />
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Lock
                    className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === "password"
                        ? "text-teal-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Your password"
                  className={inputClasses("password")}
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                {validations.password && (
                  <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 animate-scale-in" />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  group relative w-full py-4 px-6 rounded-2xl font-semibold text-lg
                  transition-all duration-300 transform hover:scale-[1.02]
                  focus:outline-none focus:ring-4 focus:ring-teal-300/50
                  ${
                    loading
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40"
                  }
                `}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Logging in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Login
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-teal-600 hover:text-teal-800 font-medium underline decoration-teal-600 underline-offset-4 hover:decoration-teal-800 transition-all duration-200"
                >
                  Register here
                </Link>
              </p>

              {/* Social proof */}
              <div className="flex items-center justify-center space-x-4 text-gray-500">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Secure</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Fast</span>
                </div>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm">Trusted</span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
