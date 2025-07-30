import React, { useState } from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Navbar from "../../components/common/customer/Navbar";
import { useEffect } from "react";
import axios from "axios";

const Review = () => {
  const [products, setProducts] = useState([]);

  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Samman Basnet",
      rating: 5,
      comment: "Amazing experience! Product and taste was good.",
    },
    {
      id: 2,
      name: "Nirajan Bhattarai",
      rating: 4.5,
      comment: "Great service and well-organized product. Highly recommended!",
    },
  ]);

  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    comment: "",
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
        const res = await axios.get("/api/v1/products");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(placeholderProducts);
        }
      } catch (err) {
        setProducts(placeholderProducts);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.name && newReview.rating && newReview.comment && newReview.packageId) {
      try {
        await axios.post("/api/v1/reviews", {
          rating: newReview.rating,
          comment: newReview.comment,
          packageId: newReview.packageId,
          name: newReview.name
        });
        alert("Review submitted! Awaiting admin approval.");
        setNewReview({ name: "", rating: 0, comment: "", packageId: "" });
      } catch (err) {
        alert("Failed to submit review. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Customer Reviews</h1>
        <p className="text-lg text-center text-gray-600 mb-12">
          See what our trekkers say about their experiences in Nepal!
        </p>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-800">{review.name}</h3>
              <div className="flex items-center my-2">
                {Array.from({ length: 5 }, (_, index) => {
                  if (index + 1 <= review.rating) {
                    return <FaStar key={index} className="text-yellow-500 text-lg" />;
                  } else if (index + 0.5 === review.rating) {
                    return <FaStarHalfAlt key={index} className="text-yellow-500 text-lg" />;
                  } else {
                    return <FaRegStar key={index} className="text-gray-400 text-lg" />;
                  }
                })}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Review Form */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Leave a Review</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-800 font-semibold">Package</label>
              <select
                name="packageId"
                value={newReview.packageId}
                onChange={(e) => setNewReview({ ...newReview, packageId: e.target.value })}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
                required
              >
                <option value="">Select a Package</option>
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
