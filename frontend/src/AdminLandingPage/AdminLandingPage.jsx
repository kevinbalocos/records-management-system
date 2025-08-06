import { useState, useEffect } from "react";
import AdminAndSuperAdminUserApproval from "../authentication/Admin-SuperAdminUserApproval"; // Assuming these paths are correct
import AdminDashboard from "../AdminLandingPage/AdminDashboard"; // Assuming these paths are correct
import RecordsRequest from "./AdminRecordsRequest"; // Assuming these paths are correct
import IndigencyAdmin from "./IndigencyAdmin"; // Assuming these paths are correct
import AdminCorrectionList from "./AdminCorrectionList"; // Assuming these paths are correct
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
  Sun, // For theme toggle
  Moon, // For theme toggle
  Menu, // Hamburger icon for mobile
  Activity, // For loading spinner in splash
} from "lucide-react";

// Custom CSS for glassmorphism and animations (Tailwind doesn't directly support backdrop-filter)
// This style block will be injected into the document head when the component mounts.
const customStyles = `
  .glass-sidebar {
    background-color: rgba(255, 255, 255, 0.05); /* Very subtle white for light mode glass */
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .dark .glass-sidebar {
    background-color: rgba(0, 0, 0, 0.1); /* Very subtle black for dark mode glass */
    border: 1px solid rgba(255, 255, 255, 0.05);
  }

  .glass-topbar {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .dark .glass-topbar {
    background-color: rgba(20, 20, 20, 0.7);
  }

  .animate-slide-in-right {
    animation: slideInRight 0.3s ease-out forwards;
  }
  .animate-slide-out-right {
    animation: slideOutRight 0.3s ease-out forwards;
  }
  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  @keyframes slideOutRight {
    from { transform: translateX(0); }
    to { transform: translateX(100%); }
  }

  /* Custom active item glow effect */
  .nav-item-active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px; /* Width of the glowing bar */
    height: 80%; /* Height of the glowing bar */
    background: linear-gradient(to bottom, #20c997, #17a2b8); /* Teal to Cyan gradient */
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(32, 201, 151, 0.8), 0 0 16px rgba(23, 162, 184, 0.6); /* Soft glow */
    transition: all 0.3s ease-out;
  }
  .nav-item-active:hover::before {
    height: 100%; /* Expand on hover */
  }
`;

// Loading Splash Screen Component
const LoadingSplash = ({ isVisible, isDarkMode }) => {
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
          className={`text-3xl font-bold uppercase tracking-widest ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Initializing Admin Dashboard Systems
        </h2>

        <p
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Please hold on while we prepare your personalized admin dashboard.
          <br />
          We’re fetching the latest data and loading all necessary modules.
          <br />
          Everything will be ready shortly for you to manage your records
          efficiently.
        </p>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState(() => {
    const savedItem = localStorage.getItem("adminActiveMenuItem");
    return savedItem || "dashboard";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [showSplash, setShowSplash] = useState(true); // State for splash screen
  const navigate = useNavigate();

  // Inject custom styles into the document head
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Sync active item with localStorage
  useEffect(() => {
    localStorage.setItem("adminActiveMenuItem", activeItem);
  }, [activeItem]);

  // Sync theme with localStorage and apply/remove 'dark' class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // Control splash screen visibility
  useEffect(() => {
    const minSplashTime = 1500; // Minimum time for splash screen in ms
    const startTime = Date.now();

    // Simulate initial loading, replace with actual data fetching if needed
    // For now, it just waits for a minimum time.
    const timer = setTimeout(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minSplashTime - elapsedTime;

      if (remainingTime > 0) {
        setTimeout(() => setShowSplash(false), remainingTime);
      } else {
        setShowSplash(false);
      }
    }, 100); // A small initial delay before starting the splash timer

    return () => clearTimeout(timer);
  }, []); // Run only once on mount

  // Group menu items into sections
  const menuSections = [
    {
      title: "Main",
      items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      title: "Requests",
      items: [
        { id: "approve", label: "User Approval", icon: CheckCircle },
        {
          id: "records-request",
          label: "Records Request",
          icon: ClipboardList,
        },
        { id: "indigency", label: "Indigency Request", icon: ClipboardList },
        { id: "correction", label: "Correction Request", icon: ClipboardList },
      ],
    },
    // Add more sections as needed
    {
      title: "Settings",
      items: [
        // Example for future settings
        // { id: "profile", label: "Profile", icon: User },
      ],
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  return (
    // Main container. The 'dark' class is applied here for themeing.
    <div
      className={`flex flex-col h-screen overflow-hidden lg:flex-row ${
        isDarkMode
          ? "dark bg-gray-950 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Loading Splash Screen */}
      <LoadingSplash isVisible={showSplash} isDarkMode={isDarkMode} />

      {/* Main Content - hidden during splash */}
      <div
        className={`${
          showSplash ? "hidden" : "flex flex-col flex-1 lg:flex-row"
        }`}
      >
        {/* Sidebar for Larger Screens (lg and up) */}
        <div
          className={`${
            isCollapsed ? "lg:w-20" : "lg:w-72"
          } hidden lg:flex glass-sidebar shadow-xl transition-all duration-300 flex-col relative z-20 border-r ${
            isDarkMode ? "border-gray-800" : "border-gray-100"
          } flex-shrink-0`}
        >
          {/* Header */}
          <div
            className={`p-5 border-b ${
              isDarkMode ? "border-gray-800" : "border-gray-100"
            } flex items-center justify-between flex-shrink-0`}
          >
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-md">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <span
                  className={`font-extrabold ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } text-xl tracking-wide`}
                >
                  AdminHub
                </span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-2 rounded-full hover:bg-gray-700/30 transition-colors duration-200 focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "focus:ring-teal-700 text-gray-400 hover:text-white"
                  : "focus:ring-teal-200 text-gray-600 hover:text-gray-800"
              }`}
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
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto custom-scrollbar">
            {menuSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {!isCollapsed && (
                  <h3
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    } mb-2 px-4`}
                  >
                    {section.title}
                  </h3>
                )}
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeItem === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveItem(item.id)}
                        className={`relative w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                          ${
                            isActive
                              ? `${
                                  isDarkMode
                                    ? "bg-teal-600/20 text-teal-200"
                                    : "bg-teal-100 text-teal-800"
                                } font-semibold nav-item-active`
                              : `${
                                  isDarkMode
                                    ? "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                }`
                          }
                          ${isCollapsed ? "justify-center" : "space-x-4"}
                        `}
                        title={isCollapsed ? item.label : ""} // Tooltip for collapsed state
                      >
                        <Icon
                          className={`w-6 h-6 flex-shrink-0 ${
                            isActive
                              ? `${
                                  isDarkMode ? "text-teal-400" : "text-teal-700"
                                }`
                              : `${
                                  isDarkMode
                                    ? "text-gray-400 group-hover:text-teal-300"
                                    : "text-gray-500 group-hover:text-teal-600"
                                }`
                          }`}
                        />
                        {!isCollapsed && (
                          <span className="text-lg whitespace-nowrap overflow-hidden transition-opacity duration-300">
                            {item.label}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile and Theme Toggle */}
          <div
            className={`p-5 border-t ${
              isDarkMode ? "border-gray-800" : "border-gray-100"
            } flex-shrink-0`}
          >
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } mb-3`}
            >
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p
                    className={`text-lg font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } truncate`}
                  >
                    Jade Kevin B. Calalo
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-gray-400" : "text-gray-500"
                    } truncate`}
                  >
                    Administrator
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full mt-2 flex items-center ${
                isCollapsed ? "justify-center" : "justify-start space-x-2"
              } px-3 py-2.5 text-base rounded-lg transition-colors duration-200 group
                ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
              title={
                isCollapsed
                  ? isDarkMode
                    ? "Switch to Light Mode"
                    : "Switch to Dark Mode"
                  : ""
              }
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 group-hover:text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 group-hover:text-indigo-600" />
              )}
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden">
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full mt-2 flex items-center ${
                isCollapsed ? "justify-center" : "justify-start space-x-2"
              } px-3 py-2.5 text-base rounded-lg transition-colors duration-200 group
                ${
                  isDarkMode
                    ? "text-gray-300 hover:bg-red-700/30 hover:text-red-300"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
              title={isCollapsed ? "Sign Out" : ""}
            >
              <LogOut
                className={`w-5 h-5 ${
                  isDarkMode
                    ? "group-hover:text-red-400"
                    : "group-hover:text-red-600"
                }`}
              />
              {!isCollapsed && (
                <span className="font-medium whitespace-nowrap overflow-hidden">
                  Sign Out
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 flex flex-col ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          } overflow-hidden`}
        >
          {/* Top Bar for Mobile (with menu button) */}
          <div
            className={`glass-topbar p-4 flex items-center justify-between border-b ${
              isDarkMode ? "border-gray-800" : "border-gray-100"
            } lg:hidden shadow-md z-10`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-teal-600 rounded-lg flex items-center justify-center shadow-md">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <span
                className={`font-extrabold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                } text-xl tracking-wide`}
              >
                AdminHub
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className={`p-2 rounded-full hover:bg-gray-700/30 transition-colors duration-200 focus:outline-none focus:ring-2 ${
                isDarkMode
                  ? "focus:ring-teal-700 text-gray-400 hover:text-white"
                  : "focus:ring-teal-200 text-gray-600 hover:text-gray-800"
              }`}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Overlay Menu (Off-canvas drawer) */}
          {isMobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <div
                className={`absolute top-0 right-0 w-64 h-full glass-sidebar shadow-xl p-4 flex flex-col ${
                  isMobileMenuOpen
                    ? "animate-slide-in-right"
                    : "animate-slide-out-right"
                }`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing overlay
              >
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`p-2 rounded-full hover:bg-gray-700/30 transition-colors ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <nav className="flex-1 space-y-4 custom-scrollbar">
                  {menuSections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isDarkMode ? "text-gray-500" : "text-gray-400"
                        } mb-2 px-4`}
                      >
                        {section.title}
                      </h3>
                      <div className="space-y-2">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeItem === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                setActiveItem(item.id);
                                setIsMobileMenuOpen(false); // Close menu on item click
                              }}
                              className={`relative w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 group
                                ${
                                  isActive
                                    ? `${
                                        isDarkMode
                                          ? "bg-teal-600/20 text-teal-200"
                                          : "bg-teal-100 text-teal-800"
                                      } font-semibold nav-item-active`
                                    : `${
                                        isDarkMode
                                          ? "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                      }`
                                }`}
                            >
                              <Icon
                                className={`w-6 h-6 flex-shrink-0 ${
                                  isActive
                                    ? `${
                                        isDarkMode
                                          ? "text-teal-400"
                                          : "text-teal-700"
                                      }`
                                    : `${
                                        isDarkMode
                                          ? "text-gray-400 group-hover:text-teal-300"
                                          : "text-gray-500 group-hover:text-teal-600"
                                      }`
                                }`}
                              />
                              <span className="text-lg">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </nav>
                <div
                  className={`p-4 border-t ${
                    isDarkMode ? "border-gray-800" : "border-gray-100"
                  } mt-4 flex-shrink-0`}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p
                        className={`text-lg font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } truncate`}
                      >
                        John Doe
                      </p>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-500"
                        } truncate`}
                      >
                        Administrator
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className={`w-full mt-2 flex items-center justify-start space-x-2 px-3 py-2.5 text-base rounded-lg transition-colors duration-200 group
                      ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-gray-700/30 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    {isDarkMode ? (
                      <Sun className="w-5 h-5 group-hover:text-yellow-400" />
                    ) : (
                      <Moon className="w-5 h-5 group-hover:text-indigo-600" />
                    )}
                    <span className="font-medium">
                      {isDarkMode ? "Light Mode" : "Dark Mode"}
                    </span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className={`w-full mt-2 flex items-center justify-start space-x-2 px-3 py-2.5 text-base rounded-lg transition-colors duration-200 group
                      ${
                        isDarkMode
                          ? "text-gray-300 hover:bg-red-700/30 hover:text-red-300"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                  >
                    <LogOut
                      className={`w-5 h-5 ${
                        isDarkMode
                          ? "group-hover:text-red-400"
                          : "group-hover:text-red-600"
                      }`}
                    />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page Content Area */}
          <main
            className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${
              isDarkMode ? "bg-gray-900" : "bg-teal-50"
            }`}
          >
            {activeItem === "dashboard" && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                } rounded-xl shadow-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } p-4 sm:p-6 lg:p-8`}
              >
                <AdminDashboard isDarkMode={isDarkMode} />
              </div>
            )}
            {activeItem === "approve" && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                } rounded-xl shadow-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } p-4 sm:p-6 lg:p-8`}
              >
                <AdminAndSuperAdminUserApproval isDarkMode={isDarkMode} />
              </div>
            )}
            {activeItem === "records-request" && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                } rounded-xl shadow-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } p-4 sm:p-6 lg:p-8`}
              >
                <RecordsRequest isDarkMode={isDarkMode} />
              </div>
            )}
            {activeItem === "indigency" && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                } rounded-xl shadow-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } p-4 sm:p-6 lg:p-8`}
              >
                <IndigencyAdmin isDarkMode={isDarkMode} />
              </div>
            )}
            {activeItem === "correction" && (
              <div
                className={`${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                } rounded-xl shadow-lg border ${
                  isDarkMode ? "border-gray-700" : "border-gray-100"
                } p-4 sm:p-6 lg:p-8`}
              >
                <AdminCorrectionList isDarkMode={isDarkMode} />
              </div>
            )}
          </main>
        </div>

        {/* Bottom Navigation for Mobile Devices (hidden on lg and up) */}
        <div
          className={`fixed bottom-0 left-0 right-0 ${
            isDarkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-100"
          } border-t shadow-lg z-30 flex justify-around p-2 lg:hidden`}
        >
          {menuSections
            .flatMap((section) => section.items)
            .slice(0, 4)
            .map((item) => {
              // Display first 4 items for conciseness
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-sm font-medium
                  ${
                    isActive
                      ? `${
                          isDarkMode
                            ? "text-teal-400 bg-teal-900/30"
                            : "text-teal-800 bg-teal-100"
                        }`
                      : `${
                          isDarkMode
                            ? "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                            : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                        }`
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mb-1 ${
                      isActive
                        ? `${isDarkMode ? "text-teal-400" : "text-teal-700"}`
                        : `${
                            isDarkMode
                              ? "text-gray-500 group-hover:text-teal-300"
                              : "text-gray-400"
                          }`
                    }`}
                  />
                  {item.label}
                </button>
              );
            })}
          {/* "More" button to open the full mobile menu */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 text-sm font-medium
                ${
                  isMobileMenuOpen
                    ? `${
                        isDarkMode
                          ? "text-teal-400 bg-teal-900/30"
                          : "text-teal-800 bg-teal-100"
                      }`
                    : `${
                        isDarkMode
                          ? "text-gray-400 hover:bg-gray-700/30 hover:text-white"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                      }`
                }`}
          >
            <Menu
              className={`w-5 h-5 mb-1 ${
                isDarkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            More
          </button>
        </div>
      </div>
    </div>
  );
}
