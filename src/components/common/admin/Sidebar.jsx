import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaBox, FaCalendar, FaCreditCard, FaUsers, FaStar, FaComments, FaCog, FaSignOutAlt, FaChevronDown, FaChevronRight } from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    products: true,
    orders: true
  });

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

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin",
      icon: FaHome
    },
    {
      title: "Dairy Products",
      icon: FaBox,
      subItems: [
        { title: "Add New", path: "/admin/addproduct" },
        { title: "Manage Products", path: "/admin/manageproducts" }
      ]
    },
    {
      title: "Orders",
      icon: FaCalendar,
      subItems: [
        { title: "Cancelled", path: "/admin/cancelled" },
        { title: "Pending", path: "/admin/pending" }
      ]
    },
    {
      title: "Payments",
      path: "/admin/payments",
      icon: FaCreditCard
    },
    {
      title: "Customers",
      path: "/admin/users",
      icon: FaUsers
    },
    {
      title: "Customer Reviews",
      path: "/admin/reviews",
      icon: FaStar
    },
    {
      title: "Customer Messages",
      path: "/admin/messages",
      icon: FaComments
    },
    {
      title: "Settings",
      path: "/admin/settings",
      icon: FaCog
    }
  ];

  return (
    <div className={`w-64 min-h-screen ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transition-colors duration-300`}>
      {/* Logo */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DG</span>
          </div>
          <span className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}>Dairy Go</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.title.toLowerCase().replace(/\s+/g, ''))}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-700 text-gray-300' 
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </div>
                    {expandedSections[item.title.toLowerCase().replace(/\s+/g, '')] ? (
                      <FaChevronDown className="w-4 h-4" />
                    ) : (
                      <FaChevronRight className="w-4 h-4" />
                    )}
                  </button>
                  {expandedSections[item.title.toLowerCase().replace(/\s+/g, '')] && (
                    <ul className="ml-8 mt-2 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className={`block p-2 rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                                : `${darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'}`
                            }`}
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? `${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700'}`
                      : `${darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-700 hover:text-gray-800 hover:bg-gray-100'}`
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className={`absolute bottom-0 w-64 p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/";
          }}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            darkMode 
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900' 
              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
          }`}
        >
          <FaSignOutAlt className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
