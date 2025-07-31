import React, { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import { useEffect } from "react";
import axios from "axios";

const Review = () => {
  const [products, setProducts] = useState([]);

  const [reviews, setReviews] = useState([]);

  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
    packageId: "",
  });

  const placeholderProducts = [
    { _id: "1", name: "Fresh Whole Milk" },
    { _id: "2", name: "Organic Greek Yogurt" },
    { _id: "3", name: "Aged Cheddar Cheese" },
    { _id: "4", name: "Fresh Butter" },
    { _id: "5", name: "Homemade Paneer" },
    { _id: "6", name: "Fresh Cream" },
    { _id: "7", name: "Skimmed Milk" },
    { _id: "8", name: "Probiotic Buttermilk" },
    { _id: "9", name: "Mozzarella Cheese" }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/products");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(placeholderProducts);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts(placeholderProducts);
      }
    };

    const fetchApprovedReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/reviews?status=Approved");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    fetchProducts();
    fetchApprovedReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.rating && newReview.comment && newReview.packageId) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Please login to submit a review.");
          return;
        }

        await axios.post("http://localhost:3001/api/v1/reviews", {
          rating: newReview.rating.toString(),
          comment: newReview.comment,
          packageId: newReview.packageId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        alert("Review submitted! Awaiting admin approval.");
        setNewReview({ rating: 0, comment: "", packageId: "" });
      } catch (err) {
        console.error("Error submitting review:", err);
        alert("Failed to submit review. Please try again.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Customer Reviews</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          See what our customers say about our fresh dairy products!
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600 text-lg">No approved reviews yet. Be the first to leave a review!</p>
            </div>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800">
                  {review.customerId?.fname || review.customerId?.name || review.name || "Anonymous"}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {review.packageId?.name || "Product"}
                </p>
                <div className="flex items-center my-2">
                  {Array.from({ length: 5 }, (_, index) => {
                    const rating = parseInt(review.rating);
                    if (index + 1 <= rating) {
                      return <FaStar key={index} className="text-yellow-500 text-lg" />;
                    } else {
                      return <FaRegStar key={index} className="text-gray-400 text-lg" />;
                    }
                  })}
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Review Form */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold">Product</label>
              <select
                name="packageId"
                value={newReview.packageId}
                onChange={(e) => setNewReview({ ...newReview, packageId: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="">Select a Product</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold">Rating</label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="">Select a Rating</option>
                {[1, 2, 3, 4, 5].map((star) => (
                  <option key={star} value={star}>
                    {star} Star{star > 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-800 font-semibold">Comment</label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows="4"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-red-800 text-white py-2 px-6 rounded-md hover:bg-red-700 transition duration-300"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Review;
