import React, { useState, useEffect } from "react";
import { FaBell, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load dark mode setting from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode || false);
    }
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedSettings = localStorage.getItem("adminSettings");
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setDarkMode(settings.darkMode || false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <nav className={`px-6 py-4 shadow-sm ${darkMode ? 'bg-gray-800 border-b border-gray-700' : 'bg-white border-b border-gray-200'}`}>
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Admin Dashboard
          </h1>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            darkMode 
              ? 'bg-blue-600 text-white' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            Admin Panel
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className={`p-2 rounded-lg transition-colors ${
              darkMode 
                ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
            }`}>
              <FaBell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                darkMode ? 'bg-gray-600' : 'bg-gray-200'
              }`}>
                <FaUser className="w-4 h-4" />
              </div>
              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Admin</span>
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-50 ${
                darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
              }`}>
                <button
                  onClick={() => {
                    // Navigate to profile
                    setShowDropdown(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <FaUser className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => {
                    // Navigate to settings
                    setShowDropdown(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                    darkMode 
                      ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                      : 'text-gray-700 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <FaCog className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <hr className={`my-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    window.location.href = "/";
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors ${
                    darkMode 
                      ? 'text-red-400 hover:text-red-300 hover:bg-red-900' 
                      : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                  }`}
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
