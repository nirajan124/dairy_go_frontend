import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaHeart, FaTag, FaInfoCircle, FaCalendarCheck, FaShoppingCart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Navbar from "../common/customer/Navbar";

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const token = localStorage.getItem("token");

  // Placeholder data for a single dairy product
  const placeholderProduct = {
    _id: "1",
    title: "Fresh Whole Milk",
    description: "Experience the pure, creamy taste of fresh whole milk, sourced directly from local, grass-fed cows. Rich in calcium and essential vitamins, it's the perfect choice for your family's daily needs. Enjoy it chilled, with cereal, or in your favorite recipes.",
    price: 45,
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    details: [
      "100% Grass-Fed",
      "Pasteurized & Homogenized",
      "Rich in Vitamin D and Calcium",
      "No Artificial Hormones",
    ],
    bestBefore: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/v1/package/${id}`);
        setProductData(res.data);
      } catch (err) {
        console.log("Backend not available, using placeholder data for product detail page");
        setProductData(placeholderProduct);
        setError("Demo Mode: Showing sample product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <div className="text-center py-20"><div className="dairy-spinner mx-auto"></div></div>;

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        {error && (
          <div className="text-center mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">{error}</p>
          </div>
        )}
        {productData && (
          <>
            {/* Hero Section */}
            <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
              <img
                src={productData.image}
                alt={productData.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-70 flex items-center justify-center">
                <h1 className="text-white text-5xl font-bold shadow-lg dairy-heading">{productData.title}</h1>
              </div>
            </div>

            {/* Product Details Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              {/* Left Side - Details */}
              <div className="bg-blue-50 p-8 rounded-lg shadow-md border border-blue-100">
                <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                  <FaInfoCircle className="mr-3" /> Product Details
                </h3>
                <ul className="list-none space-y-4">
                  {productData.details?.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="text-blue-600 font-bold text-xl">✓</span>
                      <span className="text-gray-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right Side - Info & Actions */}
              <div>
                <h2 className="text-4xl font-bold text-gray-900 dairy-heading">{productData.title}</h2>
                <p className="text-lg text-gray-700 mt-4 leading-relaxed">{productData.description}</p>

                <div className="mt-8 space-y-4">
                  <p className="flex items-center text-gray-800 text-2xl">
                    <FaTag className="mr-3 text-blue-600" />
                    <span className="font-semibold">Rs.{productData.price}</span>
                  </p>
                  
                  {/* Best Before Date */}
                  <div className="mt-4">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
                      <FaCalendarCheck className="mr-3 text-green-600" /> Best Before
                    </h3>
                    <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-md font-semibold">
                      {new Date(productData.bestBefore).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Order & Wishlist Section */}
                <div className="mt-10 flex justify-between items-center">
                  {/* Wishlist Button */}
                  <button className="flex items-center text-lg font-semibold text-gray-800 transition duration-300 hover:text-red-600">
                    <FaHeart className="mr-2 text-2xl text-gray-400" />
                    Add to Wishlist
                  </button>

                  {/* Order Button */}
                  <button
                    onClick={() => navigate(`/checkout/${productData._id}`)}
                    className="dairy-btn bg-blue-800 text-white py-4 px-10 text-xl rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 flex items-center"
                  >
                    <FaShoppingCart className="mr-3" />
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PackageDetail;

