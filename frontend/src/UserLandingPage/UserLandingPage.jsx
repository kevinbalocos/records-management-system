import { useState, useEffect } from "react";
import RecordsLandingPage from "./UserRecordsRequest";
import IndigencyRequest from "../UserLandingPage/UserIndigencyRequest";
import UserCorrectionForm from "../UserLandingPage/UserCorrectionForm";
import UserCorrectionHistory from "./UserCorrectionHistory";
import { useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  CheckCircle,
  ClipboardList,
  X,
  Clock,
} from "lucide-react";

export default function UserPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem("UserActiveMenuItem");
    return savedItem || "dashboard";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("UserActiveMenuItem", activeItem);
  }, [activeItem]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resident-request", label: "Resident Request", icon: CheckCircle },
    {
      id: "indigency-request",
      label: "Indigency Request",
      icon: ClipboardList,
    },
    { id: "corrections", label: "Correction Request", icon: ClipboardList },
    { id: "correction-history", label: "Correction History", icon: Clock },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden lg:flex-row">
      {/* Sidebar for Larger Screens (lg and up) */}
      <div
        className={`${
          isCollapsed ? "lg:w-20" : "lg:w-72"
        } hidden lg:flex bg-white shadow-lg transition-all duration-300 flex-col relative z-20 border-r border-gray-100 flex-shrink-0`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center shadow-md">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-gray-800 text-xl tracking-wide">
                UserHub
              </span>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-200 text-gray-600"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
              >
                <Icon
                  className={`w-6 h-6 ${
                    isActive
                      ? "text-teal-600"
                      : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                {!isCollapsed && <span className="text-lg">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        {/* User Profile */}
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "space-x-3"
            } mb-3`}
          >
            <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-lg font-semibold text-gray-800 truncate">
                  John Doe
                </p>
                <p className="text-sm text-gray-500 truncate">User Portal</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="w-full mt-4 flex items-center justify-center space-x-2 px-3 py-2.5 text-base text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:text-gray-800" />
              <span className="font-medium group-hover:text-gray-800">
                Sign Out
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden">
        {/* Top Bar for Mobile (with menu button) */}
        <div className="bg-white p-4 flex items-center justify-between border-b border-gray-100 lg:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center shadow-md">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-800 text-xl tracking-wide">
              UserHub
            </span>
          </div>
        </div>

        {/* Mobile Overlay Menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="absolute top-0 right-0 w-64 h-full bg-white shadow-lg p-4 flex flex-col animate-slide-in-right"
              onClick={(e) => e.stopPropagation()}
            >
              {" "}
              {/* Prevent clicks from closing overlay */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveItem(item.id);
                        setIsMobileMenuOpen(false); // Close menu on item click
                      }}
                      className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group
                        ${
                          isActive
                            ? "bg-teal-50 text-teal-700 font-semibold border-l-4 border-teal-500"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${
                          isActive
                            ? "text-teal-600"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                      <span className="text-lg">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-gray-100 mt-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-lg font-semibold text-gray-800 truncate">
                      John Doe
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      User Portal
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full mt-4 flex items-center justify-center space-x-2 px-3 py-2.5 text-base text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 group"
                >
                  <LogOut className="w-5 h-5 group-hover:text-gray-800" />
                  <span className="font-medium group-hover:text-gray-800">
                    Sign Out
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Page Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-teal-50">
          {activeItem === "dashboard" && (
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 text-center text-gray-700 font-semibold text-xl sm:text-2xl h-full flex items-center justify-center border border-gray-100"></div>
          )}
          {activeItem === "resident-request" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <RecordsLandingPage />
            </div>
          )}
          {activeItem === "indigency-request" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <IndigencyRequest />
            </div>
          )}
          {activeItem === "corrections" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <UserCorrectionForm />
            </div>
          )}
          {activeItem === "correction-history" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
              <UserCorrectionHistory />
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation for Mobile Devices (hidden on lg and up) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-30 flex justify-around p-2 lg:hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveItem(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-sm font-medium
                ${
                  isActive
                    ? "text-teal-600 bg-teal-50"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 ${
                  isActive ? "text-teal-600" : "text-gray-400"
                }`}
              />
              {item.label}
            </button>
          );
        })}
        {/* User Profile / Logout for Mobile Bottom Nav (Optional, can be added to overlay menu) */}
        <button
          onClick={() => setIsMobileMenuOpen(true)} // Open full menu for more options
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-sm font-medium
                ${
                  isMobileMenuOpen
                    ? "text-teal-600 bg-teal-50"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                }`}
        >
          <User className="w-5 h-5 mb-1 text-gray-400" />
          More
        </button>
      </div>
    </div>
  );
}
