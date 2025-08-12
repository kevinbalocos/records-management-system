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
  PieChart as PieChartIcon,
  BarChart3,
  LineChart as LineChartIcon,
  TrendingUp,
  Activity,
  Users,
  Filter,
  Download,
  DollarSign,
  MapPin,
  Shield,
  CreditCard,
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

export const PesoSign = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 24}
    height={props.size || 24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Vertical line */}
    <path d="M5 20V4" />
    
    {/* P shape - top curve */}
    <path d="M5 4h7a4 4 0 0 1 0 8H5" />
    
    {/* Double horizontal lines - characteristic of peso sign */}
    <path d="M3 7h12" />
    <path d="M3 10h12" />
  </svg>
);

// Set up the socket.io client to connect to the backend
const socket = io("http://localhost:5000");

// A reusable Toast component for user notifications
const Toast = ({ message, type, onClose, isVisible, isDarkMode }) => {
  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md";

    let typeStyles = "";
    if (isDarkMode) {
      switch (type) {
        case "success":
          typeStyles = "bg-green-900 border-green-600 text-green-200";
          break;
        case "error":
          typeStyles = "bg-red-900 border-red-600 text-red-200";
          break;
        case "warning":
          typeStyles = "bg-yellow-900 border-yellow-600 text-yellow-200";
          break;
        default:
          typeStyles = "bg-blue-900 border-blue-600 text-blue-200";
      }
    } else {
      switch (type) {
        case "success":
          typeStyles = "bg-green-50 border-green-500 text-green-800";
          break;
        case "error":
          typeStyles = "bg-red-50 border-red-500 text-red-800";
          break;
        case "warning":
          typeStyles = "bg-yellow-50 border-yellow-500 text-yellow-800";
          break;
        default:
          typeStyles = "bg-blue-50 border-blue-500 text-blue-800";
      }
    }
    return `${baseStyles} ${typeStyles}`;
  };

  const getIcon = () => {
    const iconColor = isDarkMode ? "text-gray-400" : "text-gray-500";
    switch (type) {
      case "success":
        return (
          <CheckCircle
            className={`w-5 h-5 text-green-500 ${
              isDarkMode ? "dark:text-green-400" : ""
            } mr-3 flex-shrink-0`}
          />
        );
      case "error":
        return (
          <XCircle
            className={`w-5 h-5 text-red-500 ${
              isDarkMode ? "dark:text-red-400" : ""
            } mr-3 flex-shrink-0`}
          />
        );
      case "warning":
        return (
          <AlertCircle
            className={`w-5 h-5 text-yellow-500 ${
              isDarkMode ? "dark:text-yellow-400" : ""
            } mr-3 flex-shrink-0`}
          />
        );
      default:
        return (
          <AlertCircle
            className={`w-5 h-5 text-blue-500 ${
              isDarkMode ? "dark:text-blue-400" : ""
            } mr-3 flex-shrink-0`}
          />
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
          className={`ml-4 text-gray-400 hover:text-gray-600 transition-colors ${
            isDarkMode ? "dark:text-gray-500 dark:hover:text-gray-300" : ""
          }`}
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
  );

  const hideToast = useCallback(() => {
    setToast((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setToast(null);
    }, 300);
  }, []);

  return { toast, showToast, hideToast };
};

// Tailwind CSS classes for different request statuses
const statusClasses = {
  pending: "text-yellow-600 bg-yellow-100 border-yellow-200",
  approved: "text-blue-600 bg-blue-100 border-blue-200",
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
const CustomTooltip = ({ active, payload, label, formatter, isDarkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`backdrop-blur-sm p-4 rounded-xl shadow-2xl border min-w-32
                      ${
                        isDarkMode
                          ? "bg-gray-800/95 border-gray-700/50"
                          : "bg-white/95 border-gray-200/50"
                      }`}
      >
        <p
          className={`font-semibold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {label}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color || entry.fill }}
            />
            <span
              className={`text-sm ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
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
const CustomLegend = ({ payload, isDarkMode }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ backgroundColor: entry.color || entry.payload.fill }}
          />
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
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
  isDarkMode,
}) => (
  <div
    className={`rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 hover:shadow-2xl"
                    : "bg-white border-gray-100"
                } ${className}`}
  >
    <div
      className={`p-6 pb-4 bg-gradient-to-r border-b
                    ${
                      isDarkMode
                        ? "from-gray-700/50 to-gray-800/50 border-gray-700"
                        : "from-gray-50 to-gray-100/50 border-gray-200/50"
                    }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-lg shadow-md">
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {title}
          </h3>
        </div>
        {actions && (
          <div className="flex items-center space-x-2">{actions}</div>
        )}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

// Enhanced Stats Card Component
const StatsCard = ({ title, stats, icon: Icon, color, isDarkMode }) => (
  <div
    className={`rounded-2xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100"
                    : "bg-white border-gray-100"
                }`}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-full ${color} bg-opacity-80 shadow-md`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3
        className={`text-lg font-bold ${
          isDarkMode ? "text-white" : "text-gray-900"
        }`}
      >
        {title}
      </h3>
    </div>
    <div className="space-y-3">
      {stats.map((stat, index) => (
        <div key={index} className="flex justify-between items-center">
          <span
            className={`text-sm font-medium ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {stat.label}:
          </span>
          <span
            className={`text-lg font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {stat.value}
          </span>
        </div>
      ))}
    </div>
  </div>
);

// Main Admin Dashboard component
const AdminDashboard = ({ isDarkMode }) => {
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

  // Chart data states
  const [
    cashAssistanceByMunicipalityData,
    setCashAssistanceByMunicipalityData,
  ] = useState([]);
  const [cashAssistanceByBarangayData, setCashAssistanceByBarangayData] =
    useState([]);
  const [guaranteeLetterByBarangayData, setGuaranteeLetterByBarangayData] =
    useState([]);
  const [requestsByTypeData, setRequestsByTypeData] = useState([]);
  const [monthlyTrendsData, setMonthlyTrendsData] = useState([]);

  const [activeChart, setActiveChart] = useState("all");
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("animate-fadeIn");
  }, []);

  // Map for full assistance type names
  const assistanceTypeMap = {
    MAIP: "Medical Assistance for Indigent Patients",
    AICS: "Assistance to Individuals in Crisis Situation",
    "Medical Assistance": "Medical Assistance",
    Others: "Others",
    Maintenance: "Maintenance",
    Security: "Security",
    Amenities: "Amenities",
    Complaints: "Complaints",
  };

  // Function to process raw request data into chart-friendly formats
  const processRequestDataForCharts = useCallback((allRequests) => {
    // Cash Assistance by Municipality
    const municipalityCashData = allRequests.reduce((acc, request) => {
      if (
        request.cash_amount &&
        request.municipality &&
        request.approval_type === "cash_payment"
      ) {
        acc[request.municipality] =
          (acc[request.municipality] || 0) + parseFloat(request.cash_amount);
      }
      return acc;
    }, {});

    setCashAssistanceByMunicipalityData(
      Object.keys(municipalityCashData)
        .map((municipality) => ({
          municipality: municipality,
          amount: municipalityCashData[municipality],
        }))
        .sort((a, b) => b.amount - a.amount)
    );

    // Cash Assistance by Barangay (simulated data - replace with actual barangay field)
    const barangayCashData = allRequests.reduce((acc, request) => {
      if (
        request.cash_amount &&
        request.barangay &&
        request.approval_type === "cash_payment"
      ) {
        acc[request.barangay] =
          (acc[request.barangay] || 0) + parseFloat(request.cash_amount);
      } else if (
        request.cash_amount &&
        request.approval_type === "cash_payment"
      ) {
        // Fallback to municipality if no barangay field
        const barangayName = `${request.municipality} Center`;
        acc[barangayName] =
          (acc[barangayName] || 0) + parseFloat(request.cash_amount);
      }
      return acc;
    }, {});

    setCashAssistanceByBarangayData(
      Object.keys(barangayCashData)
        .map((barangay) => ({
          barangay: barangay,
          amount: barangayCashData[barangay],
        }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 10) // Top 10
    );

    // Guarantee Letters by Barangay
    const barangayGuaranteeData = allRequests.reduce((acc, request) => {
      if (request.approval_type === "guarantee_letter") {
        const barangayName =
          request.barangay || `${request.municipality} Center`;
        acc[barangayName] = (acc[barangayName] || 0) + 1;
      }
      return acc;
    }, {});

    setGuaranteeLetterByBarangayData(
      Object.keys(barangayGuaranteeData)
        .map((barangay) => ({
          barangay: barangay,
          count: barangayGuaranteeData[barangay],
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Top 10
    );

    // Requests by Type
    const typeCounts = allRequests.reduce((acc, request) => {
      const typeName = assistanceTypeMap[request.type] || request.type;
      acc[typeName] = (acc[typeName] || 0) + 1;
      return acc;
    }, {});

    setRequestsByTypeData(
      Object.keys(typeCounts).map((type, index) => ({
        name: type,
        value: typeCounts[type],
        color: CHART_COLORS.primary[index % CHART_COLORS.primary.length],
      }))
    );

    // Monthly Trends
    const monthlyData = allRequests.reduce((acc, request) => {
      const month = moment(request.created_at).format("YYYY-MM");
      if (!acc[month]) {
        acc[month] = { month, cashAssistance: 0, guaranteeLetters: 0 };
      }

      if (request.approval_type === "cash_payment" && request.cash_amount) {
        acc[month].cashAssistance += parseFloat(request.cash_amount);
      } else if (request.approval_type === "guarantee_letter") {
        acc[month].guaranteeLetters += 1;
      }

      return acc;
    }, {});

    setMonthlyTrendsData(
      Object.values(monthlyData)
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-12) // Last 12 months
    );
  }, []);

  // Fetches all requests with associated resident names from the backend
  const fetchRequests = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      setRequests(response.data);
      processRequestDataForCharts(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      showToast("Failed to load requests.", "error");
    }
  }, [processRequestDataForCharts, showToast]);

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
  }, [adminId]);

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
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchAdminInfo();
    fetchStats();

    // Listen for new requests via WebSocket and update state
    socket.on("newRequest", (newRequest) => {
      axios
        .get(`http://localhost:5000/api/users/${newRequest.user_id}`)
        .then((userRes) => {
          setRequests((prevRequests) => {
            const updatedRequests = [
              { ...newRequest, resident_name: userRes.data.first_name },
              ...prevRequests,
            ];
            processRequestDataForCharts(updatedRequests);
            return updatedRequests;
          });
          showToast(
            `A new request from ${userRes.data.first_name} has been submitted!`,
            "info"
          );
          fetchStats();
        })
        .catch((err) => {
          console.error("Failed to fetch new request user info:", err);
          setRequests((prevRequests) => {
            const updatedRequests = [
              { ...newRequest, resident_name: "Unknown Resident" },
              ...prevRequests,
            ];
            processRequestDataForCharts(updatedRequests);
            return updatedRequests;
          });
          showToast("A new resident request has been submitted!", "info");
        });
    });

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

  // Updates the status of a request (approved, completed or rejected)
  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/requests/${id}/status`, {
        status,
      });
      showToast("Request status updated successfully!", "success");
      fetchRequests();
      fetchStats();
      if (selectedRequest && selectedRequest.id === id) {
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
    setAdminFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      fetchRequests();
      fetchStats();
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
      case "approved":
        return <Shield className="w-4 h-4 mr-2" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  // Calculate stats for cards
  const requestStats = [
    { label: "Total", value: stats.total || 0 },
    { label: "Pending", value: stats.pending || 0 },
    { label: "Approved", value: stats.approved || 0 },
    { label: "Completed", value: stats.completed || 0 },
    { label: "Rejected", value: stats.rejected || 0 },
  ];

  const cashAssistanceStats = [
    {
      label: "Total Amount",
      value: `₱${Number(stats.totalCashAssistance || 0).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )}`,
    },
    {
      label: "Paid",
      value: `₱${Number(stats.paidCashAssistance || 0).toLocaleString(
        undefined,
        {
          maximumFractionDigits: 0,
        }
      )}`,
    },
    {
      label: "Unpaid",
      value: `₱${(
        Number(stats.totalCashAssistance || 0) -
        Number(stats.paidCashAssistance || 0)
      ).toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    },
  ];

  const guaranteeLetterStats = [
    { label: "Total Letters", value: stats.totalGuaranteeLetters || 0 },
    { label: "Paid", value: stats.paidGuaranteeLetters || 0 },
    {
      label: "Unpaid",
      value:
        (stats.totalGuaranteeLetters || 0) - (stats.paidGuaranteeLetters || 0),
    },
    {
      label: "Total Amount",
      value: `₱${((stats.guaranteeLetterAmount || 0) / 1000).toFixed(0)}K`,
    },
  ];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br
                    ${
                      isDarkMode
                        ? "from-gray-950 via-gray-900 to-blue-950"
                        : "from-gray-50 via-gray-100 to-blue-50"
                    }`}
    >
      <style>{`
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
      `}</style>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
          isDarkMode={isDarkMode}
        />
      )}

      {/* Modal for Request Details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 backdrop-blur-2xl bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div
            className={`rounded-xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 scale-95 hover:scale-100
                        ${
                          isDarkMode
                            ? "bg-gray-800 text-gray-100 border-gray-700"
                            : "bg-white text-gray-900"
                        }`}
          >
            <div className="flex justify-between items-start mb-6">
              <h3
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Request Details
              </h3>
              <button
                onClick={closeModal}
                className={`text-gray-400 hover:text-gray-600 ${
                  isDarkMode
                    ? "dark:text-gray-500 dark:hover:text-gray-300"
                    : ""
                }`}
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <p>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Patient Name:
                  </span>{" "}
                  {selectedRequest.patient_name}
                </p>
                <p>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Type:
                  </span>{" "}
                  {selectedRequest.type}
                </p>
                <p>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Status:
                  </span>{" "}
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
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Municipality:
                  </span>{" "}
                  {selectedRequest.municipality}
                </p>
                {selectedRequest.cash_amount && (
                  <p>
                    <span
                      className={`font-semibold ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Cash Amount:
                    </span>{" "}
                    ₱{parseFloat(selectedRequest.cash_amount).toLocaleString()}
                  </p>
                )}
                <p>
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Submitted:
                  </span>{" "}
                  {moment(selectedRequest.created_at).format("LLL")}
                </p>
              </div>

              {selectedRequest.details && (
                <div>
                  <p
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Details:
                  </p>
                  <div
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <p
                      className={`${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                    >
                      {selectedRequest.details}
                    </p>
                  </div>
                </div>
              )}

              {/* Display uploaded documents */}
              <div className="space-y-3">
                {[
                  {
                    path: selectedRequest.medical_abstract_path,
                    label: "Medical Abstract",
                  },
                  {
                    path: selectedRequest.medical_request_path,
                    label: "Medical Request",
                  },
                  {
                    path: selectedRequest.hospital_bill_path,
                    label: "Hospital Bill",
                  },
                  {
                    path: selectedRequest.social_case_study_path,
                    label: "Social Case Study",
                  },
                  {
                    path: selectedRequest.patient_id_path,
                    label: "Patient ID",
                  },
                  {
                    path: selectedRequest.representative_id_path,
                    label: "Representative ID",
                  },
                ].map(
                  (doc, index) =>
                    doc.path && (
                      <div key={index}>
                        <p
                          className={`font-semibold mb-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {doc.label}:
                        </p>
                        <a
                          href={`http://localhost:5000/uploads/${doc.path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center p-3 border rounded-lg text-teal-600 hover:bg-teal-50 transition-colors
                                   ${
                                     isDarkMode
                                       ? "border-gray-600 text-teal-400 hover:bg-gray-700"
                                       : "border-gray-300"
                                   }`}
                        >
                          <FolderOpen className="w-5 h-5 mr-3" />
                          View {doc.label}
                        </a>
                      </div>
                    )
                )}
              </div>

              {selectedRequest.approval_file && (
                <div>
                  <p
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Approval Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.approval_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center p-3 border rounded-lg text-blue-600 hover:bg-blue-50 transition-colors
                               ${
                                 isDarkMode
                                   ? "border-gray-600 text-blue-400 hover:bg-gray-700"
                                   : "border-gray-300"
                               }`}
                  >
                    <FolderOpen className="w-5 h-5 mr-3" />
                    View Approval Document
                  </a>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div
                  className={`mt-6 pt-4 border-t space-y-4 ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedRequest.id, "approved")
                      }
                      className="px-4 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() =>
                        handleUpdateStatus(selectedRequest.id, "rejected")
                      }
                      className="px-4 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition-all"
                    >
                      Reject
                    </button>
                  </div>

                  <div>
                    <p
                      className={`font-semibold mb-2 ${
                        isDarkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Upload Approval File (Optional, marks as Completed):
                    </p>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={(e) => setAdminFile(e.target.files[0])}
                        className={`flex-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100
                                     ${
                                       isDarkMode
                                         ? "bg-gray-700 border-gray-600 text-gray-200 focus:ring-teal-700 focus:border-teal-700 file:bg-teal-800 file:text-teal-100 hover:file:bg-teal-700"
                                         : "border-gray-300"
                                     }`}
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className={`p-6 space-y-8 ${animationClass}`}>
        {/* Enhanced Stats Cards - New Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Total Requests Card */}
          <StatsCard
            title="Total Requests"
            stats={requestStats}
            icon={FileText}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            isDarkMode={isDarkMode}
          />

          {/* Cash Assistance Card */}
          <StatsCard
            title="Cash Assistance"
            stats={cashAssistanceStats}
            icon={PesoSign}
            color="bg-gradient-to-br from-green-500 to-green-600"
            isDarkMode={isDarkMode}
          />

          {/* Guarantee Letters Card */}
          <StatsCard
            title="Guarantee Letters"
            stats={guaranteeLetterStats}
            icon={CreditCard}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cash Assistance by Municipality (Line Chart) */}
          <ChartContainer
            title="Cash Assistance by Municipality"
            icon={LineChartIcon}
            className="lg:col-span-2"
            isDarkMode={isDarkMode}
          >
            <ResponsiveContainer width="100%" height={350}>
              {cashAssistanceByMunicipalityData.length > 0 ? (
                <LineChart
                  data={cashAssistanceByMunicipalityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="municipality"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) =>
                          `₱${parseFloat(value).toLocaleString()}`
                        }
                        isDarkMode={isDarkMode}
                      />
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke={CHART_COLORS.gradient[2]}
                    strokeWidth={3}
                    dot={{
                      r: 6,
                      fill: CHART_COLORS.gradient[2],
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 8, fill: CHART_COLORS.gradient[0] }}
                    animationDuration={800}
                  />
                </LineChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No cash assistance data by municipality available.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Cash Assistance by Barangay (Bar Chart) */}
          <ChartContainer
            title="Top 10 Cash Assistance by Barangay"
            icon={BarChart3}
            className="col-span-1"
            isDarkMode={isDarkMode}
          >
            <ResponsiveContainer width="100%" height={350}>
              {cashAssistanceByBarangayData.length > 0 ? (
                <BarChart
                  data={cashAssistanceByBarangayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                    opacity={0.6}
                  />
                  <XAxis
                    type="number"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="barangay"
                    width={100}
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) =>
                          `₱${parseFloat(value).toLocaleString()}`
                        }
                        isDarkMode={isDarkMode}
                      />
                    }
                  />
                  <Bar
                    dataKey="amount"
                    fill={CHART_COLORS.cool[1]}
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No cash assistance data by barangay available.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Guarantee Letters by Barangay (Bar Chart) */}
          <ChartContainer
            title="Top 10 Guarantee Letters by Barangay"
            icon={FileText}
            className="col-span-1"
            isDarkMode={isDarkMode}
          >
            <ResponsiveContainer width="100%" height={350}>
              {guaranteeLetterByBarangayData.length > 0 ? (
                <BarChart
                  data={guaranteeLetterByBarangayData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  layout="vertical"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                    opacity={0.6}
                  />
                  <XAxis
                    type="number"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <YAxis
                    type="category"
                    dataKey="barangay"
                    width={100}
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 10,
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) => `${value} letters`}
                        isDarkMode={isDarkMode}
                      />
                    }
                  />
                  <Bar
                    dataKey="count"
                    fill={CHART_COLORS.warm[1]}
                    radius={[0, 8, 8, 0]}
                    animationDuration={800}
                  />
                </BarChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No guarantee letter data by barangay available.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Requests by Type (Pie Chart) */}
          <ChartContainer
            title="Requests by Type"
            icon={PieChartIcon}
            className="col-span-1"
            isDarkMode={isDarkMode}
          >
            <ResponsiveContainer width="100%" height={350}>
              {requestsByTypeData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={requestsByTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      percent > 5
                        ? `${name} ${(percent * 100).toFixed(0)}%`
                        : ""
                    }
                    animationDuration={800}
                  >
                    {requestsByTypeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#fff"
                        strokeWidth={2}
                        className="transition-all duration-200 hover:scale-105"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) => `${value} requests`}
                        isDarkMode={isDarkMode}
                      />
                    }
                  />
                  <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />
                </PieChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No data for Requests by Type.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Monthly Trends (Area Chart) */}
          <ChartContainer
            title="Monthly Trends - Last 12 Months"
            icon={TrendingUp}
            className="col-span-1"
            isDarkMode={isDarkMode}
          >
            <ResponsiveContainer width="100%" height={350}>
              {monthlyTrendsData.length > 0 ? (
                <AreaChart
                  data={monthlyTrendsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"}
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 10,
                    }}
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }}
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value, name) => {
                          if (name === "cashAssistance") {
                            return `₱${parseFloat(value).toLocaleString()}`;
                          }
                          return `${value} letters`;
                        }}
                        isDarkMode={isDarkMode}
                      />
                    }
                  />
                  <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />
                  <Area
                    type="monotone"
                    dataKey="cashAssistance"
                    stackId="1"
                    stroke={CHART_COLORS.cool[1]}
                    fill={CHART_COLORS.cool[1]}
                    fillOpacity={0.6}
                    name="Cash Assistance (₱)"
                  />
                  <Area
                    type="monotone"
                    dataKey="guaranteeLetters"
                    stackId="2"
                    stroke={CHART_COLORS.warm[1]}
                    fill={CHART_COLORS.warm[1]}
                    fillOpacity={0.6}
                    name="Guarantee Letters"
                  />
                </AreaChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No monthly trends data available.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Recent Activities/Requests (Table) */}
          <ChartContainer
            title="Recent Activities"
            icon={Activity}
            className="lg:col-span-2"
            isDarkMode={isDarkMode}
          >
            <div className="overflow-x-auto">
              {requests.length > 0 ? (
                <table
                  className={`min-w-full divide-y ${
                    isDarkMode ? "divide-gray-700" : "divide-gray-200"
                  }`}
                >
                  <thead
                    className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}
                  >
                    <tr>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Patient Name
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Municipality
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Amount
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className={`px-6 py-3 text-right text-xs font-medium uppercase tracking-wider ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`${
                      isDarkMode
                        ? "bg-gray-800 divide-gray-700"
                        : "bg-white divide-gray-200"
                    }`}
                  >
                    {requests.slice(0, 10).map((request) => (
                      <tr
                        key={request.id}
                        className={`${
                          isDarkMode
                            ? "hover:bg-gray-700/50"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          {request.patient_name || "N/A"}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {request.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                              statusClasses[request.status]
                            }`}
                          >
                            {getStatusIcon(request.status)}
                            {request.status}
                          </span>
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {request.municipality}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {request.cash_amount ? (
                            <span className="text-green-600 dark:text-green-400">
                              ₱
                              {parseFloat(request.cash_amount).toLocaleString()}
                            </span>
                          ) : (
                            <span className="text-blue-600 dark:text-blue-400">
                              Letter
                            </span>
                          )}
                        </td>
                        <td
                          className={`px-6 py-4 whitespace-nowrap text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          {moment(request.created_at).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(request)}
                            className={`text-teal-600 hover:text-teal-900 transition-colors ${
                              isDarkMode
                                ? "dark:text-teal-400 dark:hover:text-teal-200"
                                : ""
                            }`}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div
                  className={`p-6 text-center ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No recent activities to display.
                </div>
              )}
            </div>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
