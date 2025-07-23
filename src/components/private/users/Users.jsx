import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                    <button className="text-red-500 hover:text-red-700 mr-2" onClick={() => alert(`View user details for ${user.fname || user.name}`)}>
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
    </div>
  );
};

export default Users;
