import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus, Sparkles } from "lucide-react";

const EntryPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 font-sans text-gray-800">
      {/* Background circles */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-200/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating dots animation - Increased to 100 dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map(
          (
            _,
            i // Changed from 15 to 100 dots
          ) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-gray-300/30 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`, // Ensures coverage of 100vh
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random()}s`,
                // Added a small random size variation for visual interest
                transform: `scale(${0.5 + Math.random() * 1.5})`,
              }}
            ></div>
          )
        )}
      </div>

      {/* Navbar */}
      <nav className="relative z-20 w-full bg-white/70 backdrop-blur-md shadow-lg rounded-b-xl py-4 px-6 md:px-12 flex justify-between items-center animate-fade-in-down">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-6 h-6 text-teal-600" />
          <span className="text-xl font-bold text-gray-800">My App</span>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/login"
            className="flex items-center px-4 py-2 rounded-lg text-teal-600 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 font-medium"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Login
          </Link>
          <Link
            to="/register"
            className="flex items-center px-4 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow text-center px-4 py-16 md:py-24">
        <div className="max-w-3xl animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Welcome to Your{" "}
            <span className="text-teal-600">Records Management</span> System
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Efficiently manage your data with our secure and intuitive platform.
            Sign in or register to get started!
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl shadow-lg
                         bg-gradient-to-r from-teal-500 to-indigo-600 text-white
                         hover:from-teal-600 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Get Started
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl shadow-md
                         bg-white text-gray-800 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              <UserPlus className="w-5 h-5 mr-3" />
              Join Now
            </Link>
          </div>
        </div>
      </main>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
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

        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          animation-delay: 0.2s; /* Delay for hero content */
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default EntryPage;
