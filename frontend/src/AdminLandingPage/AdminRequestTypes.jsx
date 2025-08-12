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
  Save,
  Loader,
  Clock,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

const SystemAlert = ({ message, type, onClose, isVisible }) => {
  if (!isVisible) return null;

  const getAlertStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 mr-3 flex-shrink-0";
    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
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
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-3 rounded-lg shadow-md border flex items-center transition-opacity duration-300 ${getAlertStyles()} ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {getIcon()}
      <p className="font-medium text-sm">{message}</p>
      <button
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
};

const useSystemAlert = () => {
  const [alertState, setAlertState] = useState(null);

  const showAlert = useCallback(
    (message, type = "success", duration = 4000) => {
      setAlertState({ message, type, isVisible: true });
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

const ConfirmationDialog = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const RequestTypeFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) => {
  const [name, setName] = useState(initialData ? initialData.name : "");
  const [description, setDescription] = useState(
    initialData ? initialData.description : ""
  );
  const [price, setPrice] = useState(initialData ? initialData.price : 0);
  const [status, setStatus] = useState(
    initialData ? initialData.status : "draft"
  ); // ADD THIS LINE: Define the loading state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setName(initialData ? initialData.name : "");
      setDescription(initialData ? initialData.description : "");
      setPrice(initialData ? initialData.price : 0);
      setStatus(initialData ? initialData.status : "draft");
      setLoading(false);
    }
  }, [isOpen, initialData]);
  // ... rest of the component remains the same

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ id: initialData?.id, name, description, status }); // Added price
    setLoading(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold">
            {initialData ? "Edit Request Type" : "Create New Request Type"}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            ></textarea>
          </div>
          {/* New Price Input Field */}
          {/* <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Price (e.g., 25.50)
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div> */}
          {initialData && (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded hover:bg-teal-700 disabled:bg-gray-400 flex items-center space-x-2"
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
  );
};

const AdminRequestTypes = () => {
  const [requestTypes, setRequestTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const { alert: systemAlert, showAlert, hideAlert } = useSystemAlert();

  const fetchRequestTypes = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/api/request-types`);
      setRequestTypes(res.data);
    } catch (err) {
      console.error("Failed to fetch request types:", err);
      showAlert("Failed to load request types.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [showAlert]);

  useEffect(() => {
    fetchRequestTypes();
  }, [fetchRequestTypes]);

  const handleCreateOrUpdate = async (data) => {
    try {
      if (data.id) {
        // If updating, send all fields including price and status
        await axios.put(`${API_BASE}/api/request-types/${data.id}`, {
          name: data.name,
          description: data.description, // <-- ADD THIS LINE
          status: data.status,
        });
        showAlert("Request type updated successfully!", "success");
      } else {
        // If creating, send the name, description, and price
        await axios.post(`${API_BASE}/api/request-types`, {
          name: data.name,
          description: data.description, // <-- ADD THIS LINE
        });
        showAlert("Request type created successfully as draft!", "success");
      }
      fetchRequestTypes();
    } catch (err) {
      console.error("Error saving request type:", err);
      showAlert(
        err.response?.data?.message || "Failed to save request type.",
        "error"
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
          showAlert("Request type deleted successfully!", "success");
          fetchRequestTypes();
        } catch (err) {
          console.error("Error deleting request type:", err);
          showAlert(
            err.response?.data?.message || "Failed to delete request type.",
            "error"
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
            name: requestTypes.find((t) => t.id === typeId).name,
            description: requestTypes.find((t) => t.id === typeId).description,
            status: newStatus,
          });
          showAlert(`Request type ${newStatus} successfully!`, "success");
          fetchRequestTypes();
        } catch (err) {
          console.error("Error toggling status:", err);
          showAlert(
            err.response?.data?.message || "Failed to toggle status.",
            "error"
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

  const getStatusBadge = (status) => {
    switch (status) {
      case "draft":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-3 h-3 mr-1" />
            Draft
          </span>
        );
      case "published":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Published
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {systemAlert && (
        <SystemAlert
          message={systemAlert.message}
          type={systemAlert.type}
          onClose={hideAlert}
          isVisible={systemAlert.isVisible}
        />
      )}
      {confirmAction && (
        <ConfirmationDialog
          isOpen={!!confirmAction}
          onClose={confirmAction.onClose}
          onConfirm={confirmAction.onConfirm}
          message={confirmAction.message}
        />
      )}

      <RequestTypeFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleCreateOrUpdate}
        initialData={editingType}
      />

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-semibold flex items-center text-gray-900">
            <List className="w-6 h-6 mr-2 text-teal-600" />
            Manage Request Types
          </h2>
          <button
            onClick={openCreateModal}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Add New Type</span>
          </button>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-gray-500">
            <Loader className="w-8 h-8 mx-auto animate-spin mb-4" />
            <p>Loading request types...</p>
          </div>
        ) : requestTypes.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            <p>No request types found. Click "Add New Type" to create one.</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {requestTypes.map((type) => (
              <div
                key={type.id}
                className="p-4 border rounded-lg shadow-sm flex items-center justify-between bg-white hover:bg-gray-50"
              >
                <div className="flex-1 mr-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {type.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {type.description || "No description provided."}
                  </p>
                  {/* Display the price */}
                  {/* <p className="text-sm text-gray-800 font-semibold mt-1">
                    Price: $
                    {type.price ? Number(type.price).toFixed(2) : "0.00"}
                  </p> */}
                  <div className="mt-2">{getStatusBadge(type.status)}</div>
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => openEditModal(type)}
                    className="p-2 text-gray-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
                    title="Edit Request Type"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleStatus(type.id, type.status)}
                    className="p-2 text-gray-500 rounded-full transition-colors"
                    title={
                      type.status === "published" ? "Unpublish" : "Publish"
                    }
                  >
                    {type.status === "published" ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(type.id)}
                    className="p-2 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete Request Type"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRequestTypes;
