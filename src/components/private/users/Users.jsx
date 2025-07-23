import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/v1/auth/getAllCustomers", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data.data || res.data || []);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const closeModal = () => setSelectedUser(null);

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
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === "Active" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}>
                      {user.status || (user.isActive ? "Active" : "Inactive")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <button className="text-blue-500 hover:text-blue-700 mr-2" onClick={() => setSelectedUser(user)}>
                      View
                    </button>
                    {user.status === "Active" && (
                      <button className="text-yellow-500 hover:text-yellow-700" onClick={() => alert(`Deactivate user ${user.fname || user.name}`)}>
                        Deactivate
                      </button>
                    )}
                    {user.status === "Inactive" && (
                      <button className="text-green-500 hover:text-green-700" onClick={() => alert(`Activate user ${user.fname || user.name}`)}>
                        Activate
                      </button>
                    )}
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
