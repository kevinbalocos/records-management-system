import { useState, useEffect } from "react";
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
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  TrendingUp,
  Users,
  FileCheck,
  Eye,
  RefreshCw,
  ChevronDown,
  Plus,
  ArrowUpRight,
  Activity,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Socket.io connection
const socket = io("http://localhost:5000");

// Re-usable Toast component and hook
const Toast = ({ message, type, onClose, isVisible }) => {
  const getToastStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border min-w-80 max-w-md";

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
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
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
          className="ml-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-white/20"
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

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Clock className="w-3.5 h-3.5" />,
          className:
            "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border-amber-200",
          pulse: true,
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          className:
            "bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 border-blue-200",
        };

      case "rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          className:
            "bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200",
        };
      default:
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          className:
            "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 border-gray-200",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${
        config.className
      } ${config.pulse ? "animate-pulse" : ""}`}
    >
      {config.icon}
      <span className="ml-1.5 capitalize">{status}</span>
    </span>
  );
};

const RequestCard = ({ request, onViewDetails, onUpdateStatus }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, hh:mm A");
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
              {request.resident_name || "N/A"}
            </h3>
            <p className="text-sm text-gray-500">{request.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={request.status} />
          <div className="relative">
            <button
              onClick={() => onViewDetails(request)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-600 line-clamp-2">{request.details}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span className="flex items-center">
              <CalendarDays className="w-3.5 h-3.5 mr-1" />
              {formatDate(request.created_at)}
            </span>
            {request.file_path && (
              <span className="flex items-center text-teal-600">
                <FileText className="w-3.5 h-3.5 mr-1" />
                Attachment
              </span>
            )}
          </div>

          {request.status === "pending" && (
            <div className="flex items-center space-x-1">
              <button
                onClick={() => onUpdateStatus(request.id, "approved")}
                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(request.id, "rejected")}
                className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                title="Reject"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const RequestDetailsModal = ({ request, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !request) return null;

  const formatDate = (dateString) => {
    return moment(dateString).format("dddd, MMMM D, YYYY, hh:mm A");
  };

  const handleViewDocument = (filePath) => {
    if (filePath) {
      // Ensure the path starts with 'uploads/' if it's just a filename
      const cleanedPath = filePath.startsWith("uploads/")
        ? filePath
        : `uploads/${filePath}`;
      const fullUrl = `http://localhost:5000/${cleanedPath}`;
      window.open(fullUrl, "_blank"); // Open the full URL in a new tab
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all">
          <div className="px-8 py-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Request Details
                  </h2>
                  <p className="text-sm text-gray-500">ID: #{request.id}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Resident
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {request.resident_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Request Type
                  </label>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {request.type}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </label>
                  <div className="mt-2">
                    <StatusBadge status={request.status} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Submitted
                  </label>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatDate(request.created_at)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Details
              </label>
              <div className="mt-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-800 leading-relaxed">
                  {request.details}
                </p>
              </div>
            </div>

            {request.file_path && (
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Supporting Document
                </label>
                <div className="mt-2">
                  <button
                    onClick={() => handleViewDocument(request.file_path)}
                    className="flex w-full items-center p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/50 transition-all cursor-pointer text-left"
                  >
                    <FolderOpen className="w-6 h-6 text-teal-500 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">View Document</p>
                      <p className="text-sm text-gray-500">
                        Click to open attached file
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {request.receipt_path && (
              <div className="mt-4">
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Receipt File
                </label>
                <div className="mt-2">
                  <button
                    onClick={() => handleViewDocument(request.receipt_path)}
                    className="flex w-full items-center p-4 border border-indigo-200 bg-indigo-50 rounded-xl hover:border-indigo-300 hover:bg-indigo-100 transition-all cursor-pointer text-left"
                  >
                    <FileText className="w-6 h-6 text-indigo-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-indigo-900">
                        View Receipt
                      </p>
                      <p className="text-sm text-indigo-600">
                        Click to view uploaded receipt
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-indigo-600" />
                  </button>
                </div>
              </div>
            )}

            {request.status === "approved" && !request.admin_file_path && (
              <div className="mt-4">
                <p className="font-semibold text-gray-700 mb-2">
                  Upload Final Document:
                </p>
                <input
                  type="file"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append("file", file);

                    try {
                      await axios.post(
                        `http://localhost:5000/api/requests/${request.id}/upload`,
                        formData
                      );

                      await onUpdateStatus(request.id, "completed");

                      onClose();
                      await fetchRequests();

                      showToast(
                        "Document uploaded and request marked as completed.",
                        "success"
                      );
                    } catch (error) {
                      console.error("Upload error:", error);
                      showToast("Failed to upload document.", "error");
                    }
                  }}
                  className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg p-2"
                />
              </div>
            )}

            {request.admin_file_path && (
              <div>
                <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  Final Document
                </label>
                <div className="mt-2">
                  <button
                    onClick={() => handleViewDocument(request.admin_file_path)}
                    className="flex w-full items-center p-4 bg-emerald-50 border border-emerald-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/50 transition-all cursor-pointer text-left"
                  >
                    <FileCheck className="w-6 h-6 text-emerald-600 mr-3" />
                    <div className="flex-1">
                      <p className="font-medium text-emerald-900">
                        Completed Document
                      </p>
                      <p className="text-sm text-emerald-600">
                        Ready for download
                      </p>
                    </div>
                    <Download className="w-5 h-5 text-emerald-600" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-6 bg-gray-50 rounded-b-2xl border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Last updated:
                {formatDate(request.updated_at || request.created_at)}
              </div>
              {request.status === "pending" && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      onUpdateStatus(request.id, "rejected");
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-xl hover:bg-red-100 transition-colors font-medium"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(request.id, "approved");
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors font-medium"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminRecordsRequest = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    thisMonth: 0,
    rejectedCount: 0,
    avgProcessingTime: "...",
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast, showToast, hideToast } = useToast();
  const adminId = localStorage.getItem("userId");

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      showToast("Failed to load requests.", "error");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/requests/stats"
      );
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      showToast("Failed to load statistics.", "error");
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchStats();

    socket.on("newRequest", (newRequest) => {
      axios
        .get(`http://localhost:5000/api/users/${newRequest.user_id}`)
        .then((userRes) => {
          setRequests((prevRequests) => [
            { ...newRequest, resident_name: userRes.data.first_name },
            ...prevRequests,
          ]);
          showToast(
            `A new request from ${userRes.data.first_name} has been submitted!`,
            "info"
          );
          fetchStats();
        })
        .catch((err) => {
          console.error("Failed to fetch new request user info:", err);
          setRequests((prevRequests) => [
            { ...newRequest, resident_name: "Unknown Resident" },
            ...prevRequests,
          ]);
          showToast("A new resident request has been submitted!", "info");
        });
    });

    return () => {
      socket.off("newRequest");
    };
  }, [showToast]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/requests/${id}/status`, {
        status,
      });
      showToast(
        `Request status updated to "${status}" successfully!`,
        "success"
      );
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update request status.", "error");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRequests();
    await fetchStats();
    setIsRefreshing(false);
    showToast("Data refreshed successfully!", "success");
  };

  const handleLogout = () => {
    localStorage.clear();
    showToast("Logging out...", "info");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      (request.resident_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (request.type || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-h-[87vh] bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}

      <RequestDetailsModal
        request={selectedRequest}
        isOpen={isModalOpen}
        onClose={closeModal}
        onUpdateStatus={handleUpdateStatus}
      />

      <main className="p-6 space-y-8 ">
        {/* Controls and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6  ">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-8 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
        {/* Requests Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <List className="w-6 h-6 mr-3 text-teal-600" />
              Recent Requests
              <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                {filteredRequests.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[65vh] overflow-y-auto pr-2">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={openModal}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))
            ) : (
              <div className="md:col-span-2 lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-200 p-12">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No requests found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "No requests have been submitted yet"}
                  </p>
                  {(searchTerm || statusFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                      }}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRecordsRequest;
