import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCheck, FaTrash } from "react-icons/fa";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/reviews");
        setReviews(res.data);
      } catch (err) {
        setReviews([]);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Customer Reviews</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Package</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Review</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{review.customerId?.fname || review.customerId?.name || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.packageId?.name || review.packageId?.title || "Unknown"}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  {Array.from({ length: Number(review.rating) }, (_, index) => (
                    <span key={index} className="text-yellow-500">&#9733;</span>
                  ))}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{review.comment}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => alert(`Delete review ${review._id}`)}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reviews;
