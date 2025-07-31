import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Building,
  CheckCircle,
  Shield,
  Globe,
  PhoneCall,
} from "lucide-react";

const LandingPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();

  const menuItems = [
    { id: "home", icon: Home, label: "Dashboard", active: true },
    { id: "services", icon: Building, label: "LGU Services" },
    { id: "statistics", icon: BarChart3, label: "Community Stats" },
    { id: "residents", icon: Users, label: "Resident Records" },
    { id: "settings", icon: Settings, label: "Admin Settings" },
  ];

  const bottomMenuItems = [
    { id: "support", icon: HelpCircle, label: "Help Desk" },
    { id: "logout", icon: LogOut, label: "Log Out" },
  ];

  const features = [
    {
      icon: CheckCircle,
      title: "Efficient Public Service",
      description:
        "Delivering fast, responsive, and transparent services to all constituents.",
    },
    {
      icon: Shield,
      title: "Secure Citizen Data",
      description:
        "Advanced protection for resident records and government data.",
    },
    {
      icon: Globe,
      title: "Connected Communities",
      description:
        "Linking barangays and agencies for better coordination and outreach.",
    },
    {
      icon: PhoneCall,
      title: "24/7 Support Access",
      description:
        "Accessible help desk and emergency support anytime, anywhere.",
    },
  ];

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userStatus");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              LGU Portal
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 group-hover:scale-110 transition-transform ${
                    isActive ? "text-white" : "text-gray-400"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          {bottomMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={
                  item.id === "logout"
                    ? handleLogout
                    : () => setActiveSection(item.id)
                }
                className="w-full flex items-center space-x-3 px-4 py-3 text-left text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
              >
                <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JKB</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Jade Kevin Balocos
              </p>
              <p className="text-xs text-gray-500 truncate">jade@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent backdrop-blur-sm bg-opacity-25 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome to the LGU Portal
                </h1>
                <p className="text-gray-600">
                  Empowering governance with digital tools.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Citizen's Charter
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-lg hover:from-teal-700 hover:to-cyan-700 shadow-lg">
                Register Service
              </button>
            </div>
          </div>
        </header>

        <main className="p-6">
          <div className="text-center mb-16 py-12">
            <div className="inline-flex items-center space-x-2 bg-cyan-100 text-cyan-800 px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium">
                New: The Online LGU System
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Digital Governance for
              <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent block">
                Every Community
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline citizen services, manage records, and enhance
              transparency all in one centralized LGU system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 shadow-lg hover:shadow-xl transform hover:scale-105">
                <span className="font-semibold">Request Service</span>
              </button>
              <button className="flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg">
                <span className="font-semibold">Watch Overview</span>
              </button>
            </div>
          </div>

          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Key Features
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Empower your LGU with tools that boost service delivery and
                build trust with your community.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="p-6 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-transform hover:scale-105 group"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;
