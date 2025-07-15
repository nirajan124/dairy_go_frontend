import React, { useEffect, useState } from "react";
import { FaBars, FaHeart, FaTimes, FaLeaf } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get token from local storage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode token (if needed) and set user
        const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        setUser(decodedUser);
      } catch (error) {
        console.error("Invalid token");
        localStorage.removeItem("token"); // Remove if invalid
      }
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.reload();
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              <FaLeaf className="text-white text-2xl" />
            </div>
            <span className="text-2xl font-bold text-blue-800 dairy-heading">Dairy Go</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">Home</Link>
          <Link to="/products" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">Products</Link>
          <Link to="/review" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">Reviews</Link>
          {user && (
            <Link to="/mybooking" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">My Orders</Link>
          )}
          <Link to="/contact" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">Contact</Link>
          <Link to="/aboutus" className="text-gray-700 hover:text-blue-500 transition duration-300 dairy-text">About Us</Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/favorite" className="relative text-gray-700 hover:text-blue-500 transition duration-300">
            <FaHeart size={22} />
            {/* <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span> */}
          </Link>

          {/* If user is logged in */}
          {user ? (
            <div className="flex space-x-4">
              <Link to="/myprofile" className="dairy-btn bg-blue-800 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">My Account</Link>
              <button onClick={handleLogout} className="dairy-btn bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-500">
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex space-x-3">
              <Link to="/login" className="dairy-btn bg-blue-800 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Login</Link>
              <Link to="/register" className="dairy-btn bg-blue-800 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700">Sign Up</Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-700 dairy-focus" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md absolute top-full left-0 w-full py-4 dairy-fade-in">
          <Link to="/" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">Home</Link>
          <Link to="/products" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">Products</Link>
          <Link to="/review" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">Reviews</Link>
          {user && (
            <Link to="/mybooking" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">My Orders</Link>
          )}
          <Link to="/contact" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">Contact</Link>
          <Link to="/aboutus" className="block px-6 py-2 text-gray-700 hover:bg-gray-100 transition duration-200">About Us</Link>

          {user ? (
            <>
              <Link to="/profile" className="block dairy-btn bg-blue-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-blue-700">My Account</Link>
              <button onClick={handleLogout} className="block w-full text-center dairy-btn bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-500">
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block dairy-btn bg-blue-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-blue-700">Login</Link>
              <Link to="/register" className="block dairy-btn bg-blue-800 text-white text-center px-6 py-2 rounded-md text-sm hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
