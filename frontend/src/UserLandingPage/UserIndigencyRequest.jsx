import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import {
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Clock,
  CalendarDays,
  Download,
} from "lucide-react";

const socket = io("http://localhost:5000");

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

const Toast = ({ message, type, onClose, isVisible }) => {
  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md";

    switch (type) {
      case "success":
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      case "error":
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case "warning":
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      default:
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
        );
      case "error":
        return <XCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />;
      case "warning":
        return (
          <AlertCircle className="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0" />
        );
      default:
        return (
          <AlertCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
        );
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div className={getToastStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const useToast = () => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success", duration = 4000) => {
    setToast({ message, type, isVisible: true });
    setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
    }, duration);
    setTimeout(() => {
      setToast(null);
    }, duration + 300);
  };

  const hideToast = () => {
    setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  };

  return { toast, showToast, hideToast };
};

const IndigencyRequest = () => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");
  const [requests, setRequests] = useState([]);
  const [stats, setStatsz] = useState([]);
  const { toast, showToast, hideToast } = useToast();

  const fetchStats = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await axios.get(
        `http://localhost:5000/api/indigency/stats/${userId}`
      );
      const data = res.data;
      setStats([
        {
          title: "Total Requests",
          value: data.total || 0,
          icon: FileText,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
        {
          title: "Pending Requests",
          value: data.pending || 0,
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
        },
        {
          title: "Approved Requests",
          value: data.approved || 0,
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
        },
        {
          title: "This Month",
          value: data.thisMonth || 0,
          icon: CalendarDays,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      // Set default stats if API fails
      setStats([
        {
          title: "Total Requests",
          value: requests.length,
          icon: FileText,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
        {
          title: "Pending Requests",
          value: requests.filter(r => r.status === 'pending').length,
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
        },
        {
          title: "Approved Requests",
          value: requests.filter(r => r.status === 'approved').length,
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
        },
        {
          title: "This Month",
          value: requests.filter(r => new Date(r.created_at).getMonth() === new Date().getMonth()).length,
          icon: CalendarDays,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
        },
      ]);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/indigency/user/${userId}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchStats();
    fetchRequests();
    
    socket.on("newIndigencyRequest", (data) => {
      fetchStats();
      if (data.user_id == userId) {
        setRequests((prev) => [data, ...prev]);
      }
    });
    
    return () => {
      socket.off("newIndigencyRequest");
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5000/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUserInfo(data))
      .catch((err) => console.error("Failed to fetch user info", err));
  }, [userId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    if (!userId) {
      showToast("User not logged in.", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("purpose", purpose);
    formData.append("proof_file", file);
    formData.append("user_id", userId);

    try {
      await axios.post("http://localhost:5000/api/indigency", formData);
      showToast("Indigency certificate request submitted successfully!", "success");
      setPurpose("");
      setFile(null);
      fetchRequests();
      fetchStats();
    } catch (err) {
      console.error(err);
      showToast("Failed to submit request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    navigate("/");
  };

  const handleDownload = (requestId) => {
    window.open(
      `http://localhost:5000/api/indigency/download/${requestId}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Indigency Certificate
                </h1>
                <p className="text-gray-600">
                  Request and manage your indigency certificates.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {getInitials(userInfo.first_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0 hidden sm:block">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userInfo.first_name || "Loading..."}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userInfo.email || "Fetching email..."}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`w-6 h-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Request Indigency Certificate
              </h2>
              <p className="text-teal-100 text-sm mt-1">
                Submit your request for an indigency certificate
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purpose of Request
                  </label>
                  <textarea
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                    rows="4"
                    placeholder="Please state the reason for your indigency certificate request..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Supporting Document (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Note:</span> Purpose field is required.
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 hover:shadow-lg transform hover:-translate-y-0.5"
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Submit Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-teal-600" />
              My Indigency Requests
            </h3>
            <div className="space-y-3">
              {requests.length === 0 ? (
                <p className="text-gray-500">No requests submitted yet.</p>
              ) : (
                requests
                  .slice()
                  .reverse()
                  .map((request, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            request.status === "approved"
                              ? "bg-green-500"
                              : request.status === "pending"
                              ? "bg-yellow-500"
                              : request.status === "rejected"
                              ? "bg-red-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            Purpose: {request.purpose}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            Status: {request.status}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {request.status === "approved" && (
                          <button
                            onClick={() => handleDownload(request.id)}
                            className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm font-medium"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download</span>
                          </button>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IndigencyRequest;