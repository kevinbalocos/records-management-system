import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  LogOut,
  Download,
  Eye,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

// Re-using the Toast and useToast components from the resident side
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
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const AdminRecords = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const { toast, showToast, hideToast } = useToast();
  const adminId = localStorage.getItem("userId");

  const fetchRequests = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/requests/");
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

  useEffect(() => {
    fetchRequests();
    fetchAdminInfo();
    socket.on("newRequest", (newRequest) => {
      setRequests((prevRequests) => [newRequest, ...prevRequests]);
      showToast("A new resident request has been submitted!", "info");
    });

    return () => {
      socket.off("newRequest");
    };
  }, [adminId]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.post(`http://localhost:5000/api/requests/${id}/status`, {
        status,
      });
      showToast("Request status updated successfully!", "success");
      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast("Failed to update request status.", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
          isVisible={toast.isVisible}
        />
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Records</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">
            Welcome, {userInfo.first_name || "Admin"}
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">
              Resident Requests
            </h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resident ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted On
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No requests found.
                      </td>
                    </tr>
                  ) : (
                    requests.map((request) => (
                      <tr key={request.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {request.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.user_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {request.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {request.details}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              statusClasses[request.status]
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            {request.file_path && (
                              <a
                                href={`http://localhost:5000/uploads/${request.file_path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-teal-600 hover:text-teal-900"
                                title="View Document"
                              >
                                <Eye className="w-5 h-5" />
                              </a>
                            )}
                            {request.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(request.id, "completed")
                                  }
                                  className="text-green-600 hover:text-green-900"
                                  title="Mark as Completed"
                                >
                                  <CheckCircle className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(request.id, "rejected")
                                  }
                                  className="text-red-600 hover:text-red-900"
                                  title="Reject Request"
                                >
                                  <XCircle className="w-5 h-5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminRecords;
