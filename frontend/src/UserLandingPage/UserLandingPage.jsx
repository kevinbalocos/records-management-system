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
  Activity, // Add this import for the loading icon
} from "lucide-react";

const API_BASE = "http://localhost:5000";

function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// Loading Splash Component
const LoadingSplash = ({ isVisible, isDarkMode = false }) => {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-700
                  ${isVisible ? "opacity-100" : "opacity-0 pointer-events-none"}
                  ${isDarkMode ? "bg-gray-950" : "bg-white"}`}
    >
      <div className="text-center">
        <Activity
          className={`w-16 h-16 mx-auto animate-spin mb-4
                      ${isDarkMode ? "text-teal-400" : "text-teal-600"}`}
        />
        <h2
          className={`text-3xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Loading User Panel
        </h2>
        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Getting things ready for you...
        </p>
      </div>
    </div>
  );
};

export default function UserPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem("UserActiveMenuItem");
    return savedItem || "dashboard";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add loading states
  const [showSplash, setShowSplash] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // You can make this dynamic based on user preference
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState({});
  const userId = localStorage.getItem("userId");

  // Handle initial loading and splash screen
  useEffect(() => {
    // Minimum splash display time
    const minSplashTime = 1500; // 1.5 seconds minimum
    const startTime = Date.now();

    const hideSplash = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minSplashTime - elapsedTime);
      
      setTimeout(() => {
        setShowSplash(false);
      }, remainingTime);
    };

    // If no userId, hide splash after minimum time
    if (!userId) {
      hideSplash();
      setIsLoading(false);
      return;
    }

    // Fetch user data
    fetch(`${API_BASE}/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("User not found");
        return res.json();
      })
      .then((data) => {
        setUserInfo(data);
        setIsLoading(false);
        hideSplash();
      })
      .catch((error) => {
        console.error("Error loading user:", error);
        setIsLoading(false);
        hideSplash();
      });
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("UserActiveMenuItem", activeItem);
  }, [activeItem]);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "resident-request", label: "Resident Request", icon: CheckCircle },
    // Uncomment these as needed
    // {
    //   id: "indigency-request",
    //   label: "Indigency Request",
    //   icon: ClipboardList,
    // },
    // { id: "corrections", label: "Correction Request", icon: ClipboardList },
    // { id: "correction-history", label: "Correction History", icon: Clock },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("UserActiveMenuItem");
    navigate("/");
  };

  // Show loading splash
  if (showSplash) {
    return <LoadingSplash isVisible={showSplash} isDarkMode={isDarkMode} />;
  }

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
                  {userInfo.first_name
                    ? userInfo.first_name.charAt(0).toUpperCase() +
                      userInfo.first_name.slice(1)
                    : isLoading ? "Loading..." : "User"}
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
        {/* Top Bar for Mobile */}
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
                        setIsMobileMenuOpen(false);
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
                      {userInfo.first_name
                        ? userInfo.first_name.charAt(0).toUpperCase() +
                          userInfo.first_name.slice(1)
                        : isLoading ? "Loading..." : "User"}
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
        <main className="flex-1 overflow-y-auto bg-teal-50">
          {activeItem === "dashboard" && (
            <div className="bg-white rounded-xl shadow-lg sm:p-8 text-center text-gray-700 font-semibold text-xl sm:text-2xl h-full flex items-center justify-center border border-gray-100">
              Welcome to User Dashboard
            </div>
          )}
          {activeItem === "resident-request" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <RecordsLandingPage />
            </div>
          )}
          {activeItem === "indigency-request" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <IndigencyRequest />
            </div>
          )}
          {activeItem === "corrections" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <UserCorrectionForm />
            </div>
          )}
          {activeItem === "correction-history" && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100">
              <UserCorrectionHistory />
            </div>
          )}
        </main>
      </div>

      {/* Bottom Navigation for Mobile Devices */}
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
        <button
          onClick={() => setIsMobileMenuOpen(true)}
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