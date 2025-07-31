import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Clock,
  CheckSquare,
} from "lucide-react";

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Toast Component
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
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Custom hook for toast notifications
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

const RecordsLandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("residents");
  const navigate = useNavigate();
  const [type, setType] = useState("Medical");
  const [details, setDetails] = useState("");
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/user/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => setUserInfo(data))
      .catch((err) => console.error("Failed to fetch user info", err));
  }, [userId]);

  const { toast, showToast, hideToast } = useToast();

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const userId = localStorage.getItem("userId");

    if (!userId) {
      showToast("User not logged in.", "error");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("details", details);
    formData.append("file", file);
    formData.append("user_id", userId);

    try {
      const res = await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to submit request");
      showToast("Request submitted successfully!", "success");
      setDetails("");
      setFile(null);
      setType("Medical");
    } catch (error) {
      console.error(error);
      showToast("Failed to submit request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const menuItems = [
    { id: "home", icon: Home, label: "Dashboard" },
    { id: "services", icon: Building, label: "LGU Services" },
    { id: "statistics", icon: BarChart3, label: "Community Stats" },
    { id: "residents", icon: Users, label: "Resident Records", active: true },
    { id: "settings", icon: Settings, label: "Admin Settings" },
  ];

  const bottomMenuItems = [
    { id: "support", icon: HelpCircle, label: "Help Desk" },
    { id: "logout", icon: LogOut, label: "Log Out" },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    navigate("/");
  };

  const handleMenuClick = (itemId) => {
    setActiveSection(itemId);
    if (itemId === "home") {
      console.log("Navigate back to dashboard");
      navigate("/landing");
    }
  };

  // Stats data for the dashboard
  const stats = [
    {
      title: "Total Requests",
      value: "234",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Pending",
      value: "12",
      icon: Clock,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Completed",
      value: "198",
      icon: CheckSquare,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "This Month",
      value: "45",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              LGU Portal
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            const handleClick = () => {
              handleMenuClick(item.id);
              if (item.id === "home") {
                navigate("/landing");
              }
            };

            return (
              <button
                key={item.id}
                onClick={handleClick}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={
                  item.id === "logout"
                    ? handleLogout
                    : () => setActiveSection(item.id)
                }
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {getInitials(userInfo.fullName || "User")}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userInfo.fullName || "Loading..."}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userInfo.email || "Fetching email..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent backdrop-blur-sm bg-opacity-25 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Resident Records
                </h1>
                <p className="text-gray-600">
                  Manage and view resident information and records.
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Main Content Area */}
        <main className="p-6 space-y-6">
          {/* Stats Cards */}
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

          {/* Request Form */}
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
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
                    >
                      <option value="Medical">Medical Assistance</option>
                      <option value="Guarantee Letter">Guarantee Letter</option>
                      <option value="MAIP">
                        MAIP (Medical Assistance Indigent Program)
                      </option>
                    </select>
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
                    required. Your request will be processed within 3-5 business
                    days.
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

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-teal-600" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {[
                { type: "Medical", status: "Completed", time: "2 hours ago" },
                {
                  type: "Guarantee Letter",
                  status: "Pending",
                  time: "1 day ago",
                },
                { type: "MAIP", status: "Processing", time: "3 days ago" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        activity.status === "Completed"
                          ? "bg-green-500"
                          : activity.status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-600">{activity.status}</p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecordsLandingPage;
