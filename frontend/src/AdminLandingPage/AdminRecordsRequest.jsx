import { useState, useEffect, useMemo } from "react";
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
  Building2,
  MapPin,
  UserCheck,
  Calendar,
  FileImage,
  ExternalLink,
  Shield,
  Upload,
  CheckCheck,
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
          className: "bg-amber-100 text-amber-800 border-amber-300",
          pulse: true,
        };
      case "completed":
        return {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          className: "bg-emerald-100 text-emerald-800 border-emerald-300",
        };
      case "approved":
        return {
          icon: <CheckCheck className="w-3.5 h-3.5" />,
          className: "bg-blue-100 text-blue-800 border-blue-300",
        };
      case "rejected":
        return {
          icon: <XCircle className="w-3.5 h-3.5" />,
          className: "bg-red-100 text-red-800 border-red-300",
        };
      default:
        return {
          icon: <AlertCircle className="w-3.5 h-3.5" />,
          className: "bg-gray-100 text-gray-800 border-gray-300",
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border ${
        config.className
      } ${config.pulse ? "animate-pulse" : ""}`}
    >
      {config.icon}
      <span className="ml-1.5 capitalize">{status}</span>
    </div>
  );
};

const RequestCard = ({ request, onViewDetails, onUpdateStatus }) => {
  const formatDate = (dateString) => {
    return moment(dateString).format("MMM D, hh:mm A");
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:border-gray-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {request.resident_name || "N/A"}
            </h3>
            <p className="text-sm text-gray-600">{request.type}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <StatusBadge status={request.status} />
          <button
            onClick={() => onViewDetails(request)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm text-gray-700 line-clamp-2">{request.details}</p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-500 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {formatDate(request.created_at)}
            </span>
            {request.file_path && (
              <span className="flex items-center text-blue-600">
                <FileText className="w-3.5 h-3.5 mr-1" />
                Documents
              </span>
            )}
          </div>

          {request.status === "pending" && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onUpdateStatus(request.id, "approved")}
                className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors"
                title="Approve"
              >
                <CheckCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onUpdateStatus(request.id, "rejected")}
                className="p-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
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
  const [isUploading, setIsUploading] = useState(false);
  const [approvalType, setApprovalType] = useState("");
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const finalAmount = customAmount || amount;

  if (!isOpen || !request) return null;

  const formatDate = (dateString) => {
    return moment(dateString).format("dddd, MMMM D, YYYY [at] h:mm A");
  };

  const handleViewDocument = (filePath) => {
    if (filePath) {
      const cleanedPath = filePath.startsWith("uploads/")
        ? filePath
        : `uploads/${filePath}`;
      const fullUrl = `http://localhost:5000/${cleanedPath}`;
      window.open(fullUrl, "_blank");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!approvalType) {
      alert("Please select an approval type first.");
      return;
    }

    if (approvalType === "cash_payment" && !finalAmount) {
      alert("Please select or enter cash amount.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("approval_type", approvalType);
    formData.append("approval_file", file);

    if (approvalType === "cash_payment") {
      formData.append("cash_amount", finalAmount);
    }

    try {
      await axios.post(
        `http://localhost:5000/api/requests/${request.id}/approve`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      await onUpdateStatus(request.id, "completed");
      onClose();
      alert("Approval file uploaded and request marked as completed.");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload approval file.");
    } finally {
      setIsUploading(false);
    }
  };

  const documents = [
    { label: "Medical Abstract", path: request.medical_abstract_path },
    { label: "Medical Request", path: request.medical_request_path },
    { label: "Hospital Bill", path: request.hospital_bill_path },
    { label: "Social Case Study", path: request.social_case_study_path },
    { label: "Patient ID", path: request.patient_id_path },
    { label: "Representative ID", path: request.representative_id_path },
  ].filter((doc) => doc.path);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto backdrop-blur-lg bg-opacity-60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Request Details</h2>
                <p className="text-blue-100">Request ID: #{request.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
          {/* Main Content */}
          <div className="p-8 space-y-8">
            {/* Status and Actions Bar */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Current Status:
                  </span>
                  <StatusBadge status={request.status} />
                </div>
                <div className="h-6 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatDate(request.updated_at || request.created_at)}
                </div>
              </div>

              {request.status === "pending" && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      onUpdateStatus(request.id, "rejected");
                      onClose();
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(request.id, "approved");
                      onClose();
                    }}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve</span>
                  </button>
                </div>
              )}
            </div>

            {/* Personal Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {request.resident_name || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Age
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {request.age || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Gender
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {request.gender || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Request Type
                  </label>
                  <p className="text-base font-semibold text-blue-700">
                    {request.type}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Municipality
                  </label>
                  <p className="text-base font-semibold text-gray-900 flex items-center">
                    <Building2 className="w-4 h-4 mr-1 text-gray-500" />
                    {request.municipality || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Street Address
                  </label>
                  <p className="text-base font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gray-500" />
                    {request.street || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Medical Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Hospital Admitted
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {request.hospital_admitted || "N/A"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Date Submitted
                  </label>
                  <p className="text-base font-semibold text-gray-900">
                    {formatDate(request.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Request Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {request.details}
                </p>
              </div>
            </div>

            {/* Supporting Documents */}
            {documents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-orange-600" />
                  Supporting Documents
                  <span className="ml-2 bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full">
                    {documents.length} files
                  </span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, index) => (
                    <button
                      key={index}
                      onClick={() => handleViewDocument(doc.path)}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                    >
                      <FileImage className="w-8 h-8 text-blue-600 mr-3 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                          {doc.label}
                        </p>
                        <p className="text-sm text-gray-500">
                          Click to view document
                        </p>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Receipt Document */}
            {/* {request.receipt_path && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileCheck className="w-5 h-5 mr-2 text-green-600" />
                  Receipt Document
                </h3>
                
                <button
                  onClick={() => handleViewDocument(request.receipt_path)}
                  className="flex items-center p-4 border border-green-200 bg-green-50 rounded-lg hover:border-green-300 hover:bg-green-100 transition-all text-left group w-full"
                >
                  <FileText className="w-8 h-8 text-green-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-green-900">Receipt File</p>
                    <p className="text-sm text-green-600">View uploaded receipt document</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-green-600" />
                </button>
              </div>
            )} */}

            {/* File Upload Section for Approved Requests */}
            {request.status === "approved" && !request.approval_file && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Choose Approval Type & Upload File
                </h3>

                {/* Select approval type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approval Type
                  </label>
                  <select
                    value={approvalType}
                    onChange={(e) => setApprovalType(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="">-- Select --</option>
                    <option value="cash_payment">Cash Release</option>
                    <option value="guarantee_letter">Guarantee Letter</option>
                  </select>
                </div>

                {approvalType === "cash_payment" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>

                    {/* Amount dropdown with custom option */}
                    <select
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setCustomAmount(""); // clear custom input if dropdown selected
                      }}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 mb-2"
                    >
                      <option value="">-- Select amount --</option>
                      <option value="100">₱100</option>
                      <option value="500">₱500</option>
                      <option value="1000">₱1,000</option>
                      <option value="5000">₱5,000</option>
                      <option value="10000">₱10,000</option>
                      <option value="50000">₱50,000</option>
                      <option value="100000">₱100,000</option>
                      <option value="500000">₱500,000</option>
                      <option value="1000000">₱1,000,000</option>
                      <option value="custom">
                        -- Enter custom amount --
                      </option>{" "}
                      {/* Custom option */}
                    </select>

                    {/* Show input only if custom is selected */}
                    {amount === "custom" && (
                      <input
                        type="number"
                        min="100"
                        max="1000000"
                        placeholder="Type amount here"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          // Optionally keep dropdown cleared when typing
                          // setAmount("");
                        }}
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                    )}
                  </div>
                )}

                {/* File Upload based on selection */}
                {approvalType && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer cursor-pointer"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {approvalType === "cash_payment"
                        ? "Upload the receipt of cash released."
                        : "Upload the signed guarantee letter by Cong."}
                    </p>
                    {isUploading && (
                      <div className="mt-3 flex items-center text-blue-600">
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        <span className="text-sm">Uploading...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Final Document Section */}
            {request.approval_file && (
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-emerald-600" />
                  Final Document
                </h3>

                <button
                  onClick={() => handleViewDocument(request.approval_file)}
                  className="flex items-center p-4 border border-emerald-200 bg-emerald-50 rounded-lg hover:border-emerald-300 hover:bg-emerald-100 transition-all text-left group w-full"
                >
                  <FileCheck className="w-8 h-8 text-emerald-600 mr-3" />
                  <div className="flex-1">
                    <p className="font-medium text-emerald-900">
                      Completed Document
                    </p>
                    <p className="text-sm text-emerald-600">
                      {request.approval_type === "cash_payment"
                        ? "Receipt of Cash Released"
                        : "Signed Guarantee Letter"}
                    </p>

                    {/* Show amount if cash_payment */}
                    {request.approval_type === "cash_payment" &&
                      request.cash_amount && (
                        <p className="mt-1 text-sm font-semibold text-emerald-800">
                          Amount Released: ₱
                          {Number(request.cash_amount).toLocaleString()}
                        </p>
                      )}
                  </div>
                  <Download className="w-4 h-4 text-emerald-600" />
                </button>
              </div>
            )}
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

  // Use a useMemo hook to group the filtered requests by user.
  // This memoized value will only be re-calculated when `filteredRequests` changes.
  const groupedRequests = useMemo(() => {
    return filteredRequests.reduce((groups, request) => {
      const user = request.resident_name || "Unknown Resident";
      if (!groups[user]) {
        groups[user] = [];
      }
      groups[user].push(request);
      return groups;
    }, {});
  }, [filteredRequests]);

  return (
    <div className="min-h-screen bg-gray-50">
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

      <main className="p-6 space-y-6">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name or request type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="completed">Completed</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setIsRefreshing(true);
                  fetchRequests().then(() => setIsRefreshing(false));
                  fetchStats();
                }}
                className={`p-3 bg-white border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors ${
                  isRefreshing ? "animate-spin" : ""
                }`}
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <ArrowUpRight className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <List className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start space-x-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start space-x-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.completed}
              </p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 flex items-start space-x-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                This Month's Requests
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.thisMonth}
              </p>
            </div>
          </div>
        </div>

        {/* Grouped Requests List */}
        <div className="space-y-8">
          {Object.keys(groupedRequests).length > 0 ? (
            Object.keys(groupedRequests).map((userName) => (
              <div key={userName}>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <User className="w-6 h-6 text-gray-600" />
                  <span>{userName}</span>
                  <span className="text-base text-gray-500 font-normal">
                    ({groupedRequests[userName].length} requests)
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {groupedRequests[userName].map((request) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      onViewDetails={openModal}
                      onUpdateStatus={handleUpdateStatus}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p className="text-lg font-semibold mb-2">No requests found.</p>
              <p>Try adjusting your search or filter settings.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminRecordsRequest;
