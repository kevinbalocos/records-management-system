import { useEffect, useState, useMemo, useCallback, Fragment } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  Calendar,
  RefreshCw,
  UserCheck,
  UserX,
  Download,
  MoreHorizontal,
  Info,
  LogOut,
} from "lucide-react";

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-sm flex justify-center items-center p-4">
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm mx-auto p-6 transform transition-all sm:w-full animate-scale-in">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Info className="h-6 w-6 text-blue-600" aria-hidden="true" />
          </div>
          <h3 className="mt-4 text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-base font-medium text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:col-start-2 sm:text-sm"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminAndSuperAdminPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState(null);

  const loggedInUserRole = localStorage.getItem("userRole");
  const loggedInUserEmail = localStorage.getItem("userEmail");

  const [loggedInUserId, setLoggedInUserId] = useState(null);
  useEffect(() => {
    if (loggedInUserEmail && users.length > 0) {
      const currentUser = users.find(
        (user) => user.email === loggedInUserEmail
      );
      if (currentUser) {
        setLoggedInUserId(currentUser.id);
      }
    }
  }, [loggedInUserEmail, users]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
 
      const res = await axios.get(
        `http://localhost:5000/api/users?role=${loggedInUserRole}&userId=${loggedInUserId}`
      );
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError(err.response?.data?.message || "Failed to fetch users.");
      toast.error(err.response?.data?.message || "Failed to fetch users.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [loggedInUserRole, loggedInUserId]); 

  useEffect(() => {
  
    if (loggedInUserRole) {
      fetchUsers();
    }
  }, [fetchUsers, loggedInUserRole]);

  useEffect(() => {
    setShowBulkActions(selectedUsers.length > 0);
  }, [selectedUsers]);

  const refreshUsers = async () => {
    setIsRefreshing(true);
    await fetchUsers();
  };

  const updateStatus = async (id, status, targetUserRole) => {
  
    if (loggedInUserRole === "admin" && targetUserRole !== "user") {
      toast.error("Admins can only change the status of regular users.");
      return;
    }

    toast.promise(
      axios.post(`http://localhost:5000/api/users/${id}/status`, {
        status,
        requestingUserRole: loggedInUserRole,
      }),
      {
        loading: `Updating user status to ${status}...`,
        success: (res) => {
          fetchUsers();
          return `User status updated to ${status}.`;
        },
        error: (err) => {
          return err.response?.data?.message || "Failed to update status.";
        },
      }
    );
  };

  const handleBulkUpdateClick = (status) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected for bulk action.");
      return;
    }


    const usersToModify = users.filter((user) =>
      selectedUsers.includes(user.id)
    );
    const unauthorizedSelection = usersToModify.some(
      (user) => loggedInUserRole === "admin" && user.role !== "user"
    );

    if (unauthorizedSelection) {
      toast.error(
        "Admins cannot perform bulk actions on other admin accounts."
      );
      return;
    }

    setActionToConfirm(status);
    setIsConfirmDialogOpen(true);
  };

  const confirmBulkUpdate = async () => {
    setIsConfirmDialogOpen(false);
    if (!actionToConfirm) return;

    const status = actionToConfirm;

    const usersToUpdate = users.filter((user) =>
      selectedUsers.includes(user.id)
    );

    toast.promise(
      Promise.all(
        usersToUpdate.map((user) =>
          axios.post(`http://localhost:5000/api/users/${user.id}/status`, {
            status,
            requestingUserRole: loggedInUserRole,
          })
        )
      ),
      {
        loading: `Performing bulk ${status} on ${selectedUsers.length} users...`,
        success: (res) => {
          setSelectedUsers([]);
          fetchUsers();
          return `Successfully ${status}d ${selectedUsers.length} users.`;
        },
        error: (err) => {
          return err.response?.data?.message || "Bulk update failed.";
        },
      }
    );
    setActionToConfirm(null);
  };

  const cancelBulkUpdate = () => {
    setIsConfirmDialogOpen(false);
    setActionToConfirm(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userEmail"); 

    window.location.href = "/";
    toast.success("Logged out successfully!");
  };

  const filteredAndSearchedUsers = useMemo(() => {
    let currentUsers = [...users];

    if (statusFilter !== "all") {
      currentUsers = currentUsers.filter(
        (user) => user.status === statusFilter
      );
    }

    if (searchTerm) {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      currentUsers = currentUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(lowercasedSearchTerm) ||
          (user.first_name &&
            user.first_name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (user.last_name &&
            user.last_name.toLowerCase().includes(lowercasedSearchTerm)) ||
          (user.phone_number &&
            user.phone_number.includes(lowercasedSearchTerm))
      );
    }

    return currentUsers.sort((a, b) => {
      const roleOrder = { superadmin: 1, admin: 2, user: 3 };
      const statusOrder = { pending: 1, denied: 2, approved: 3 };

      if (roleOrder[a.role] !== roleOrder[b.role]) {
        return roleOrder[a.role] - roleOrder[b.role];
      }
      return statusOrder[a.status] - statusOrder[b.status];
    });
  }, [users, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    return {
      total: filteredAndSearchedUsers.length,
      pending: filteredAndSearchedUsers.filter((u) => u.status === "pending")
        .length,
      approved: filteredAndSearchedUsers.filter((u) => u.status === "approved")
        .length,
      denied: filteredAndSearchedUsers.filter((u) => u.status === "denied")
        .length,
      admins: filteredAndSearchedUsers.filter((u) => u.role === "admin").length,
      superadmins: filteredAndSearchedUsers.filter(
        (u) => u.role === "superadmin"
      ).length,
    };
  }, [filteredAndSearchedUsers]);

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "text-emerald-700 bg-emerald-100 border-emerald-200";
      case "denied":
        return "text-red-700 bg-red-100 border-red-200";
      case "pending":
        return "text-amber-700 bg-amber-100 border-amber-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "denied":
        return <XCircle className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    const allIds = filteredAndSearchedUsers.map((u) => u.id);
    setSelectedUsers(
      selectedUsers.length === allIds.length && allIds.length > 0 ? [] : allIds
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-teal-100 font-sans">
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerStyle={{ zIndex: 9999 }}
        toastOptions={{
          className: "shadow-lg rounded-xl",
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "1rem",
            padding: "12px 20px",
            border: "1px solid #E5E7EB",
          },
          success: {
            iconTheme: { primary: "#10B981", secondary: "#fff" },
            style: {
              background: "#ECFDF5",
              color: "#065F46",
              border: "1px solid #34D399",
              boxShadow:
                "0 4px 6px -1px rgba(16, 185, 129, 0.1), 0 2px 4px -1px rgba(16, 185, 129, 0.06)",
            },
          },
          error: {
            iconTheme: { primary: "#EF4444", secondary: "#fff" },
            style: {
              background: "#FEF2F2",
              color: "#991B1B",
              border: "1px solid #F87171",
              boxShadow:
                "0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)",
            },
          },
        }}
      />

      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        title={`Confirm Bulk ${
          actionToConfirm === "approved" ? "Approval" : "Denial"
        }`}
        message={`Are you sure you want to ${actionToConfirm} ${selectedUsers.length} users? This action cannot be undone.`}
        onConfirm={confirmBulkUpdate}
        onCancel={cancelBulkUpdate}
        confirmText={
          actionToConfirm === "approved" ? "Approve All" : "Deny All"
        }
      />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-teal-600 to-teal-600 rounded-xl shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-500">
                  Manage user approvals and permissions ({loggedInUserRole})
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={refreshUsers}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="bg-teal-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-amber-600 mt-2">
                  {stats.pending}
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-xl">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">
                  {stats.approved}
                </p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-xl">
                <UserCheck className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Denied</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.denied}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 w-80"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
            </div>

            {/* Bulk Actions */}
            {showBulkActions && (
              <div className="flex items-center space-x-3 animate-in slide-in-from-right duration-300">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={() => handleBulkUpdateClick("approved")}
                  className="flex items-center space-x-2 px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-all duration-200"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve All</span>
                </button>
                <button
                  onClick={() => handleBulkUpdateClick("denied")}
                  className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Deny All</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="text-gray-500">Loading users...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center bg-red-50 border border-red-200 text-red-700 p-6 rounded-xl my-8 mx-auto max-w-md">
              <Info className="w-8 h-8 mx-auto text-red-500 mb-4" />
              <p className="font-semibold text-lg mb-2">Error loading data:</p>
              <p>{error}</p>
              <button
                onClick={fetchUsers}
                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredAndSearchedUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">No users found</p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedUsers.length ===
                            filteredAndSearchedUsers.length &&
                          filteredAndSearchedUsers.length > 0
                        }
                        onChange={selectAllUsers}
                        className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>{" "}
                
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Active
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAndSearchedUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className={`hover:bg-gray-50 transition-all duration-150 ${
                        selectedUsers.includes(user.id) ? "bg-teal-50" : ""
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleUserSelection(user.id)}
                         
                          disabled={
                            user.role === "superadmin" &&
                            loggedInUserRole !== "superadmin"
                          }
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-teal-400 to-teal-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.first_name && user.last_name
                                ? `${user.first_name} ${user.last_name}`
                                : user.email}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                        <span>{user.role}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            user.status
                          )}`}
                        >
                          {getStatusIcon(user.status)}
                          <span className="capitalize">{user.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {user.created_at
                            ? new Date(user.created_at).toLocaleDateString()
                            : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() =>
                              updateStatus(user.id, "approved", user.role)
                            }
                            disabled={
                              user.status === "approved" ||
                              (loggedInUserRole === "admin" &&
                                user.role !== "user") ||
                              (loggedInUserRole === "superadmin" &&
                                user.role === "superadmin") 
                            }
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-100 rounded-md hover:bg-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(user.id, "denied", user.role)
                            }
                            disabled={
                              user.status === "denied" ||
                              (loggedInUserRole === "admin" &&
                                user.role !== "user") || 
                              (loggedInUserRole === "superadmin" &&
                                user.role === "superadmin")
                            }
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Deny
                          </button>
                          <button className="inline-flex items-center px-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-all duration-200">
                            <MoreHorizontal className="w-3 h-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {filteredAndSearchedUsers.length} of {users.length} users
          </p>
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(-5%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        .animate-bounce {
          animation: bounce 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminAndSuperAdminPage;
