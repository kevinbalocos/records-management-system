import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  PlusCircle,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bell,
  List,
  FolderOpen,
  Save,
  Loader, // For loading states
  Clock,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

// Re-use SystemAlert component and useSystemAlert hook for consistency
const SystemAlert = ({
  message,
  type,
  onClose,
  isVisible,
  isDarkMode = false,
}) => {
  const getAlertStyles = () => {
    const baseStyles =
      "flex items-center p-4 rounded-xl shadow-2xl backdrop-blur-md border max-w-lg w-full";
    if (isDarkMode) {
      switch (type) {
        case "success":
          return `${baseStyles} bg-emerald-900/90 border-emerald-700 text-emerald-200`;
        case "error":
          return `${baseStyles} bg-red-900/90 border-red-700 text-red-200`;
        case "warning":
          return `${baseStyles} bg-amber-900/90 border-amber-700 text-amber-200`;
        case "info":
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
        case "info":
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
        default:
          return `${baseStyles} bg-blue-50/90 border-blue-200 text-blue-800`;
      }
    }
  };

  const getIcon = () => {
    const iconClass = "w-6 h-6 mr-3 flex-shrink-0";
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
      className={`fixed top-10 left-1/2 -translate-x-1/2 z-50 transform transition-all duration-500 ease-out
        ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-full opacity-0 scale-95"
        }`}
    >
      <div className={getAlertStyles()}>
        {getIcon()}
        <div className="flex-1">
          <p className="font-semibold text-base">{message}</p>
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
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const useSystemAlert = () => {
  const [alertState, setAlertState] = useState(null);

  const showAlert = useCallback(
    (message, type = "success", duration = 4000, isDarkMode = false) => {
      setAlertState({ message, type, isVisible: true, isDarkMode });
      setTimeout(() => {
        setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
      }, duration);
      setTimeout(() => {
        setAlertState(null);
      }, duration + 300);
    },
    []
  );

  const hideAlert = useCallback(() => {
    setAlertState((prev) => (prev ? { ...prev, isVisible: false } : null));
    setTimeout(() => {
      setAlertState(null);
    }, 300);
  }, []);

  return { alert: alertState, showAlert, hideAlert };
};

// Confirmation Dialog Component (re-used)
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  isDarkMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
        <div
          className={`relative w-full max-w-sm rounded-xl shadow-2xl p-6 transition-all transform
                        ${
                          isDarkMode
                            ? "bg-gray-800 text-gray-100"
                            : "bg-white text-gray-900"
                        }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Confirm Action
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}
          >
            {message}
          </p>
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                         ${
                           isDarkMode
                             ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                             : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                         }`}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg font-medium transition-colors
                         ${
                           isDarkMode
                             ? "bg-red-700 text-white hover:bg-red-600"
                             : "bg-blue-600 text-white hover:bg-blue-700"
                         }`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RequestTypeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  isDarkMode,
  initialData = null,
}) => {
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [status, setStatus] = useState(
    initialData ? initialData.status : "draft"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData ? initialData.name : "");
      setDescription(initialData ? initialData.description : "");
      setStatus(initialData ? initialData.status : "draft");
      setLoading(false);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ id: initialData?.id, name, description, status });
    setLoading(false);
    onClose(); // Close modal after submission
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>
        <div
          className={`relative w-full max-w-md transform rounded-2xl shadow-2xl transition-all
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
            <h3
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {initialData ? "Edit Request Type" : "Create New Request Type"}
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label
                htmlFor="name"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors
                            ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors resize-y
                            ${
                              isDarkMode
                                ? "bg-gray-700 border-gray-600 text-white"
                                : "bg-white border-gray-300 text-gray-900"
                            }`}
                disabled={loading}
              ></textarea>
            </div>
            {initialData && ( // Status can only be changed when editing
              <div>
                <label
                  htmlFor="status"
                  className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors
                              ${
                                isDarkMode
                                  ? "bg-gray-700 border-gray-600 text-white"
                                  : "bg-white border-gray-300 text-gray-900"
                              }`}
                  required
                  disabled={loading}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            )}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-lg font-medium transition-colors
                           ${
                             isDarkMode
                               ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                               : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                           }`}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2
                           ${
                             loading
                               ? "bg-gray-400 cursor-not-allowed"
                               : "bg-teal-600 text-white hover:bg-teal-700"
                           }`}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{initialData ? "Update" : "Create"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminRequestTypes = ({ isDarkMode = false }) => {
  const [requestTypes, setRequestTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null); // Null for create, object for edit
  const [confirmAction, setConfirmAction] = useState(null); // For confirmation dialogs
  const { alert: systemAlert, showAlert, hideAlert } = useSystemAlert();

  const fetchRequestTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/request-types`);
      setRequestTypes(res.data);
    } catch (err) {
      console.error("Failed to fetch request types:", err);
      showAlert("Failed to load request types.", "error", isDarkMode);
    } finally {
      setIsLoading(false);
    }
  }, [showAlert, isDarkMode]);

  useEffect(() => {
    fetchRequestTypes();
  }, [fetchRequestTypes]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (data.id) {
        // Update existing type
        await axios.put(`${API_BASE}/api/request-types/${data.id}`, {
          name: data.name,
          description: data.description,
          status: data.status,
        });
        showAlert("Request type updated successfully!", "success", isDarkMode);
      } else {
        // Create new type
        await axios.post(`${API_BASE}/api/request-types`, {
          name: data.name,
          description: data.description,
        });
        showAlert(
          "Request type created successfully as draft!",
          "success",
          isDarkMode
        );
      }
      fetchRequestTypes(); // Refresh list
    } catch (err) {
      console.error("Error saving request type:", err);
      showAlert(
        err.response?.data?.message || "Failed to save request type.",
        "error",
        isDarkMode
      );
    }
  };

  const handleDelete = (id) => {
    setConfirmAction({
      message:
        "Are you sure you want to delete this request type? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await axios.delete(`${API_BASE}/api/request-types/${id}`);
          showAlert(
            "Request type deleted successfully!",
            "success",
            isDarkMode
          );
          fetchRequestTypes();
        } catch (err) {
          console.error("Error deleting request type:", err);
          showAlert(
            err.response?.data?.message || "Failed to delete request type.",
            "error",
            isDarkMode
          );
        } finally {
          setConfirmAction(null);
        }
      },
      onClose: () => setConfirmAction(null),
    });
  };

  const handleToggleStatus = (typeId, currentStatus) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const message = `Are you sure you want to ${newStatus} this request type?`;

    setConfirmAction({
      message: message,
      onConfirm: async () => {
        try {
          await axios.put(`${API_BASE}/api/request-types/${typeId}`, {
            name: requestTypes.find((t) => t.id === typeId).name, // Keep existing name
            description: requestTypes.find((t) => t.id === typeId).description, // Keep existing description
            status: newStatus,
          });
          showAlert(
            `Request type ${newStatus} successfully!`,
            "success",
            isDarkMode
          );
          fetchRequestTypes();
        } catch (err) {
          console.error("Error toggling status:", err);
          showAlert(
            err.response?.data?.message || "Failed to toggle status.",
            "error",
            isDarkMode
          );
        } finally {
          setConfirmAction(null);
        }
      },
      onClose: () => setConfirmAction(null),
    });
  };

  const openCreateModal = () => {
    setEditingType(null);
    setIsModalOpen(true);
  };

  const openEditModal = (type) => {
    setEditingType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
  };

  const getStatusClasses = (status) => {
    if (isDarkMode) {
      switch (status) {
        case "draft":
          return "text-gray-200 bg-gray-700/50 border-gray-600";
        case "published":
          return "text-emerald-200 bg-emerald-900/50 border-emerald-700";
        default:
          return "text-gray-300 bg-gray-700/50 border-gray-600";
      }
    } else {
      switch (status) {
        case "draft":
          return "text-gray-600 bg-gray-100 border-gray-200";
        case "published":
          return "text-green-600 bg-green-100 border-green-200";
        default:
          return "text-gray-600 bg-gray-100 border-gray-200";
      }
    }
  };

  return (
    <div
      className={`min-h-screen font-inter transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {systemAlert && (
        <SystemAlert
          message={systemAlert.message}
          type={systemAlert.type}
          onClose={hideAlert}
          isVisible={systemAlert.isVisible}
          isDarkMode={isDarkMode}
        />
      )}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={!!confirmAction}
          onClose={confirmAction.onClose}
          onConfirm={confirmAction.onConfirm}
          message={confirmAction.message}
          isDarkMode={isDarkMode}
        />
      )}

      <RequestTypeFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateOrUpdate}
        initialData={editingType}
        isDarkMode={isDarkMode}
      />

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
            Manage Request Types
          </h2>
          <button
            onClick={openCreateModal}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-colors duration-200 shadow-sm border
                        ${
                          isDarkMode
                            ? "bg-teal-700 text-white hover:bg-teal-600 border-teal-600"
                            : "bg-teal-600 text-white hover:bg-teal-700 border-teal-600"
                        }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Type</span>
          </button>
        </div>

        {isLoading ? (
          <div
            className={`py-12 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <Loader className="w-8 h-8 mx-auto animate-spin mb-4" />
            <p>Loading request types...</p>
          </div>
        ) : requestTypes.length === 0 ? (
          <div
            className={`py-12 text-center ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            <p>No request types found. Click "Add New Type" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 custom-scrollbar max-h-[60vh] overflow-y-auto pr-2">
            {requestTypes.map((type) => (
              <div
                key={type.id}
                className={`group rounded-xl border p-4 shadow-sm hover:shadow-lg transition-all duration-300 flex items-center justify-between
                            ${
                              isDarkMode
                                ? "bg-gray-800 border-gray-700 hover:border-gray-600"
                                : "bg-white border-gray-200 hover:border-gray-300"
                            }`}
              >
                <div className="flex-1 mr-4">
                  <h3
                    className={`font-semibold text-lg ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {type.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {type.description || "No description provided."}
                  </p>
                  <span
                    className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusClasses(
                      type.status
                    )}`}
                  >
                    {type.status === "published" ? (
                      <CheckCircle className="w-3 h-3 mr-1" />
                    ) : (
                      <Clock className="w-3 h-3 mr-1" />
                    )}
                    {type.status}
                  </span>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(type)}
                    className={`p-2 rounded-full transition-colors group relative
                                ${
                                  isDarkMode
                                    ? "text-gray-400 hover:text-blue-300 hover:bg-gray-700/50"
                                    : "text-gray-500 hover:text-blue-700 hover:bg-blue-50"
                                }`}
                    title="Edit Request Type"
                  >
                    <Edit className="w-5 h-5" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Edit
                    </span>
                  </button>
                  <button
                    onClick={() => handleToggleStatus(type.id, type.status)}
                    className={`p-2 rounded-full transition-colors group relative
                                ${
                                  isDarkMode
                                    ? type.status === "published"
                                      ? "text-emerald-400 hover:text-emerald-200 hover:bg-emerald-900/50"
                                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-700/50"
                                    : type.status === "published"
                                    ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                }`}
                    title={
                      type.status === "published" ? "Unpublish" : "Publish"
                    }
                  >
                    {type.status === "published" ? (
                      <ToggleRight className="w-5 h-5" />
                    ) : (
                      <ToggleLeft className="w-5 h-5" />
                    )}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      {type.status === "published" ? "Unpublish" : "Publish"}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className={`p-2 rounded-full transition-colors group relative
                                ${
                                  isDarkMode
                                    ? "text-gray-400 hover:text-red-300 hover:bg-red-900/50"
                                    : "text-gray-500 hover:text-red-700 hover:bg-red-50"
                                }`}
                    title="Delete Request Type"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkMode ? "#374151" : "#f1f1f1"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkMode ? "#4b5563" : "#888"};
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "#6b7280" : "#555"};
        }
      `}</style>
    </div>
  );
};

export default AdminRequestTypes;
