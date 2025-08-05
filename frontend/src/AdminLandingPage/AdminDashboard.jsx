import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  LogOut,
  FileText,
  User,
  MoreVertical,
  CalendarDays,
  List,
  FolderOpen,
  Upload,
  PieChart as PieChartIcon, // Renamed to avoid conflict with Recharts PieChart
  BarChart3, // For the bar chart icon
  LineChart as LineChartIcon, // Renamed for line chart icon
  TrendingUp,
  Activity,
  Users,
  Filter,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadialBarChart,
  RadialBar,
  Area,
  AreaChart,
} from "recharts";

// Set up the socket.io client to connect to the backend
const socket = io("http://localhost:5000");

// A reusable Toast component for user notifications
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

// Custom hook to manage toast notifications
const useToast = () => {
  const [toast, setToast] = useState(null);

  // Memoize showToast and hideToast to prevent re-creation on every render
  const showToast = useCallback(
    (message, type = "success", duration = 4000) => {
      setToast({ message, type, isVisible: true });
      setTimeout(() => {
        setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
      }, duration);
      setTimeout(() => {
        setToast(null);
      }, duration + 300);
    },
    []
  ); // Dependencies are empty as setToast is stable

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []); // Dependencies are empty as setToast is stable

  return { toast, showToast, hideToast };
};

// Tailwind CSS classes for different request statuses
const statusClasses = {
  pending: "text-yellow-600 bg-yellow-100 border-yellow-200",
  completed: "text-green-600 bg-green-100 border-green-200",
  rejected: "text-red-600 bg-red-100 border-red-200",
};

// Enhanced color palettes
const CHART_COLORS = {
  primary: ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#a7f3d0"],
  gradient: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe"],
  warm: ["#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"],
  cool: ["#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6"],
  professional: ["#1e293b", "#374151", "#6b7280", "#9ca3af", "#d1d5db"],
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200/50 min-w-32">
        <p className="text-gray-900 font-semibold mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span className="text-gray-700 text-sm">
              {entry.name}:{" "}
              <span className="font-semibold">
                {formatter ? formatter(entry.value) : entry.value}
              </span>
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Custom Legend Component
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: entry.color || entry.payload.fill }}
          />
          <span className="text-gray-700 text-sm font-medium">
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// Chart Container Component
const ChartContainer = ({
  title,
  icon: Icon,
  children,
  className = "",
  actions = null,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${className}`}
  >
    <div className="p-6 pb-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Main Admin Dashboard component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [stats, setStats] = useState({});
  const { toast, showToast, hideToast } = useToast();
  const adminId = localStorage.getItem("userId");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [adminFile, setAdminFile] = useState(null);
  const fileInputRef = useRef(null);

  // States for chart data
  const [requestsByTypeData, setRequestsByTypeData] = useState([]);
  const [requestsByStatusData, setRequestsByStatusData] = useState([]);
  const [requestsOverTimeData, setRequestsOverTimeData] = useState([]);
  const [completionRateData, setCompletionRateData] = useState([]); // New state for Radial Bar Chart

  const [activeChart, setActiveChart] = useState("all");
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("animate-fadeIn");
  }, []);

  // Function to process raw request data into chart-friendly formats
  const processRequestDataForCharts = useCallback((allRequests) => {
    // Requests by Type
    const typeCounts = allRequests.reduce((acc, request) => {
      acc[request.type] = (acc[request.type] || 0) + 1;
      return acc;
    }, {});
    setRequestsByTypeData(
      Object.keys(typeCounts).map((type, index) => ({
        name: type,
        value: typeCounts[type],
        color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
      }))
    );

    // Requests by Status
    const statusCounts = allRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
    setRequestsByStatusData(
      Object.keys(statusCounts).map((status, index) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
        count: statusCounts[status],
        fill: CHART_COLORS.cool[index % CHART_COLORS.cool.length], // Using 'fill' for BarChart
      }))
    );

    // Requests Over Time (Monthly)
    const monthlyCounts = allRequests.reduce((acc, request) => {
      const monthYear = moment(request.created_at).format("MMM YYYY");
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    // Generate data for the last 12 months, even if no requests
    const last12MonthsData = [];
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, "months").format("MMM YYYY");
      last12MonthsData.push({
        month: month,
        count: monthlyCounts[month] || 0,
      });
    }
    setRequestsOverTimeData(last12MonthsData);
  }, []); // No dependencies, as it only uses its arguments and constants

  // Fetches all requests with associated resident names from the backend
  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      setRequests(response.data);
      processRequestDataForCharts(response.data); // Process data for charts
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      showToast("Failed to load requests.", "error");
    }
  }, [processRequestDataForCharts, showToast]); // Dependencies for useCallback

  // Fetches the logged-in admin's information
  const fetchAdminInfo = useCallback(async () => {
    if (!adminId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${adminId}`
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch admin info", error);
    }
  }, [adminId]); // Dependencies for useCallback

  // Fetches aggregated statistics for the dashboard
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/requests/stats"
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []); // No dependencies, as it only uses constants

  useEffect(() => {
    fetchRequests();
    fetchAdminInfo();
    fetchStats();

    // Listen for new requests via WebSocket and update state
    socket.on("newRequest", (newRequest) => {
      // Fetch the resident's name for the new request and update the list
      axios
        .get(`http://localhost:5000/api/users/${newRequest.user_id}`)
        .then((userRes) => {
          setRequests((prevRequests) => {
            const updatedRequests = [
              { ...newRequest, resident_name: userRes.data.first_name },
              ...prevRequests,
            ];
            processRequestDataForCharts(updatedRequests); // Re-process charts
            return updatedRequests;
          });
          showToast(
            `A new request from ${userRes.data.first_name} has been submitted!`,
            "info"
          );
          fetchStats(); // Update stats as well
        })
        .catch((err) => {
          console.error("Failed to fetch new request user info:", err);
          setRequests((prevRequests) => {
            const updatedRequests = [
              { ...newRequest, resident_name: "Unknown Resident" },
              ...prevRequests,
            ];
            processRequestDataForCharts(updatedRequests); // Re-process charts
            return updatedRequests;
          });
          showToast("A new resident request has been submitted!", "info");
        });
    });

    // Clean up the socket listener on unmount
    return () => {
      socket.off("newRequest");
    };
  }, [
    adminId,
    fetchRequests,
    fetchAdminInfo,
    fetchStats,
    processRequestDataForCharts,
    showToast,
  ]);

  // Calculate completion rate data whenever stats change
  useEffect(() => {
    if (stats.total > 0) {
      const completionPercentage = (stats.completed / stats.total) * 100;
      setCompletionRateData([
        {
          name: "Completed",
          value: completionPercentage,
          fill: CHART_COLORS.cool[1],
        },
        {
          name: "Remaining",
          value: 100 - completionPercentage,
          fill: "#e0e0e0",
        }, // Grey for remaining
      ]);
    } else {
      setCompletionRateData([{ name: "No Data", value: 100, fill: "#e0e0e0" }]); // Show 100% grey if no data
    }
  }, [stats]);

  // Updates the status of a request (completed or rejected)
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/requests/${id}/status`, {
        status,
      });
      showToast("Request status updated successfully!", "success");
      fetchRequests(); // Refresh the requests list and charts
      fetchStats(); // Refresh the stats
      if (selectedRequest && selectedRequest.id === id) {
        // Update the selected request in modal if it's the one being updated
        setSelectedRequest((prev) => ({ ...prev, status: status }));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update request status.", "error");
    }
  };

  // Handles admin logout
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // Opens the modal to view request details
  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    setAdminFile(null); // Clear any previously selected file
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  // Closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    setAdminFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handles admin file upload
  const handleAdminFileUpload = async () => {
    if (!selectedRequest || !adminFile) {
      showToast("Please select a file to upload.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("file", adminFile);

    try {
      await axios.post(
        `http://localhost:5000/api/requests/${selectedRequest.id}/admin-file`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      showToast("File uploaded and request completed!", "success");
      closeModal();
      fetchRequests(); // Refresh list to show updated status and file path, re-process charts
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error("Failed to upload admin file:", error);
      showToast("Failed to upload file.", "error");
    }
  };

  // Returns the appropriate icon for a given status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-2" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  // Custom dot for line chart
  const CustomDot = (props) => {
    const { cx, cy, fill } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={fill}
        stroke="#fff"
        strokeWidth={2}
        className="drop-shadow-sm hover:r-6 transition-all duration-200"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.8s ease-out;
        }
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}

      {/* Modal for Request Details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Request Details
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <span className="font-semibold text-gray-700">Resident:</span>{" "}
                  {selectedRequest.resident_name ||
                    `ID: ${selectedRequest.user_id}`}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Type:</span>{" "}
                  {selectedRequest.type}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Status:</span>{" "}
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                      statusClasses[selectedRequest.status]
                    }`}
                  >
                    {getStatusIcon(selectedRequest.status)}
                    {selectedRequest.status}
                  </span>
                </p>
                <p>
                  <span className="font-semibold text-gray-700">
                    Submitted:
                  </span>{" "}
                  {moment(selectedRequest.created_at).format("LLL")}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">Details:</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedRequest.details}</p>
                </div>
              </div>
              {selectedRequest.file_path && (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">
                    Resident's Supporting Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-300 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 mr-3" />
                    View Resident Document
                  </a>
                </div>
              )}
              {selectedRequest.admin_file_path && (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">
                    Admin's Uploaded Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.admin_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 mr-3" />
                    View Admin Document
                  </a>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="font-semibold text-gray-700 mb-2">
                    Upload Admin Response File (Optional, marks as Completed):
                  </p>
                  <div className="flex items-center space-x-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setAdminFile(e.target.files[0])}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                    />
                    <button
                      onClick={handleAdminFileUpload}
                      className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 text-white hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md flex items-center space-x-2"
                    >
                      <Upload className="w-5 h-5" />
                      <span>Upload & Complete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 space-y-8 ${animationClass}`}>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Requests",
              value: stats.total || 0,
              icon: FileText,
              color: "from-blue-500 to-blue-600",
              bg: "from-blue-50 to-blue-100",
            },
            {
              title: "Pending",
              value: stats.pending || 0,
              icon: Clock,
              color: "from-amber-500 to-orange-500",
              bg: "from-amber-50 to-orange-100",
            },
            {
              title: "Completed",
              value: stats.completed || 0,
              icon: CheckCircle,
              color: "from-green-500 to-emerald-500",
              bg: "from-green-50 to-emerald-100",
            },
            {
              title: "This Month",
              value: stats.thisMonth || 0,
              icon: CalendarDays,
              color: "from-purple-500 to-indigo-500",
              bg: "from-purple-50 to-indigo-100",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${stat.bg} p-6 rounded-2xl shadow-lg border border-white/50 transform hover:scale-105 transition-all duration-300 hover:shadow-xl`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-semibold mb-2">
                    {stat.title}
                  </p>
                  <p className="text-4xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>+12% from last month</span> {/* Placeholder text */}
                  </div>
                </div>
                <div
                  className={`p-4 bg-gradient-to-br ${stat.color} rounded-2xl shadow-lg`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">View:</span>
              </div>
              <div className="flex space-x-2">
                {["all", "type", "status", "trends"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveChart(filter)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      activeChart === filter
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-200">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Enhanced Charts Grid */}
        <div className="space-y-8">
          {/* Row 1: Main Charts */}
          {(activeChart === "all" ||
            activeChart === "type" ||
            activeChart === "status") && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Enhanced Pie Chart */}
              {(activeChart === "all" || activeChart === "type") && (
                <ChartContainer
                  title="Requests by Type"
                  icon={PieChartIcon}
                  actions={
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-500">Live Data</span>
                    </div>
                  }
                >
                  <ResponsiveContainer width="100%" height={350}>
                    {requestsByTypeData.length > 0 ? (
                      <PieChart>
                        <defs>
                          {requestsByTypeData.map((entry, index) => (
                            <linearGradient
                              key={index}
                              id={`gradient-${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={entry.color}
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="100%"
                                stopColor={entry.color}
                                stopOpacity={0.6}
                              />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={requestsByTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={120}
                          innerRadius={60}
                          paddingAngle={3}
                          dataKey="value"
                          animationBegin={0}
                          animationDuration={1000}
                        >
                          {requestsByTypeData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#gradient-${index})`}
                              stroke="#fff"
                              strokeWidth={2}
                              className="hover:opacity-80 transition-opacity duration-200"
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={
                            <CustomTooltip
                              formatter={(value) => `${value} requests`}
                            />
                          }
                        />
                        <Legend content={<CustomLegend />} />
                      </PieChart>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No data available for Requests by Type.
                      </div>
                    )}
                  </ResponsiveContainer>
                  <div className="text-center mt-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.total || 0}
                    </p>
                    <p className="text-gray-600">Total Requests</p>
                  </div>
                </ChartContainer>
              )}

              {/* Enhanced Bar Chart */}
              {(activeChart === "all" || activeChart === "status") && (
                <ChartContainer title="Requests by Status" icon={BarChart3}>
                  <ResponsiveContainer width="100%" height={350}>
                    {requestsByStatusData.length > 0 ? (
                      <BarChart
                        data={requestsByStatusData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          {/* Dynamic gradients based on data */}
                          {requestsByStatusData.map((entry, index) => (
                            <linearGradient
                              key={`barGradient${index}`}
                              id={`barGradient${index}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="0%"
                                stopColor={entry.fill}
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="100%"
                                stopColor={entry.fill}
                                stopOpacity={0.4}
                              />
                            </linearGradient>
                          ))}
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#6b7280",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip
                          content={
                            <CustomTooltip
                              formatter={(value) => `${value} requests`}
                            />
                          }
                        />
                        <Bar
                          dataKey="count"
                          radius={[8, 8, 0, 0]}
                          animationDuration={1000}
                          animationBegin={200}
                        >
                          {requestsByStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={`url(#barGradient${index})`}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No data available for Requests by Status.
                      </div>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          )}

          {/* Row 2: Advanced Charts */}
          {(activeChart === "all" || activeChart === "trends") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Enhanced Line Chart */}
              <div className="lg:col-span-2">
                <ChartContainer
                  title="Request Trends Over Time"
                  icon={LineChartIcon}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    {requestsOverTimeData.length > 0 ? (
                      <AreaChart
                        data={requestsOverTimeData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <defs>
                          <linearGradient
                            id="areaGradient1"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.cool[0]}
                              stopOpacity={0.6}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.cool[0]}
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="areaGradient2"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={CHART_COLORS.cool[1]}
                              stopOpacity={0.4}
                            />
                            <stop
                              offset="100%"
                              stopColor={CHART_COLORS.cool[1]}
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#e5e7eb"
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6b7280", fontSize: 11 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "#6b7280", fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend content={<CustomLegend />} />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke={CHART_COLORS.cool[0]}
                          strokeWidth={3}
                          fill="url(#areaGradient1)"
                          name="Total Requests"
                          animationDuration={2000}
                        />
                        {/* You might want to add 'completed' or 'pending' lines here if your monthly data includes it */}
                        {/* Example: */}
                        {/* <Line
                          type="monotone"
                          dataKey="completed"
                          stroke={CHART_COLORS.cool[1]}
                          strokeWidth={2}
                          dot={<CustomDot />}
                          name="Completed"
                          animationDuration={2500}
                        /> */}
                      </AreaChart>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No data available for Request Trends.
                      </div>
                    )}
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Radial Progress Chart */}
              <ChartContainer title="Completion Rate" icon={Activity}>
                <ResponsiveContainer width="100%" height={350}>
                  {completionRateData.length > 0 && stats.total > 0 ? (
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius="20%"
                      outerRadius="90%"
                      data={completionRateData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar
                        dataKey="value"
                        cornerRadius={10}
                        background
                        clockWise
                        animationDuration={1500}
                      />
                      <Tooltip
                        content={
                          <CustomTooltip
                            formatter={(value) => `${value.toFixed(1)}%`}
                          />
                        }
                      />
                      <Legend
                        iconSize={12}
                        wrapperStyle={{ paddingTop: "20px" }}
                        content={<CustomLegend />}
                      />
                    </RadialBarChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No data available for Completion Rate.
                    </div>
                  )}
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-3xl font-bold text-green-600">
                    {(stats.total > 0
                      ? (stats.completed / stats.total) * 100
                      : 0
                    ).toFixed(1)}
                    %
                  </p>
                  <p className="text-gray-600">Overall Completion Rate</p>
                </div>
              </ChartContainer>
            </div>
          )}
        </div>

        {/* Performance Metrics */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl shadow-lg border border-teal-200/50 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 mr-3 text-teal-600" />
            Performance Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-green-600">+24%</p>
              <p className="text-gray-600">Response Time Improvement</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-blue-600">95%</p>
              <p className="text-gray-600">Resident Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <p className="text-2xl font-bold text-purple-600">2.3 days</p>
              <p className="text-gray-600">Average Resolution Time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
