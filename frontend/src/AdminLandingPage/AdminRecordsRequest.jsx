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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const socket = io("http://localhost:5000");

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

const statusClasses = {
  pending: "text-yellow-600 bg-yellow-100 border-yellow-200",
  completed: "text-green-600 bg-green-100 border-green-200",
  rejected: "text-red-600 bg-red-100 border-red-200",
};

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

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests");
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      showToast("Failed to load requests.", "error");
    }
  };

  const fetchAdminInfo = async () => {
    if (!adminId) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${adminId}`
      );
      setUserInfo(response.data);
    } catch (error) {
      console.error("Failed to fetch admin info", error);
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
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAdminInfo();
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
  }, [adminId, showToast]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/requests/${id}/status`, {
        status,
      });
      showToast("Request status updated successfully!", "success");
      fetchRequests();
      fetchStats();
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update request status.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-inter">
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
        <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 transform transition-all duration-300  hover:scale-100">
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
                  {selectedRequest.resident_name}
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
                    Supporting Document:
                  </p>
                  <a
                    href={`http://localhost:5000/uploads/${selectedRequest.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-3 border border-gray-300 rounded-lg text-teal-600 hover:bg-teal-50 transition-colors"
                  >
                    <FolderOpen className="w-5 h-5 mr-3" />
                    View Document
                  </a>
                </div>
              )}
              {selectedRequest.status === "approved" &&
                !selectedRequest.admin_file_path && (
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
                          // Upload the file
                          await axios.post(
                            `http://localhost:5000/api/requests/${selectedRequest.id}/upload`,
                            formData
                          );

                          // Update the status to completed
                          await handleUpdateStatus(
                            selectedRequest.id,
                            "completed"
                          );

                          closeModal(); // Optional: close modal after success
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
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <header className="bg-white shadow-sm p-6 flex items-center justify-between z-10 sticky top-0">
        <h1 className="text-3xl font-bold text-gray-900">
          <span className="text-teal-600">Resident</span> Records Admin
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium hidden sm:block">
            Welcome, {userInfo.first_name || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
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
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.completed || 0}
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
              Request Log
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {requests.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-lg">
                <p>No new requests at the moment.</p>
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
                          {request.resident_name ||
                            `Resident ID: ${request.user_id}`}
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
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span>{" "}
                        {request.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Date:</span>{" "}
                        {moment(request.created_at).format("MMMM D, YYYY")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {request.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateStatus(request.id, "approved")
                            }
                            className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(request.id, "rejected")
                            }
                            className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors"
                            title="Reject Request"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
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

export default AdminDashboard;
