import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  User,
  CalendarDays,
  List,
  FolderOpen,
  Search,
  Filter,
  Download,
  Eye,
  RefreshCw,
  ChevronDown,
  Bell, // Added Bell for info toast
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// Using built-in Date methods instead of moment (as per your original code)
// import moment from "moment"; // Removed as per your comment

const API_BASE = "http://localhost:5000";

// Custom Toast component for consistency
const Toast = ({ message, type, onClose, isVisible, isDarkMode }) => {
  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border min-w-80 max-w-md";

    if (isDarkMode) {
      switch (type) {
        case "success":
          return `${baseStyles} bg-emerald-900/90 border-emerald-700 text-emerald-200`;
        case "error":
          return `${baseStyles} bg-red-900/90 border-red-700 text-red-200`;
        case "warning":
          return `${baseStyles} bg-amber-900/90 border-amber-700 text-amber-200`;
        case "info": // Added info type
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
        case "info": // Added info type
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
        default:
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      }
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
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
      className={`fixed top-6 right-6 z-50 transform transition-all duration-500 ease-out ${
        isVisible
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
      }`}
    >
      <div className={getToastStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-semibold text-sm">{message}</p>
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
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Custom hook for toast notifications
const useToast = () => {
  const [toastState, setToastState] = useState(null);

  const showToast = useCallback(
    (message, type = "success", duration = 4000, isDarkMode = false) => {
      setToastState({ message, type, isVisible: true, isDarkMode });
      setTimeout(() => {
        setToastState((prev) => (prev ? { ...prev, isVisible: false } : null));
      }, duration);
      setTimeout(() => {
        setToastState(null);
      }, duration + 300);
    },
    []
  );

  const hideToast = useCallback(() => {
    setToastState((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setToastState(null);
    }, 300);
  }, []);

  return { toast: toastState, showToast, hideToast };
};

// Status classes matching AdminDashboard - now also supports dark mode
const getStatusClasses = (status, isDarkMode) => {
  if (isDarkMode) {
    switch (status) {
      case "pending":
        return "text-amber-200 bg-amber-900/50 border-amber-700";
      case "approved":
        return "text-emerald-200 bg-emerald-900/50 border-emerald-700";
      case "rejected":
        return "text-red-200 bg-red-900/50 border-red-700";
      default:
        return "text-gray-300 bg-gray-700/50 border-gray-600";
    }
  } else {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "approved":
        return "text-green-600 bg-green-100 border-green-200";
      case "rejected":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  }
};

const RequestCard = ({
  request,
  onViewDetails,
  onUpdateStatus,
  isDarkMode,
}) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status) => {
    const iconClass = `w-4 h-4 mr-2 ${isDarkMode ? "text-current" : ""}`; // Use text-current to inherit color from parent span
    switch (status) {
      case "pending":
        return <Clock className={iconClass} />;
      case "approved":
        return <CheckCircle className={iconClass} />;
      case "rejected":
        return <XCircle className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`group rounded-xl border p-6 shadow-sm hover:shadow-lg transition-all duration-300
                    ${
                      isDarkMode
                        ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <User
              className={`w-5 h-5 ${
                isDarkMode ? "text-teal-400" : "text-teal-600"
              }`}
            />
            <span
              className={`font-semibold ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}
            >
              {request.first_name} {request.last_name}
            </span>
          </div>
          <span
            className={`ml-4 text-xs font-medium px-2 py-1 rounded-full border flex items-center ${getStatusClasses(
              request.status,
              isDarkMode
            )}`}
          >
            {getStatusIcon(request.status)}
            {request.status}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => onViewDetails(request)}
            className={`p-1 rounded-full transition-colors
                       ${
                         isDarkMode
                           ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                           : "text-gray-500 hover:text-gray-800 hover:bg-gray-200"
                       }`}
            title="View Details"
          >
            <Eye className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div
        className={`border-t pt-2 flex justify-between items-center ${
          isDarkMode ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="font-medium">Purpose:</span> {request.purpose}
          </p>
          <p
            className={`text-sm ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <span className="font-medium">Date:</span>{" "}
            {formatDate(request.created_at)}
          </p>
        </div>
        <div className="flex space-x-2">
          {request.status === "pending" && (
            <button
              onClick={() => onUpdateStatus(request.id, "approved")}
              className={`p-2 rounded-full transition-colors
                         ${
                           isDarkMode
                             ? "bg-emerald-900/50 text-emerald-400 hover:bg-emerald-800/70"
                             : "bg-green-50 text-green-600 hover:bg-green-100"
                         }`}
              title="Approve Request"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}
          {request.status === "approved" && (
            <button
              onClick={() => onUpdateStatus(request.id, "download")} // Changed to trigger download via parent
              className={`p-2 rounded-full transition-colors
                         ${
                           isDarkMode
                             ? "bg-blue-900/50 text-blue-400 hover:bg-blue-800/70"
                             : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                         }`}
              title="Download Certificate"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestDetailsModal = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onDownload,
  isDarkMode,
}) => {
  if (!isOpen || !request) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleViewDocument = (filePath) => {
    if (filePath) {
      const cleanedPath = filePath.startsWith("uploads/")
        ? filePath
        : `uploads/${filePath}`;
      const fullUrl = `${API_BASE}/${cleanedPath}`;
      window.open(fullUrl, "_blank");
    }
  };

  const getStatusIcon = (status) => {
    const iconClass = `w-4 h-4 mr-2 ${isDarkMode ? "text-current" : ""}`;
    switch (status) {
      case "pending":
        return <Clock className={iconClass} />;
      case "approved":
        return <CheckCircle className={iconClass} />;
      case "rejected":
        return <XCircle className={iconClass} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div
          className={`relative w-full max-w-2xl transform rounded-2xl shadow-2xl transition-all
                        ${
                          isDarkMode
                            ? "bg-gray-800 text-gray-100"
                            : "bg-white text-gray-900"
                        }`}
        >
          <div
            className={`px-8 py-6 border-b ${
              isDarkMode ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Indigency Certificate Details
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-colors
                           ${
                             isDarkMode
                               ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                               : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                           }`}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="px-8 py-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p
                className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Name:
                </span>{" "}
                {request.first_name} {request.last_name}
              </p>
              <p
                className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  User ID:
                </span>{" "}
                {request.user_id}
              </p>
              <p
                className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status:
                </span>{" "}
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusClasses(
                    request.status,
                    isDarkMode
                  )}`}
                >
                  {getStatusIcon(request.status)}
                  {request.status}
                </span>
              </p>
              <p
                className={`${isDarkMode ? "text-gray-200" : "text-gray-900"}`}
              >
                <span
                  className={`font-semibold ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Submitted:
                </span>{" "}
                {formatDate(request.created_at)}
              </p>
            </div>
            <div>
              <p
                className={`font-semibold mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Purpose:
              </p>
              <div
                className={`p-4 rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p>{request.purpose}</p>
              </div>
            </div>
            {request.proof_file && (
              <div>
                <p
                  className={`font-semibold mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Supporting Document:
                </p>
                <button
                  onClick={() => handleViewDocument(request.proof_file)}
                  className={`flex items-center p-3 border rounded-lg w-full justify-center
                             ${
                               isDarkMode
                                 ? "border-gray-600 text-teal-400 hover:bg-gray-700/50"
                                 : "border-gray-300 text-teal-600 hover:bg-teal-50"
                             } transition-colors`}
                >
                  <FolderOpen className="w-5 h-5 mr-3" />
                  View Proof Document
                </button>
              </div>
            )}
            {request.status === "pending" && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    onApprove(request.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors
                             ${
                               isDarkMode
                                 ? "bg-emerald-700 text-white hover:bg-emerald-600"
                                 : "bg-blue-600 text-white hover:bg-blue-700"
                             }`}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Approve Request & Generate Certificate
                </button>
              </div>
            )}
            {request.status === "approved" && (
              <div className="pt-4 border-t">
                <button
                  onClick={() => onDownload(request.id)}
                  className={`w-full flex items-center justify-center p-3 rounded-lg transition-colors
                             ${
                               isDarkMode
                                 ? "bg-blue-700 text-white hover:bg-blue-600"
                                 : "bg-blue-600 text-white hover:bg-blue-700"
                             }`}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Certificate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const IndigencyAdmin = ({ isDarkMode = false }) => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    thisMonth: 0,
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast: customToast, showToast, hideToast } = useToast();

  const fetchRequests = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/indigency`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
      showToast("Failed to load indigency requests", "error", isDarkMode);
      setRequests([]);
    }
  }, [showToast, isDarkMode]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/indigency`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];

      const total = data.length;
      const pending = data.filter((req) => req.status === "pending").length;
      const approved = data.filter((req) => req.status === "approved").length;
      const thisMonth = data.filter((req) => {
        const reqDate = new Date(req.created_at);
        const now = new Date();
        return (
          reqDate.getMonth() === now.getMonth() &&
          reqDate.getFullYear() === now.getFullYear()
        );
      }).length;

      setStats({ total, pending, approved, thisMonth });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      showToast("Failed to load statistics.", "error", isDarkMode);
    }
  }, [showToast, isDarkMode]);

  useEffect(() => {
    fetchRequests();
    fetchStats();

    // Assuming a similar socket event for indigency requests if applicable
    // socket.on("newIndigencyRequest", (newRequest) => {
    //   // Logic to update requests and show toast
    //   showToast("A new indigency request has been submitted!", "info", isDarkMode);
    //   fetchRequests();
    //   fetchStats();
    // });

    // return () => {
    //   socket.off("newIndigencyRequest");
    // };
  }, [fetchRequests, fetchStats, isDarkMode]);

  const handleApproveRequest = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/indigency/approve/${id}`);
      showToast(
        "Request approved and certificate generated",
        "success",
        isDarkMode
      );
      fetchRequests();
      fetchStats();
    } catch (err) {
      console.error("Approve error:", err);
      showToast("Failed to approve request", "error", isDarkMode);
    }
  };

  const handleDownloadCertificate = (id) => {
    window.open(`${API_BASE}/api/indigency/download/${id}`, "_blank");
    showToast("Certificate download initiated.", "info", isDarkMode);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-inter transition-colors duration-300
                    ${
                      isDarkMode
                        ? "bg-gray-900 text-gray-100"
                        : "bg-gray-50 text-gray-900"
                    }`}
    >
      {/* Custom Toast Notification */}
      {customToast && (
        <Toast
          message={customToast.message}
          type={customToast.type}
          onClose={hideToast}
          isVisible={customToast.isVisible}
          isDarkMode={isDarkMode} // Pass isDarkMode directly from AdminRecordsRequest's prop
        />
      )}

      {/* Modal for Request Details */}
      <RequestDetailsModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={closeModal}
        onApprove={handleApproveRequest}
        onDownload={handleDownloadCertificate}
        isDarkMode={isDarkMode}
      />

      {/* Header */}
      <header
        className={`shadow-sm p-6 flex items-center justify-between z-10 sticky top-0 transition-colors duration-300
                         ${
                           isDarkMode
                             ? "bg-gray-800 border-b border-gray-700"
                             : "bg-white border-b border-gray-100"
                         }`}
      >
        <h1
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          <span className={`${isDarkMode ? "text-teal-400" : "text-teal-600"}`}>
            Indigency
          </span>{" "}
          Certificate Admin
        </h1>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            className={`p-6 rounded-xl shadow-md border transform hover:scale-105 transition-all duration-200
                          ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Total Requests
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.total || 0}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  isDarkMode
                    ? "bg-teal-900/50 text-teal-400"
                    : "bg-teal-100 text-teal-600"
                }`}
              >
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md border transform hover:scale-105 transition-all duration-200
                          ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Pending
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.pending || 0}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  isDarkMode
                    ? "bg-amber-900/50 text-amber-400"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md border transform hover:scale-105 transition-all duration-200
                          ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  Approved
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.approved || 0}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  isDarkMode
                    ? "bg-emerald-900/50 text-emerald-400"
                    : "bg-green-100 text-green-600"
                }`}
              >
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-xl shadow-md border transform hover:scale-105 transition-all duration-200
                          ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700"
                              : "bg-white border-gray-200"
                          }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  This Month
                </p>
                <p
                  className={`text-3xl font-bold mt-1 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stats.thisMonth || 0}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  isDarkMode
                    ? "bg-blue-900/50 text-blue-400"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests List Section */}
        <div
          className={`rounded-xl shadow-sm border p-6 transition-colors duration-300
                        ${
                          isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-200"
                        }`}
        >
          <div
            className={`flex justify-between items-center mb-6 border-b pb-4 ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <h2
              className={`text-2xl font-semibold flex items-center ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <List
                className={`w-6 h-6 mr-2 ${
                  isDarkMode ? "text-teal-400" : "text-teal-600"
                }`}
              />
              Indigency Certificate Requests
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 custom-scrollbar max-h-[50vh] overflow-y-auto pr-2">
            {requests.length === 0 ? (
              <div
                className={`py-12 text-center text-lg ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <p>No indigency certificate requests at the moment.</p>
              </div>
            ) : (
              requests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={openModal}
                  onUpdateStatus={(id, status) => {
                    if (status === "approved") {
                      handleApproveRequest(id);
                    } else if (status === "download") {
                      handleDownloadCertificate(id);
                    }
                    // You can add logic for "rejected" if needed
                  }}
                  isDarkMode={isDarkMode}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <style jsx>{`
        /* Custom scrollbar for dark mode */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode
            ? "#374151"
            : "#f1f1f1"}; /* Darker track in dark mode */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode
            ? "#4b5563"
            : "#888"}; /* Darker thumb in dark mode */
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode
            ? "#6b7280"
            : "#555"}; /* Even darker thumb on hover */
        }
      `}</style>
    </div>
  );
};

export default IndigencyAdmin;
