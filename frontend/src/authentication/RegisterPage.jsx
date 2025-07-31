import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle,
  User,
  Phone,
} from "lucide-react";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    role: "user", 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [validations, setValidations] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "email") {
      setValidations((prev) => ({
        ...prev,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      }));
    } else if (name === "password") {
      setValidations((prev) => ({
        ...prev,
        password: value.length >= 6,
      }));
    } else if (name === "firstName" || name === "lastName") {
      setValidations((prev) => ({
        ...prev,
        [name]: value.trim().length > 0,
      }));
    } else if (name === "phoneNumber") {
      setValidations((prev) => ({
        ...prev,
        phoneNumber: /^\+?[0-9\s-()]{7,20}$/.test(value),
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.phoneNumber ||
      !form.role 
    ) {
      toast.error("All fields are required!");
      return;
    }

    if (
      !validations.firstName ||
      !validations.lastName ||
      !validations.email ||
      !validations.password ||
      !validations.phoneNumber
    ) {
      toast.error(
        "Please ensure all fields are valid: email, password (at least 6 chars), name, and phone number."
      );
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("http://localhost:5000/api/register", form);
      toast.success(
        "Registered successfully! Check your email for verification. Your account is pending approval."
      );
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsLoading(false);
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
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating dots animation */}
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
              Create Account
            </h1>
            <p className="text-gray-600 text-lg">
              Join our amazing community today
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-gray-200 shadow-xl shadow-gray-300/50">
              {/* First Name Field */}
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User
                    className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === "firstName"
                        ? "text-teal-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className={inputClasses("firstName")}
                  value={form.firstName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("firstName")}
                  onBlur={() => setFocusedField("")}
                  required
                />
                {validations.firstName && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 animate-scale-in" />
                  </div>
                )}
              </div>

              {/* Last Name Field */}
              <div className="relative mb-6">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <User
                    className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === "lastName"
                        ? "text-teal-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  className={inputClasses("lastName")}
                  value={form.lastName}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("lastName")}
                  onBlur={() => setFocusedField("")}
                  required
                />
                {validations.lastName && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 animate-scale-in" />
                  </div>
                )}
              </div>

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
              <div className="relative mb-6">
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
                  placeholder="Create a secure password"
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

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Password Strength
                    </span>
                    <span
                      className={`text-sm font-medium ${
                        form.password.length >= 8
                          ? "text-emerald-500"
                          : form.password.length >= 6
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {form.password.length >= 8
                        ? "Strong"
                        : form.password.length >= 6
                        ? "Medium"
                        : "Weak"}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        form.password.length >= 8
                          ? "bg-emerald-500 w-full"
                          : form.password.length >= 6
                          ? "bg-yellow-500 w-2/3"
                          : form.password.length >= 3
                          ? "bg-red-500 w-1/3"
                          : "w-0"
                      }`}
                    ></div>
                  </div>
                </div>
              )}

              {/* Phone Number Field */}
              <div className="relative mb-8">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <Phone
                    className={`w-5 h-5 transition-all duration-300 ${
                      focusedField === "phoneNumber"
                        ? "text-teal-500"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter your phone number"
                  className={inputClasses("phoneNumber")}
                  value={form.phoneNumber}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("phoneNumber")}
                  onBlur={() => setFocusedField("")}
                  required
                />
                {validations.phoneNumber && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <CheckCircle className="w-5 h-5 text-emerald-500 animate-scale-in" />
                  </div>
                )}
              </div>

              {/* Role Selection Field */}
              <div className="mb-8">
                <label
                  htmlFor="role-select"
                  className="block text-gray-700 text-sm font-medium mb-2"
                >
                  Register as:
                </label>
                <select
                  id="role-select"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400 bg-white text-gray-800"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={
                  isLoading ||
                  !validations.firstName ||
                  !validations.lastName ||
                  !validations.email ||
                  !validations.password ||
                  !validations.phoneNumber
                }
                className={`
                  group relative w-full py-4 px-6 rounded-2xl font-semibold text-lg
                  transition-all duration-300 transform hover:scale-[1.02]
                  focus:outline-none focus:ring-4 focus:ring-teal-300/50
                  ${
                    isLoading ||
                    !validations.firstName ||
                    !validations.lastName ||
                    !validations.email ||
                    !validations.password ||
                    !validations.phoneNumber
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-600 hover:to-indigo-700 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-400/40"
                  }
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Already have an account?{" "}
                <Link
                  to="/"
                  className="text-teal-600 hover:text-teal-800 font-medium underline decoration-teal-600 underline-offset-4 hover:decoration-teal-800 transition-all duration-200"
                >
                  Sign in here
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
        //! PEDE KAYO GUMAWA NG RegisterPage.css then lagay niyo tong style doon
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

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default RegisterPage;
