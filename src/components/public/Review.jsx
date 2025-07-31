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
    { _id: "9", name: "Mozzarella Cheese" },
    { _id: "10", name: "Blue Cheese" },
    { _id: "11", name: "Swiss Cheese" },
    { _id: "12", name: "Feta Cheese" },
    { _id: "13", name: "Cottage Cheese" },
    { _id: "14", name: "Ricotta Cheese" },
    { _id: "15", name: "Gouda Cheese" },
    { _id: "16", name: "Brie Cheese" },
    { _id: "17", name: "Parmesan Cheese" },
    { _id: "18", name: "Provolone Cheese" },
    { _id: "19", name: "Havarti Cheese" },
    { _id: "20", name: "Monterey Jack Cheese" },
    { _id: "21", name: "Colby Cheese" },
    { _id: "22", name: "Pepper Jack Cheese" },
    { _id: "23", name: "String Cheese" },
    { _id: "24", name: "Cream Cheese" },
    { _id: "25", name: "Sour Cream" },
    { _id: "26", name: "Heavy Cream" },
    { _id: "27", name: "Half & Half" },
    { _id: "28", name: "Whipping Cream" },
    { _id: "29", name: "Chocolate Milk" },
    { _id: "30", name: "Strawberry Milk" },
    { _id: "31", name: "Vanilla Milk" },
    { _id: "32", name: "Lactose-Free Milk" },
    { _id: "33", name: "Almond Milk" },
    { _id: "34", name: "Soy Milk" },
    { _id: "35", name: "Oat Milk" },
    { _id: "36", name: "Coconut Milk" },
    { _id: "37", name: "Rice Milk" },
    { _id: "38", name: "Cashew Milk" },
    { _id: "39", name: "Hemp Milk" },
    { _id: "40", name: "Flax Milk" },
    { _id: "41", name: "Plain Yogurt" },
    { _id: "42", name: "Vanilla Yogurt" },
    { _id: "43", name: "Strawberry Yogurt" },
    { _id: "44", name: "Blueberry Yogurt" },
    { _id: "45", name: "Peach Yogurt" },
    { _id: "46", name: "Mango Yogurt" },
    { _id: "47", name: "Pineapple Yogurt" },
    { _id: "48", name: "Mixed Berry Yogurt" },
    { _id: "49", name: "Honey Yogurt" },
    { _id: "50", name: "Lemon Yogurt" },
    { _id: "51", name: "Orange Yogurt" },
    { _id: "52", name: "Banana Yogurt" },
    { _id: "53", name: "Cherry Yogurt" },
    { _id: "54", name: "Raspberry Yogurt" },
    { _id: "55", name: "Blackberry Yogurt" },
    { _id: "56", name: "Apple Yogurt" },
    { _id: "57", name: "Pear Yogurt" },
    { _id: "58", name: "Grape Yogurt" },
    { _id: "59", name: "Kiwi Yogurt" },
    { _id: "60", name: "Passion Fruit Yogurt" },
    { _id: "61", name: "Pomegranate Yogurt" },
    { _id: "62", name: "Coconut Yogurt" },
    { _id: "63", name: "Almond Yogurt" },
    { _id: "64", name: "Soy Yogurt" },
    { _id: "65", name: "Oat Yogurt" },
    { _id: "66", name: "Cashew Yogurt" },
    { _id: "67", name: "Hemp Yogurt" },
    { _id: "68", name: "Flax Yogurt" },
    { _id: "69", name: "Kefir" },
    { _id: "70", name: "Lassi" },
    { _id: "71", name: "Smoothie" },
    { _id: "72", name: "Milkshake" },
    { _id: "73", name: "Ice Cream" },
    { _id: "74", name: "Gelato" },
    { _id: "75", name: "Frozen Yogurt" },
    { _id: "76", name: "Sherbet" },
    { _id: "77", name: "Sorbet" },
    { _id: "78", name: "Pudding" },
    { _id: "79", name: "Custard" },
    { _id: "80", name: "Flan" },
    { _id: "81", name: "Cheesecake" },
    { _id: "82", name: "Tiramisu" },
    { _id: "83", name: "Mousse" },
    { _id: "84", name: "Panna Cotta" },
    { _id: "85", name: "Crème Brûlée" },
    { _id: "86", name: "Trifle" },
    { _id: "87", name: "Bread Pudding" },
    { _id: "88", name: "Rice Pudding" },
    { _id: "89", name: "Tapioca Pudding" },
    { _id: "90", name: "Chocolate Pudding" },
    { _id: "91", name: "Vanilla Pudding" },
    { _id: "92", name: "Butterscotch Pudding" },
    { _id: "93", name: "Caramel Pudding" },
    { _id: "94", name: "Banana Pudding" },
    { _id: "95", name: "Lemon Pudding" },
    { _id: "96", name: "Orange Pudding" },
    { _id: "97", name: "Strawberry Pudding" },
    { _id: "98", name: "Blueberry Pudding" },
    { _id: "99", name: "Raspberry Pudding" },
    { _id: "100", name: "Cherry Pudding" },
    { _id: "101", name: "Curd" },
    { _id: "102", name: "Paneer" },
    { _id: "103", name: "Ghee" },
    { _id: "104", name: "Clarified Butter" },
    { _id: "105", name: "Cultured Butter" },
    { _id: "106", name: "Sweet Cream Butter" },
    { _id: "107", name: "Salted Butter" },
    { _id: "108", name: "Unsalted Butter" },
    { _id: "109", name: "Whipped Butter" },
    { _id: "110", name: "European Butter" },
    { _id: "111", name: "Irish Butter" },
    { _id: "112", name: "French Butter" },
    { _id: "113", name: "Danish Butter" },
    { _id: "114", name: "Goat Cheese" },
    { _id: "115", name: "Sheep Cheese" },
    { _id: "116", name: "Buffalo Mozzarella" },
    { _id: "117", name: "Burrata" },
    { _id: "118", name: "Mascarpone" },
    { _id: "119", name: "Taleggio" },
    { _id: "120", name: "Fontina" },
    { _id: "121", name: "Manchego" },
    { _id: "122", name: "Pecorino Romano" },
    { _id: "123", name: "Asiago" },
    { _id: "124", name: "Gruyere" },
    { _id: "125", name: "Emmental" },
    { _id: "126", name: "Jarlsberg" },
    { _id: "127", name: "Edam" },
    { _id: "128", name: "Gouda Aged" },
    { _id: "129", name: "Cheddar Aged" },
    { _id: "130", name: "Parmigiano Reggiano" },
    { _id: "131", name: "Pecorino Toscano" },
    { _id: "132", name: "Pecorino Sardo" },
    { _id: "133", name: "Pecorino Siciliano" },
    { _id: "134", name: "Grana Padano" },
    { _id: "135", name: "Parmigiano Reggiano DOP" },
    { _id: "136", name: "Mozzarella di Bufala" },
    { _id: "137", name: "Burrata di Andria" },
    { _id: "138", name: "Stracciatella" },
    { _id: "139", name: "Ricotta Salata" },
    { _id: "140", name: "Ricotta Affumicata" },
    { _id: "141", name: "Scamorza" },
    { _id: "142", name: "Caciocavallo" },
    { _id: "143", name: "Provolone del Monaco" },
    { _id: "144", name: "Caciocavallo Silano" },
    { _id: "145", name: "Pecorino Romano DOP" },
    { _id: "146", name: "Pecorino Toscano DOP" },
    { _id: "147", name: "Pecorino Sardo DOP" },
    { _id: "148", name: "Pecorino Siciliano DOP" },
    { _id: "149", name: "Grana Padano DOP" },
    { _id: "150", name: "Parmigiano Reggiano DOP" },
    { _id: "151", name: "Mozzarella di Bufala DOP" },
    { _id: "152", name: "Burrata di Andria DOP" },
    { _id: "153", name: "Stracciatella di Andria DOP" },
    { _id: "154", name: "Ricotta Salata DOP" },
    { _id: "155", name: "Ricotta Affumicata DOP" },
    { _id: "156", name: "Scamorza DOP" },
    { _id: "157", name: "Caciocavallo DOP" },
    { _id: "158", name: "Provolone del Monaco DOP" },
    { _id: "159", name: "Caciocavallo Silano DOP" },
    { _id: "160", name: "Fresh Curd" },
    { _id: "161", name: "Homemade Curd" },
    { _id: "162", name: "Sweet Curd" },
    { _id: "163", name: "Sour Curd" },
    { _id: "164", name: "Spiced Curd" },
    { _id: "165", name: "Flavored Curd" },
    { _id: "166", name: "Organic Curd" },
    { _id: "167", name: "Traditional Curd" },
    { _id: "168", name: "Artisan Curd" },
    { _id: "169", name: "Premium Curd" },
    { _id: "170", name: "Gourmet Curd" },
    { _id: "171", name: "Fresh Paneer" },
    { _id: "172", name: "Homemade Paneer" },
    { _id: "173", name: "Spiced Paneer" },
    { _id: "174", name: "Grilled Paneer" },
    { _id: "175", name: "Smoked Paneer" },
    { _id: "176", name: "Organic Paneer" },
    { _id: "177", name: "Traditional Paneer" },
    { _id: "178", name: "Artisan Paneer" },
    { _id: "179", name: "Premium Paneer" },
    { _id: "180", name: "Gourmet Paneer" },
    { _id: "181", name: "Fresh Ghee" },
    { _id: "182", name: "Clarified Ghee" },
    { _id: "183", name: "Pure Ghee" },
    { _id: "184", name: "Organic Ghee" },
    { _id: "185", name: "Traditional Ghee" },
    { _id: "186", name: "Artisan Ghee" },
    { _id: "187", name: "Premium Ghee" },
    { _id: "188", name: "Gourmet Ghee" },
    { _id: "189", name: "A2 Ghee" },
    { _id: "190", name: "Grass-Fed Ghee" },
    { _id: "191", name: "Desi Ghee" },
    { _id: "192", name: "Cow Ghee" },
    { _id: "193", name: "Buffalo Ghee" },
    { _id: "194", name: "Mixed Ghee" },
    { _id: "195", name: "Spiced Ghee" },
    { _id: "196", name: "Flavored Ghee" },
    { _id: "197", name: "Medicinal Ghee" },
    { _id: "198", name: "Ayurvedic Ghee" },
    { _id: "199", name: "Herbal Ghee" },
    { _id: "200", name: "Therapeutic Ghee" }
  ];

  useEffect(() => {
    const fetchApprovedReviews = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/v1/reviews?status=Approved");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews([]);
      }
    };

    // Always use placeholder products for review dropdown
    setProducts(placeholderProducts);
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

        // Check if the selected product is a placeholder (string ID)
        const selectedProduct = products.find(p => p._id === newReview.packageId);
        const isPlaceholder = selectedProduct && typeof selectedProduct._id === 'string' && selectedProduct._id.length < 24;

        if (isPlaceholder) {
          // For placeholder products, send the product name instead of ID
          await axios.post("http://localhost:3001/api/v1/reviews", {
            rating: newReview.rating.toString(),
            comment: newReview.comment,
            packageId: null, // Don't link to a specific product
            name: selectedProduct.name // Include the product name
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } else {
          // For real products from database
          await axios.post("http://localhost:3001/api/v1/reviews", {
            rating: newReview.rating.toString(),
            comment: newReview.comment,
            packageId: newReview.packageId
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
        }
        
        alert("Review submitted! Awaiting admin approval.");
        setNewReview({ rating: 0, comment: "", packageId: "" });
      } catch (err) {
        console.error("Error submitting review:", err);
        if (err.response?.data?.error) {
          alert(`Failed to submit review: ${err.response.data.error}`);
        } else {
          alert("Failed to submit review. Please try again.");
        }
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
