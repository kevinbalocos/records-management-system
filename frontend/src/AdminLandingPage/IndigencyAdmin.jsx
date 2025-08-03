import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileText,
  User,
  MoreVertical,
  CalendarDays,
  List,
  FolderOpen,
  Download,
  Eye,
} from "lucide-react";
// Using built-in Date methods instead of moment

const API_BASE = "http://localhost:5000";

// Custom Toast component for consistency (if you want to replace react-toastify)
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

// Custom hook for toast notifications
const useToast = () => {
  const [toastState, setToastState] = useState(null);

  const showToast = (message, type = "success", duration = 4000) => {
    setToastState({ message, type, isVisible: true });
    setTimeout(() => {
      setToastState((prev) => (prev ? { ...prev, isVisible: false } : null));
    }, duration);
    setTimeout(() => {
      setToastState(null);
    }, duration + 300);
  };

  const hideToast = () => {
    setToastState((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setToastState(null);
    }, 300);
  };

  return { toast: toastState, showToast, hideToast };
};

// Status classes matching AdminDashboard
const statusClasses = {
  pending: "text-yellow-600 bg-yellow-100 border-yellow-200",
  approved: "text-green-600 bg-green-100 border-green-200",
  rejected: "text-red-600 bg-red-100 border-red-200",
};

const IndigencyAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast: customToast, showToast, hideToast } = useToast();

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/indigency`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setRequests(data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load indigency requests");
      showToast("Failed to load indigency requests", "error");
      setRequests([]);
    }
  };

  const fetchStats = async () => {
    try {
      // Calculate stats from requests data
      const res = await axios.get(`${API_BASE}/api/indigency`);
      const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
      
      const total = data.length;
      const pending = data.filter(req => req.status === 'pending').length;
      const approved = data.filter(req => req.status === 'approved').length;
      const thisMonth = data.filter(req => {
        const reqDate = new Date(req.created_at);
        const now = new Date();
        return reqDate.getMonth() === now.getMonth() && reqDate.getFullYear() === now.getFullYear();
      }).length;

      setStats({ total, pending, approved, thisMonth });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const approveRequest = async (id) => {
    try {
      await axios.put(`${API_BASE}/api/indigency/approve/${id}`);
      toast.success("Request approved and certificate generated");
      showToast("Request approved and certificate generated", "success");
      fetchRequests();
      fetchStats();
    } catch (err) {
      console.error("Approve error:", err);
      toast.error("Failed to approve request");
      showToast("Failed to approve request", "error");
    }
  };

  const downloadCertificate = (id) => {
    window.open(`${API_BASE}/api/indigency/download/${id}`, "_blank");
  };

  // Opens the modal to view request details
  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  // Closes the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Returns the appropriate icon for a given status
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 mr-2" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 mr-2" />;
      case "rejected":
        return <XCircle className="w-4 h-4 mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
      {/* Custom Toast Notification */}
      {customToast && (
        <Toast
          message={customToast.message}
          type={customToast.type}
          onClose={hideToast}
          isVisible={customToast.isVisible}
        />
      )}

      {/* Modal for Request Details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300 hover:scale-100">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Indigency Certificate Details
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
                  <span className="font-semibold text-gray-700">Name:</span>{" "}
                  {selectedRequest.first_name} {selectedRequest.last_name}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">User ID:</span>{" "}
                  {selectedRequest.user_id}
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
                  {new Date(selectedRequest.created_at).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">Purpose:</p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-gray-800">{selectedRequest.purpose}</p>
                </div>
              </div>
              {selectedRequest.proof_file && (
                <div>
                  <p className="font-semibold text-gray-700 mb-2">
                    Supporting Document:
                  </p>
                  <a
                    href={`${API_BASE}/uploads/${selectedRequest.proof_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-300 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 mr-3" />
                    View Proof Document
                  </a>
                </div>
              )}
              {selectedRequest.status === "approved" && (
                <div className="pt-4 border-t">
                  <button
                    onClick={() => downloadCertificate(selectedRequest.id)}
                    className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Certificate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm p-6 flex items-center justify-between z-10 sticky top-0">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="text-teal-600">Indigency</span> Certificate Admin
        </h1>
      </header>

      <div className="flex-1 p-6 space-y-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Requests
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total || 0}
                </p>
              </div>
              <div className="p-3 bg-teal-100 text-teal-600 rounded-full">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.pending || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Approved</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.approved || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 transform hover:scale-105 transition-transform duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.thisMonth || 0}
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <CalendarDays className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Requests List Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
              <List className="w-6 h-6 mr-2 text-teal-600" />
              Indigency Certificate Requests
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {requests.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-lg">
                <p>No indigency certificate requests at the moment.</p>
              </div>
            ) : (
              requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <div className="flex items-center space-x-2">
                        <User className="w-5 h-5 text-teal-600" />
                        <span className="font-semibold text-gray-800">
                          {request.first_name} {request.last_name}
                        </span>
                      </div>
                      <span
                        className={`ml-4 text-xs font-medium px-2 py-1 rounded-full border flex items-center ${
                          statusClasses[request.status]
                        }`}
                      >
                        {getStatusIcon(request.status)}
                        {request.status}
                      </span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => openModal(request)}
                        className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Purpose:</span>{" "}
                        {request.purpose}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {new Date(request.created_at).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === "pending" && (
                        <button
                          onClick={() => approveRequest(request.id)}
                          className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                          title="Approve Request"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      {request.status === "approved" && (
                        <button
                          onClick={() => downloadCertificate(request.id)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors"
                          title="Download Certificate"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndigencyAdmin;