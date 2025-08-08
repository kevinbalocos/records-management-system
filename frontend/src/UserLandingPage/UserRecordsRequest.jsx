import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
  Bell, // For SystemAlert
} from "lucide-react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
const API_BASE = "http://localhost:5000";
const BASE_URL = "http://localhost:5000";

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Custom SystemAlert component (copied from LoginPage, adapted for general use)
const SystemAlert = ({
  message,
  type,
  onClose,
  isVisible,
  isDarkMode = false,
}) => {
  const getAlertStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border max-w-lg w-full";
    if (isDarkMode) {
      switch (type) {
        case "success":
          return `${baseStyles} bg-emerald-900/90 border-emerald-700 text-emerald-200`;
        case "error":
          return `${baseStyles} bg-red-900/90 border-red-700 text-red-200`;
        case "warning":
          return `${baseStyles} bg-amber-900/90 border-amber-700 text-amber-200`;
        case "info":
          return `${baseStyles} bg-blue-900/90 border-blue-700 text-blue-200`;
        default:
          return `${baseStyles} bg-blue-900/90 border-blue-700 text-blue-200`;
      }
    } else {
      switch (type) {
        case "success":
          return `${baseStyles} bg-emerald-50/90 border-emerald-200 text-emerald-800`;
        case "error":
          return `${baseStyles} bg-red-50/90 border-red-200 text-red-800`;
        case "warning":
          return `${baseStyles} bg-amber-50/90 border-amber-200 text-amber-800`;
        case "info":
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
        default:
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      }
    }
  };

  const getIcon = () => {
    const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
    if (isDarkMode) {
      switch (type) {
        case "success":
          return <CheckCircle className={`${iconClass} text-emerald-400`} />;
        case "error":
          return <XCircle className={`${iconClass} text-red-400`} />;
        case "warning":
          return <AlertCircle className={`${iconClass} text-amber-400`} />;
        case "info":
          return <Bell className={`${iconClass} text-blue-400`} />;
        default:
          return <AlertCircle className={`${iconClass} text-blue-400`} />;
      }
    } else {
      switch (type) {
        case "success":
          return <CheckCircle className={`${iconClass} text-emerald-500`} />;
        case "error":
          return <XCircle className={`${iconClass} text-red-500`} />;
        case "warning":
          return <AlertCircle className={`${iconClass} text-amber-500`} />;
        case "info":
          return <Bell className={`${iconClass} text-blue-500`} />;
        default:
          return <AlertCircle className={`${iconClass} text-blue-500`} />;
      }
    }
  };

  return (
    <div
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-500 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-full opacity-0 scale-95"
        }`}
    >
      <div className={getAlertStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-semibold text-base">{message}</p>
        </div>
        <button
          onClick={onClose}
          className={`ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/20
                      ${
                        isDarkMode
                          ? "dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700/50"
                          : ""
                      }`}
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Custom hook for notifications (re-using the logic, renamed for clarity)
const useSystemAlert = () => {
  const [alertState, setAlertState] = useState(null);

  const showAlert = useCallback(
    (message, type = "success", duration = 4000, isDarkMode = false) => {
      setAlertState({ message, type, isVisible: true, isDarkMode });
      setTimeout(() => {
        setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
      }, duration);
      setTimeout(() => {
        setAlertState(null);
      }, duration + 300);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setAlertState(null);
    }, 300);
  }, []);

  return { alert: alertState, showAlert, hideAlert };
};

const RecordsLandingPage = () => {
  const navigate = useNavigate();
  const [type, setType] = useState(""); // Initial type can be empty or first fetched type
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState([]);
  const [requestTypes, setRequestTypes] = useState([]); // State for dynamic request types
  const { alert: systemAlert, showAlert, hideAlert } = useSystemAlert(); // Using new hook name
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);

  const fetchStats = async () => {
    try {
      // Changed endpoint to fetch global statistics, as defined in backend/controllers/requestController.js
      const res = await axios.get(`${API_BASE}/api/requests/stats`);
      const data = res.data;
      setStats([
        {
          title: "Total Requests",
          value: data.total,
          icon: FileText,
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
        {
          title: "Pending Requests",
          value: data.pending,
          icon: Clock,
          bgColor: "bg-yellow-100",
          textColor: "text-yellow-600",
        },
        {
          title: "Completed Requests",
          value: data.completed,
          icon: CheckCircle,
          bgColor: "bg-green-100",
          textColor: "text-green-600",
        },
        {
          title: "This Month",
          value: data.thisMonth,
          icon: CalendarDays,
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
        },
      ]);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showAlert("Failed to load statistics.", "error");
    }
  };

  const handleProceedToPayment = async (requestId) => {
    setSelectedRequestId(requestId);
    setShowPaymentModal(true);
  };

  const handleReceiptUpload = async () => {
    if (!receiptFile || !selectedRequestId) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", receiptFile);

    try {
      // Step 1: Upload receipt
      await axios.post(
        `${BASE_URL}/api/requests/${selectedRequestId}/receipt`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Step 2: Mark as paid
      await axios.put(`${BASE_URL}/api/requests/${selectedRequestId}/payment`);

      alert("Receipt uploaded and request marked as paid.");
      setShowPaymentModal(false);
      setReceiptFile(null);
      fetchRequests(); // Refresh request list
    } catch (err) {
      console.error("Error during receipt upload or marking as paid:", err);
      alert("Upload failed.");
    }
  };

  const fetchRequestTypes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/request-types?status=published`
      );

      setRequestTypes(res.data);

      // Set default type only if none is currently selected
      if (res.data.length > 0 && !type) {
        setType(res.data[0].name);
      } else if (res.data.length === 0) {
        setType(""); // Clear if no types
      }
    } catch (err) {
      console.error("Failed to fetch request types:", err);
      showAlert("Failed to load available request types.", "error");
    }
  }, [showAlert, type]);

  useEffect(() => {
    if (!userId) return;
    fetchStats();
    fetchRequestTypes(); // Fetch request types on mount

    // Check for persistent login notification
    const storedNotification = sessionStorage.getItem("loginNotification");
    if (storedNotification) {
      try {
        const { message, type } = JSON.parse(storedNotification);
        showAlert(message, type);
        sessionStorage.removeItem("loginNotification");
      } catch (e) {
        console.error("Failed to parse stored notification:", e);
      }
    }

    socket.on("newRequest", (data) => {
      fetchStats();
      if (data.user_id == userId) {
        setActivities((prev) => [data, ...prev]);
        showAlert("Your request status has been updated!", "info");
      }
    });
    return () => {
      socket.off("newRequest");
    };
  }, [userId, fetchStats, fetchRequestTypes, showAlert]);

  const fetchRequests = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`${API_BASE}/api/requests/user/${userId}`);
      setActivities(res.data);
    } catch (error) {
      console.error("Failed to fetch user requests:", error);
      showAlert("Failed to load your past requests.", "error");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId, showAlert]);

  useEffect(() => {
    if (!userId) return;
    fetch(`${API_BASE}/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUserInfo(data))
      .catch((err) => {
        console.error("Failed to fetch user info", err);
        showAlert("Failed to load user information.", "error");
      });
  }, [userId, showAlert]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    if (!userId) {
      showAlert("User not logged in.", "error");
      setIsSubmitting(false);
      return;
    }
    // Check if a type is selected and if there are any request types available
    if (!type || !details || !file || requestTypes.length === 0) {
      showAlert(
        "Please fill in all fields, upload a document, and ensure request types are available.",
        "warning"
      );
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("details", details);
    formData.append("file", file);
    formData.append("user_id", userId);
    try {
      const res = await fetch(`${API_BASE}/api/requests`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to submit request");
      showAlert("Request submitted successfully!", "success");
      setDetails("");
      setFile(null);
      // Reset type to the first available type after submission
      if (requestTypes.length > 0) {
        setType(requestTypes[0].name);
      } else {
        setType("");
      }
    } catch (error) {
      console.error(error);
      showAlert("Failed to submit request.", "error");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50">
      {systemAlert && (
        <SystemAlert
          message={systemAlert.message}
          type={systemAlert.type}
          onClose={hideAlert}
          isVisible={systemAlert.isVisible}
        />
      )}

      {/* Main Content */}
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resident Records
                </h1>
                <p className="text-gray-600">
                  Manage and view resident information and records.
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
                Create New Request
              </h2>
              <p className="text-teal-100 text-sm mt-1">
                Submit your request for processing by the LGU office
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Request Type
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      disabled={isSubmitting || requestTypes.length === 0}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      {requestTypes.length === 0 ? (
                        <option value="">No request types available</option>
                      ) : (
                        requestTypes.map((reqType) => {
                          // Changed to explicit return
                          return (
                            <option key={reqType.id} value={reqType.name}>
                              {reqType.name}
                            </option>
                          );
                        })
                      )}
                    </select>
                    {requestTypes.length === 0 && (
                      <p className="text-sm text-red-500 mt-1">
                        No request types are currently published. Please contact
                        admin.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Upload Supporting Document
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        disabled={isSubmitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                        required
                      />
                      <Upload className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Request Details
                  </label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                    rows="4"
                    placeholder="Please provide detailed information about your request..."
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Note:</span> All fields are
                    required.
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting || requestTypes.length === 0}
                    className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${
                      isSubmitting || requestTypes.length === 0
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
              Recent Activity
            </h3>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-gray-500">No recent activity yet.</p>
              ) : (
                activities
                  .slice()
                  .reverse()
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            activity.status === "completed"
                              ? "bg-green-500"
                              : activity.status === "pending"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.type}
                          </p>
                          <p className="text-sm text-gray-600 capitalize">
                            {activity.status}
                          </p>

                          {/* Step 1: Show Proceed to Payment button if unpaid */}
                          {activity.status === "approved" &&
                            activity.payment_status === "unpaid" && (
                              <button
                                onClick={() =>
                                  handleProceedToPayment(activity.id)
                                }
                                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                              >
                                Proceed to Payment
                              </button>
                            )}

                          {/* Step 2: Show Payment Completed if receipt uploaded (paid) */}
                          {activity.status === "approved" &&
                            activity.payment_status === "paid" && (
                              <p className="mt-2 text-green-600 text-xs font-medium">
                                Payment Completed (Awaiting Admin Confirmation)
                              </p>
                            )}

                          {/* Step 3: Final document ready */}
                          {activity.status === "completed" &&
                            activity.admin_file_path && (
                              <a
                                href={`${API_BASE}/uploads/${activity.admin_file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-xs text-blue-600 hover:underline"
                              >
                                Download Final Document
                              </a>
                            )}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
     {showPaymentModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-[90%] max-w-md relative">
            <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">
              GCash Payment
            </h2>

            <div className="flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 w-full">
                <div className="w-full max-w-xs mx-auto h-48 bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg border border-gray-300 shadow-sm flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📱</div>
                    <div className="text-sm">GCash QR Code</div>
                  </div>
                </div>
                <p className="text-center text-gray-600 mt-2 text-sm">
                  Scan the QR code using your GCash app to proceed with payment.
                </p>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Receipt:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setReceiptFile(e.target.files[0])}
                  className="block w-full mb-4 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
              </div>

              <div className="flex justify-end gap-2 w-full">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-3 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReceiptUpload}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Submit Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordsLandingPage;
