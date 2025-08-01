import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, FaCamera, FaEye, FaEyeSlash, FaClock, FaCalendar, FaSignInAlt, FaUserPlus, FaShoppingBag, FaHeart, FaStar } from "react-icons/fa";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";

const Myprofile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    address: ""
  });

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        // Try to get user data from localStorage first as fallback
        const storedUserData = {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "customer@example.com",
          username: localStorage.getItem("userName") || "customer",
          phone: localStorage.getItem("userPhone") || "",
          address: localStorage.getItem("userAddress") || "",
          image: ""
        };

        if (!userId) {
          console.error("User ID not found in local storage");
          setUser(storedUserData);
          setFormData({
            username: storedUserData.username,
            email: storedUserData.email,
            fullName: storedUserData.name,
            phone: storedUserData.phone,
            address: storedUserData.address
          });
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/v1/customers/getCustomer/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data.data || response.data;
        console.log("Fetched user data:", userData); // Debug log
        console.log("User image field:", userData.image); // Debug image field
        
        setUser(userData);
        
        // Ensure all fields are properly mapped
        const updatedFormData = {
          username: userData.username || userData.name || storedUserData.username,
          email: userData.email || storedUserData.email,
          fullName: userData.name || userData.fullName || userData.fname || storedUserData.name,
          phone: userData.phone || storedUserData.phone,
          address: userData.address || storedUserData.address
        };
        
        console.log("Setting form data:", updatedFormData); // Debug log
        setFormData(updatedFormData);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching user profile:", error);
        
        // Use localStorage data as fallback
        const fallbackData = {
          name: localStorage.getItem("userName") || "Customer",
          email: localStorage.getItem("userEmail") || "customer@example.com",
          username: localStorage.getItem("userName") || "customer",
          phone: localStorage.getItem("userPhone") || "",
          address: localStorage.getItem("userAddress") || "",
          image: ""
        };
        
        setUser(fallbackData);
        setFormData({
          username: fallbackData.username,
          email: fallbackData.email,
          fullName: fallbackData.name,
          phone: fallbackData.phone,
          address: fallbackData.address
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const formDataToSend = new FormData();
      
      // Add file if selected - use 'profilePicture' to match backend
      if (file) {
        formDataToSend.append("profilePicture", file);
      }
      
      // Add other form data
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const res = await axios.put(`http://localhost:3001/api/v1/customers/updateCustomer/${userId}`, formDataToSend, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      // Update user state with the response data
      const updatedUser = res.data.data || res.data;
      console.log("Profile update response:", res.data); // Debug response
      console.log("Updated user data:", updatedUser); // Debug updated user
      setUser(updatedUser);
      
      // Clear the file and preview
      setFile(null);
      setPreviewUrl(null);
      
      setIsEditing(false);
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert(`❌ Failed to update profile: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("❌ New passwords do not match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("❌ New password must be at least 6 characters long!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      
      const res = await axios.put(`http://localhost:3001/api/v1/customers/changePassword/${userId}`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      setIsChangingPassword(false);
      alert("✅ Password changed successfully!");
    } catch (err) {
      console.error("Error changing password:", err);
      alert(`❌ Failed to change password: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setFile(null);
    setPreviewUrl(null);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="dairy-spinner mx-auto mb-4"></div>
            <p className="text-gray-600 dairy-text">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-blue-800 dairy-heading">Your Profile</h1>
              <p className="text-gray-600 dairy-text">Last updated: {lastUpdate.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="font-medium">Refresh</span>
              </button>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Live Data</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture Section */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
                      {user?.image ? (
                        (() => {
                          const imageUrl = previewUrl || `http://localhost:3001/uploads/${user.image}`;
                          console.log("Image URL:", imageUrl); // Debug image URL
                          return (
                            <img 
                              src={imageUrl} 
                              alt="Profile" 
                              className="w-32 h-32 rounded-full object-cover"
                              onError={(e) => {
                                console.error("Image failed to load:", imageUrl);
                                e.target.style.display = 'none';
                              }}
                            />
                          );
                        })()
                      ) : (
                        <FaUser size={48} />
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                        <FaCamera size={16} />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dairy-heading">{user?.name || user?.fullName || "Customer"}</h3>
                  <p className="text-gray-600 dairy-text">Customer</p>
                  <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Profile Details Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Profile Information</h3>
                    <div className="flex space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={handleSaveProfile}
                            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <FaSave size={16} />
                            <span>Save</span>
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                          >
                            <FaTimes size={16} />
                            <span>Cancel</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <FaEdit size={16} />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`w-full px-3 py-2 border rounded-lg ${
                          isEditing 
                            ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                            : "border-gray-200 bg-gray-50"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={3}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? "border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200" 
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Account Information</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-50 rounded-full">
                        <FaUser className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Type</p>
                        <p className="font-semibold text-gray-800">Customer</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-50 rounded-full">
                        <FaSignInAlt className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-50 rounded-full">
                        <FaUserPlus className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-semibold text-gray-800">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-50 rounded-full">
                        <FaClock className="text-orange-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Session Active</p>
                        <p className="font-semibold text-gray-800">Online</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-blue-800 dairy-heading">Change Password</h3>
                    <button
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <FaEye size={16} />
                      <span>{isChangingPassword ? "Cancel" : "Change Password"}</span>
                    </button>
                  </div>
                </div>

                {isChangingPassword && (
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleChangePassword}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Myprofile;
