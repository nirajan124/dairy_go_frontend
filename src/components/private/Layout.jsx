import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../common/admin/Sidebar";
import Navbar from "../common/admin/Navbar";

const Layout = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Load dark mode setting from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("adminSettings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode || false);
    }
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

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
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className={`p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
