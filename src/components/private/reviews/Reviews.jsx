import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTrash } from "react-icons/fa";

const statusOptions = ["All", "Pending", "Approved", "Rejected"];

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchReviews = async (status) => {
    try {
      setLoading(true);
      let url = "http://localhost:3001/api/v1/reviews";
      if (status && status !== "All") url += `?status=${status}`;
      console.log("Fetching reviews from:", url);
      const res = await axios.get(url);
      console.log("Reviews API response:", res.data);
      // Ensure reviews is always an array
      setReviews(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(status);
  }, [status]);

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/v1/reviews/${id}/approve`);
      fetchReviews(status);
    } catch (err) {
      console.error("Error approving review:", err);
      alert("Failed to approve review.");
    }
  };
  
  const handleReject = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/v1/reviews/${id}/reject`);
      fetchReviews(status);
    } catch (err) {
      console.error("Error rejecting review:", err);
      alert("Failed to reject review.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review? This action cannot be undone.")) return;
    try {
      console.log("Deleting review with ID:", id);
      const response = await axios.delete(`http://localhost:3001/api/v1/reviews/${id}`);
      console.log("Delete response:", response.data);
      alert("✅ Review deleted successfully.");
      fetchReviews(status);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert(`❌ Failed to delete review: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>
      <div className="mb-4 flex items-center gap-4">
        <div>
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border p-2 rounded">
            {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        <button 
          onClick={() => fetchReviews(status)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No reviews found.</p>
          <p className="text-sm text-gray-500 mt-2">Current filter: {status}</p>
          <p className="text-sm text-gray-500">Total reviews: {reviews.length}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Review</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{review.customerId?.fname || review.customerId?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.customerId?.email || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {review.packageId?.name || review.packageId?.title || review.name || "Unknown"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {Array.from({ length: Number(review.rating) }, (_, index) => (
                    <span key={index} className="text-yellow-500">&#9733;</span>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.comment}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.date ? new Date(review.date).toLocaleDateString() : ""}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    review.status === "Approved"
                      ? "bg-green-100 text-green-800"
                      : review.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {review.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div className="flex space-x-2">
                    {review.status === "Pending" && (
                      <>
                        <button
                          className="text-green-500 hover:text-green-700"
                          onClick={() => handleApprove(review._id)}
                          title="Approve Review"
                        >
                          <FaCheck /> Approve
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleReject(review._id)}
                          title="Reject Review"
                        >
                          <FaTrash /> Reject
                        </button>
                      </>
                    )}
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(review._id)}
                      title="Delete Review"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
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

export default Reviews;
