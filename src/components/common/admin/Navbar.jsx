import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProfile = () => { setDropdownOpen(false); navigate("/admin/profile"); };
  const handleSettings = () => { setDropdownOpen(false); navigate("/admin/settings"); };
  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      {/* Admin Panel Title */}
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Notifications Icon */}
        <button className="relative p-2 rounded-full hover:bg-gray-800">
          <Bell size={20} />
          <span className="absolute top-0 right-0 bg-red-500 text-xs text-white px-1.5 py-0.5 rounded-full">3</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-800"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <User size={20} />
            <span className="hidden md:inline">Admin</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-50">
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-700" onClick={handleProfile}>Profile</button>
              <button className="block w-full px-4 py-2 text-left hover:bg-gray-700" onClick={handleSettings}>Settings</button>
              <button className="block w-full px-4 py-2 text-left hover:bg-red-700 flex items-center gap-2" onClick={handleLogout}>
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
