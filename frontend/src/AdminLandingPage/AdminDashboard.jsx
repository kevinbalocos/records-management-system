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
const Toast = ({ message, type, onClose, isVisible, isDarkMode }) => {
  // Added isDarkMode prop
  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-lg shadow-lg border-l-4 min-w-80 max-w-md";

    // Dynamic styles based on isDarkMode prop
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
    // Icons also adapt based on isDarkMode
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
  completed: "text-green-600 bg-green-100 border-green-200",
  rejected: "text-red-600 bg-red-100 border-red-200",
};

// Enhanced color palettes
const CHART_COLORS = {
  primary: ["#0891b2", "#06b6d4", "#22d3ee", "#67e8f9", "#a7f3d0"], // Teal/Cyan shades
  gradient: ["#6366f1", "#8b5cf6", "#a855f7", "#c084fc", "#d8b4fe"], // Indigo/Purple shades
  warm: ["#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"], // Orange/Red/Pink/Purple
  cool: ["#10b981", "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6"], // Green/Cyan/Blue/Indigo/Purple
  professional: ["#1e293b", "#374151", "#6b7280", "#9ca3af", "#d1d5db"], // Gray shades
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, formatter, isDarkMode }) => {
  // Added isDarkMode prop
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
  // Added isDarkMode prop
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
  isDarkMode, // Added isDarkMode prop
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

// Main Admin Dashboard component
const AdminDashboard = ({ isDarkMode }) => {
  // Accept isDarkMode prop
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

  // New states for drill-down
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [selectedAssistanceType, setSelectedAssistanceType] = useState("");
  const [breakdownData, setBreakdownData] = useState(null); // Data for the breakdown modal

  // States for chart data
  const [requestsByTypeData, setRequestsByTypeData] = useState([]);
  const [requestsByStatusData, setRequestsByStatusData] = useState([]);
  const [requestsOverTimeData, setRequestsOverTimeData] = useState([]);
  const [completionRateData, setCompletionRateData] = useState([]);

  const [activeChart, setActiveChart] = useState("all");
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    setAnimationClass("animate-fadeIn");
  }, []);

  // Map for full assistance type names
  const assistanceTypeMap = {
    MAIP: "Medical Assistance for Indigent Patients",
    AICS: "Assistance to Individuals in Crisis Situation",
    "Medical Assistance": "Medical Assistance", // Assuming this is distinct if explicitly mentioned
    Others: "Others",
    // Keep existing types if they are still relevant for other requests
    Maintenance: "Maintenance",
    Security: "Security",
    Amenities: "Amenities",
    Complaints: "Complaints",
  };

  // Function to process raw request data into chart-friendly formats
  const processRequestDataForCharts = useCallback((allRequests) => {
    // Requests by Type
    const typeCounts = allRequests.reduce((acc, request) => {
      const typeName = assistanceTypeMap[request.type] || request.type; // Use full name or original if not mapped
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

    // Requests by Status (remains the same)
    const statusCounts = allRequests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});
    setRequestsByStatusData(
      Object.keys(statusCounts).map((status, index) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        count: statusCounts[status],
        fill: CHART_COLORS.cool[index % CHART_COLORS.cool.length],
      }))
    );

    // Requests Over Time (Monthly) (remains the same)
    const monthlyCounts = allRequests.reduce((acc, request) => {
      const monthYear = moment(request.created_at).format("MMM YYYY");
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {});

    const last12MonthsData = [];
    for (let i = 11; i >= 0; i--) {
      const month = moment().subtract(i, "months").format("MMM YYYY");
      last12MonthsData.push({
        month: month,
        count: monthlyCounts[month] || 0,
      });
    }
    setRequestsOverTimeData(last12MonthsData);
  }, []);

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
          fill: "#e0e0e0", // Grey for remaining
        },
      ]);
    } else {
      setCompletionRateData([{ name: "No Data", value: 100, fill: "#e0e0e0" }]); // Show 100% grey if no data
    }
  }, [stats]);

  // New function to fetch breakdown data for a specific assistance type
  const fetchBreakdownData = useCallback(
    async (type) => {
      try {
        // Assuming a new backend endpoint for this
        const response = await axios.get(
          `http://localhost:5000/api/requests/breakdown/${type}`
        );
        setBreakdownData(response.data);
        setSelectedAssistanceType(type);
        setIsBreakdownModalOpen(true);
      } catch (error) {
        console.error(`Failed to fetch breakdown data for ${type}:`, error);
        showToast(
          `Failed to load breakdown data for ${type}. Please ensure backend endpoint is configured and data exists.`,
          "error"
        );
        setBreakdownData(null);
      }
    },
    [showToast]
  );

  // Handle click on Pie Chart slice
  const handlePieSliceClick = (data, index) => {
    // data.name will be the full name like "Medical Assistance for Indigent Patients"
    // We need to map it back to the backend's internal type (e.g., "MAIP")
    const originalType = Object.keys(assistanceTypeMap).find(
      (key) => assistanceTypeMap[key] === data.name
    );
    if (originalType) {
      fetchBreakdownData(originalType);
    } else {
      // Fallback: if no specific mapping, use the displayed name directly
      fetchBreakdownData(data.name);
    }
  };

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

  // Component for the breakdown modal
  const AssistanceBreakdownModal = ({ type, data, onClose, isDarkMode }) => {
    // Added isDarkMode prop
    if (!data) return null; // Don't render if no data

    // Process data for municipality chart
    const municipalityData = Object.keys(data.municipalities || {}).map(
      (muni) => ({
        name: muni,
        count: data.municipalities[muni],
      })
    );

    // Process data for demographic charts
    const genderData = [
      { name: "Male", value: data.gender?.Male || 0, fill: "#3b82f6" },
      { name: "Female", value: data.gender?.Female || 0, fill: "#ec4899" },
      { name: "Other", value: data.gender?.Other || 0, fill: "#6b7280" },
    ];

    const specialCategoriesData = [
      { name: "PWD", value: data.categories?.is_pwd || 0, fill: "#f59e0b" },
      { name: "LGBT", value: data.categories?.is_lgbt || 0, fill: "#a855f7" },
      {
        name: "Senior",
        value: data.categories?.is_senior || 0,
        fill: "#10b981",
      },
    ];

    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50 p-4 overflow-y-auto">
        <div
          className={`rounded-2xl shadow-2xl w-full max-w-4xl p-8 transform transition-all duration-300 scale-95 hover:scale-100
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
              Breakdown for {assistanceTypeMap[type] || type}
            </h3>
            <button
              onClick={onClose}
              className={`text-gray-400 hover:text-gray-600 ${
                isDarkMode ? "dark:text-gray-500 dark:hover:text-gray-300" : ""
              }`}
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-8">
            {/* Breakdown by Municipality */}
            <ChartContainer
              title="Requests by Municipality"
              icon={BarChart3}
              isDarkMode={isDarkMode}
            >
              <ResponsiveContainer width="100%" height={250}>
                {municipalityData.length > 0 ? (
                  <BarChart
                    data={municipalityData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} // Conditional grid color
                      opacity={0.6}
                    />
                    <XAxis
                      dataKey="name"
                      angle={-30}
                      textAnchor="end"
                      height={60}
                      tick={{
                        fill: isDarkMode ? "#d1d5db" : "#6b7280",
                        fontSize: 11,
                      }} // Conditional tick color
                    />
                    <YAxis
                      tick={{
                        fill: isDarkMode ? "#d1d5db" : "#6b7280",
                        fontSize: 12,
                      }} // Conditional tick color
                    />
                    <Tooltip
                      content={
                        <CustomTooltip
                          formatter={(value) => `${value} requests`}
                          isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                        />
                      }
                    />
                    <Bar
                      dataKey="count"
                      fill={CHART_COLORS.cool[2]}
                      radius={[8, 8, 0, 0]}
                      animationDuration={800}
                    />
                  </BarChart>
                ) : (
                  <div
                    className={`flex items-center justify-center h-full ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No municipality data available.
                  </div>
                )}
              </ResponsiveContainer>
            </ChartContainer>

            {/* Breakdown by Demographics (Gender, PWD, LGBT, Senior) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ChartContainer
                title="Requests by Gender"
                icon={Users}
                isDarkMode={isDarkMode}
              >
                <ResponsiveContainer width="100%" height={250}>
                  {genderData.some((d) => d.value > 0) ? ( // Check if any gender has data
                    <PieChart>
                      <Pie
                        data={genderData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        animationDuration={800}
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`cell-gender-${index}`}
                            fill={entry.fill}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={
                          <CustomTooltip
                            formatter={(value) => `${value} requests`}
                            isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                          />
                        }
                      />
                      <Legend
                        content={<CustomLegend isDarkMode={isDarkMode} />}
                      />{" "}
                      {/* Pass isDarkMode to legend */}
                    </PieChart>
                  ) : (
                    <div
                      className={`flex items-center justify-center h-full ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No gender data available.
                    </div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>

              <ChartContainer
                title="Requests by Special Categories"
                icon={List}
                isDarkMode={isDarkMode} // Pass isDarkMode prop
              >
                <ResponsiveContainer width="100%" height={250}>
                  {specialCategoriesData.some((d) => d.value > 0) ? ( // Check if any category has data
                    <BarChart
                      data={specialCategoriesData}
                      layout="vertical"
                      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} // Conditional grid color
                        opacity={0.6}
                      />
                      <XAxis
                        type="number"
                        tick={{
                          fill: isDarkMode ? "#d1d5db" : "#6b7280",
                          fontSize: 12,
                        }} // Conditional tick color
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{
                          fill: isDarkMode ? "#d1d5db" : "#6b7280",
                          fontSize: 12,
                        }} // Conditional tick color
                      />
                      <Tooltip
                        content={
                          <CustomTooltip
                            formatter={(value) => `${value} requests`}
                            isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                          />
                        }
                      />
                      <Bar dataKey="value" animationDuration={800}>
                        {specialCategoriesData.map((entry, index) => (
                          <Cell
                            key={`cell-category-${index}`}
                            fill={entry.fill}
                            radius={[0, 8, 8, 0]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <div
                      className={`flex items-center justify-center h-full ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No special category data available.
                    </div>
                  )}
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br
                    ${
                      isDarkMode
                        ? "from-gray-950 via-gray-900 to-blue-950"
                        : "from-gray-50 via-gray-100 to-blue-50"
                    }`}
    >
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
          isDarkMode={isDarkMode} // Pass isDarkMode to Toast
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
                    Resident:
                  </span>{" "}
                  {selectedRequest.resident_name ||
                    `ID: ${selectedRequest.user_id}`}
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
                    } ${
                      isDarkMode
                        ? "dark:text-yellow-200 dark:bg-yellow-900 dark:border-yellow-700"
                        : ""
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
                    Submitted:
                  </span>{" "}
                  {moment(selectedRequest.created_at).format("LLL")}
                </p>
              </div>
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
              {selectedRequest.file_path && (
                <div>
                  <p
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Resident's Supporting Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.file_path}`}
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
                    View Resident Document
                  </a>
                </div>
              )}
              {selectedRequest.admin_file_path && (
                <div>
                  <p
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Admin's Uploaded Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.admin_file_path}`}
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
                    View Admin Document
                  </a>
                </div>
              )}

              {selectedRequest.status === "pending" && (
                <div
                  className={`mt-6 pt-4 border-t ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <p
                    className={`font-semibold mb-2 ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Upload Admin Response File (Optional, marks as Completed):
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
              )}
            </div>
          </div>
        </div>
      )}

      {isBreakdownModalOpen && breakdownData && (
        <AssistanceBreakdownModal
          type={selectedAssistanceType}
          data={breakdownData}
          onClose={() => setIsBreakdownModalOpen(false)}
          isDarkMode={isDarkMode} // Pass isDarkMode to breakdown modal
        />
      )}

      <div className={`p-6 space-y-8 ${animationClass}`}>
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Total Requests",
              value: stats.total || 0,
              icon: FileText,
              color: "bg-blue-500",
              darkColor: "dark:bg-blue-700",
            },
            {
              title: "Pending Requests",
              value: stats.pending || 0,
              icon: Clock,
              color: "bg-yellow-500",
              darkColor: "dark:bg-yellow-700",
            },
            {
              title: "Completed Requests",
              value: stats.completed || 0,
              icon: CheckCircle,
              color: "bg-green-500",
              darkColor: "dark:bg-green-700",
            },
            {
              title: "Rejected Requests",
              value: stats.rejected || 0,
              icon: XCircle,
              color: "bg-red-500",
              darkColor: "dark:bg-red-700",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`rounded-2xl shadow-lg p-6 flex items-center space-x-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                          ${
                            isDarkMode
                              ? "bg-gray-800 border-gray-700 text-gray-100"
                              : "bg-white border-gray-100"
                          }`}
            >
              <div
                className={`p-3 rounded-full ${stat.color} ${stat.darkColor} bg-opacity-80 shadow-md`}
              >
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-3xl font-bold ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requests by Type (Pie Chart) */}
          <ChartContainer
            title="Requests by Type"
            icon={PieChartIcon}
            className="col-span-1"
            isDarkMode={isDarkMode} // Pass isDarkMode
          >
            <ResponsiveContainer width="100%" height={300}>
              {requestsByTypeData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={requestsByTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    animationDuration={800}
                    onClick={handlePieSliceClick} // Add click handler
                    cursor="pointer" // Indicate it's clickable
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
                        isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                      />
                    }
                  />
                  <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />{" "}
                  {/* Pass isDarkMode to legend */}
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

          {/* Requests by Status (Bar Chart) */}
          <ChartContainer
            title="Requests by Status"
            icon={BarChart3}
            className="col-span-1"
            isDarkMode={isDarkMode} // Pass isDarkMode
          >
            <ResponsiveContainer width="100%" height={300}>
              {requestsByStatusData.length > 0 ? (
                <BarChart
                  data={requestsByStatusData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} // Conditional grid color
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }} // Conditional tick color
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }} // Conditional tick color
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) => `${value} requests`}
                        isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                      />
                    }
                  />
                  <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />{" "}
                  {/* Pass isDarkMode to legend */}
                  <Bar
                    dataKey="count"
                    barSize={40}
                    radius={[8, 8, 0, 0]}
                    animationDuration={800}
                  >
                    {requestsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No data for Requests by Status.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Requests Over Time (Line Chart) */}
          <ChartContainer
            title="Requests Over Time (Last 12 Months)"
            icon={LineChartIcon}
            className="lg:col-span-2"
            isDarkMode={isDarkMode} // Pass isDarkMode
          >
            <ResponsiveContainer width="100%" height={350}>
              {requestsOverTimeData.length > 0 ? (
                <LineChart
                  data={requestsOverTimeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDarkMode ? "#4b5563" : "#e5e7eb"} // Conditional grid color
                    opacity={0.6}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }} // Conditional tick color
                  />
                  <YAxis
                    tick={{
                      fill: isDarkMode ? "#d1d5db" : "#6b7280",
                      fontSize: 12,
                    }} // Conditional tick color
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) => `${value} requests`}
                        isDarkMode={isDarkMode} // Pass isDarkMode to tooltip
                      />
                    }
                  />
                  <Legend content={<CustomLegend isDarkMode={isDarkMode} />} />{" "}
                  {/* Pass isDarkMode to legend */}
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke={CHART_COLORS.gradient[2]}
                    strokeWidth={3}
                    dot={<CustomDot fill={CHART_COLORS.gradient[2]} />}
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
                  No data for Requests Over Time.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Overall Completion Rate (Radial Bar Chart) */}
          <ChartContainer
            title="Overall Completion Rate"
            icon={TrendingUp}
            className="col-span-1"
            isDarkMode={isDarkMode} // Pass isDarkMode
          >
            <ResponsiveContainer width="100%" height={300}>
              {completionRateData.length > 0 &&
              completionRateData[0].value !== 100 ? ( // Only show chart if there's actual completion data
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="80%"
                  barSize={20}
                  data={completionRateData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    minAngle={15}
                    label={{
                      position: "insideStart",
                      fill: "#fff",
                      formatter: (value) => `${value.toFixed(0)}%`,
                    }}
                    background
                    clockWise
                    dataKey="value"
                  />
                  <Tooltip
                    content={
                      <CustomTooltip
                        formatter={(value) => `${value.toFixed(1)}%`}
                        isDarkMode={isDarkMode}
                      /> // Pass isDarkMode to tooltip
                    }
                  />
                  <Legend
                    iconSize={10}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    content={<CustomLegend isDarkMode={isDarkMode} />} // Pass isDarkMode to legend
                  />
                </RadialBarChart>
              ) : (
                <div
                  className={`flex items-center justify-center h-full ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  No completion data available or 0 total requests.
                </div>
              )}
            </ResponsiveContainer>
          </ChartContainer>

          {/* Recent Activities/Requests (Table) */}
          <ChartContainer
            title="Recent Activities"
            icon={Activity}
            className="lg:col-span-2"
            isDarkMode={isDarkMode} // Pass isDarkMode
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
                        Resident
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
                    {requests.slice(0, 5).map((request) => (
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
                          {request.resident_name || "N/A"}
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
                            } ${
                              isDarkMode
                                ? "dark:text-teal-200 dark:bg-teal-900 dark:border-teal-700"
                                : ""
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
                          {moment(request.created_at).format("MMM D, YYYY")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(request)}
                            className={`text-teal-600 hover:text-teal-900 ${
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
