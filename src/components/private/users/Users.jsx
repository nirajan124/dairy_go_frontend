import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        
        // Get current user info from token
        if (token) {
          try {
            const currentUserRes = await axios.get("http://localhost:3001/api/v1/customers/getCurrentUser", {
              headers: { Authorization: `Bearer ${token}` }
            });
            setCurrentUserId(currentUserRes.data.data?._id || currentUserRes.data._id);
            console.log("Current user ID:", currentUserRes.data.data?._id || currentUserRes.data._id);
          } catch (err) {
            console.log("Could not get current user info:", err.message);
          }
        }
        
        const res = await axios.get("http://localhost:3001/api/v1/customers/getAllCustomers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data || res.data || []);
        // Debug: log all customer users and their _id
        const usersList = res.data.data || res.data || [];
        console.log("Customer users and their _id:", usersList.filter(u => u.role === "customer").map(u => ({_id: u._id, email: u.email, name: u.fname})));
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const closeModal = () => setSelectedUser(null);

  const handleActivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to activate this user?")) return;
    try {
      console.log("Activating user with ID:", userId);
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:3001/api/v1/customers/activateCustomer/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Activate response:", response.data);
      
      // Update the user status in the local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, status: "Active", isActive: true }
          : user
      ));
      alert("✅ User activated successfully.");
    } catch (err) {
      console.error("Error activating user:", err);
      alert(`❌ Failed to activate user: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDeactivateUser = async (userId) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      console.log("Deactivating user with ID:", userId);
      const token = localStorage.getItem("token");
      const response = await axios.put(`http://localhost:3001/api/v1/customers/deactivateCustomer/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Deactivate response:", response.data);
      
      // Update the user status in the local state
      setUsers(users.map(user => 
        user._id === userId 
          ? { ...user, status: "Inactive", isActive: false }
          : user
      ));
      alert("✅ User deactivated successfully.");
    } catch (err) {
      console.error("Error deactivating user:", err);
      alert(`❌ Failed to deactivate user: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      console.log("Deleting user with ID:", userId);
      const token = localStorage.getItem("token");
      const response = await axios.delete(`http://localhost:3001/api/v1/customers/deleteCustomer/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Delete response:", response.data);
      setUsers(users.filter(u => u._id !== userId));
      alert("✅ User deleted successfully.");
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(`❌ Failed to delete user: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Users</h2>
      {loading ? (
        <div className="text-center py-10"><div className="dairy-spinner mx-auto"></div></div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id || user.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-700">{user.fname || user.name} {user.lname || ""}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user._id === currentUserId
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {user._id === currentUserId ? "Active (You)" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-500 hover:text-blue-700" 
                        onClick={() => setSelectedUser(user)}
                        title="View User Details"
                      >
                        View
                      </button>
                      
                      {user._id !== currentUserId && (
                        user.status === "Active" || user.isActive ? (
                          <button 
                            className="text-yellow-500 hover:text-yellow-700" 
                            onClick={() => handleDeactivateUser(user._id)}
                            title="Deactivate User"
                          >
                            Deactivate
                          </button>
                        ) : (
                          <button 
                            className="text-green-500 hover:text-green-700" 
                            onClick={() => handleActivateUser(user._id)}
                            title="Activate User"
                          >
                            Activate
                          </button>
                        )
                      )}
                      
                      {user.role === "customer" && user._id !== currentUserId && (
                        <button 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDelete(user._id)} 
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md relative">
            <button onClick={closeModal} className="absolute top-3 right-3 text-2xl text-gray-400 hover:text-gray-700 focus:outline-none" aria-label="Close">&times;</button>
            <h3 className="text-2xl font-bold mb-4 text-blue-700">User Details</h3>
            <div className="space-y-2">
              <div><span className="font-semibold text-gray-700">Name:</span> {selectedUser.fname || selectedUser.name} {selectedUser.lname || ""}</div>
              <div><span className="font-semibold text-gray-700">Email:</span> {selectedUser.email}</div>
              <div><span className="font-semibold text-gray-700">Role:</span> {selectedUser.role}</div>
              <div><span className="font-semibold text-gray-700">Status:</span> {selectedUser.status || (selectedUser.isActive ? "Active" : "Inactive")}</div>
              {selectedUser.phone && <div><span className="font-semibold text-gray-700">Phone:</span> {selectedUser.phone}</div>}
              {selectedUser.address && <div><span className="font-semibold text-gray-700">Address:</span> {selectedUser.address}</div>}
              {/* Add more fields as needed */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
