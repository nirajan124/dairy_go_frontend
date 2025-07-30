import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import Footer from "../../components/common/customer/Footer";
import Hero from "../../components/common/customer/Hero";
import Navbar from "../../components/common/customer/Navbar";
import ProductCard from "../common/customer/ProductCard";

const Home = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const productsRef = useRef(null);

  // Placeholder dairy products data
  const placeholderProducts = [
    {
      _id: "1",
      title: "Fresh Whole Milk",
      description: "Pure, fresh whole milk sourced from local farms. Rich in calcium and essential nutrients.",
      price: 45,
      image: null
    },
    {
      _id: "2", 
      title: "Organic Greek Yogurt",
      description: "Creamy organic Greek yogurt made with traditional methods. High in protein and probiotics.",
      price: 65,
      image: null
    },
    {
      _id: "3",
      title: "Aged Cheddar Cheese",
      description: "Premium aged cheddar cheese with rich, sharp flavor. Perfect for cooking and snacking.",
      price: 120,
      image: null
    },
    {
      _id: "4",
      title: "Fresh Butter",
      description: "Pure, unsalted butter made from fresh cream. Ideal for baking and cooking.",
      price: 85,
      image: null
    },
    {
      _id: "5",
      title: "Homemade Paneer",
      description: "Fresh homemade paneer, perfect for Indian cuisine. High in protein and calcium.",
      price: 95,
      image: null
    },
   
  ];

  // Show scroll-to-top after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dairy products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3000/api/v1/package");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        console.log("Backend not available, using placeholder data");
        setProducts(placeholderProducts);
        setError("Demo Mode: Showing sample dairy products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Navbar scrollToProducts={scrollToProducts} />
      <Hero />

      {/* Products Section */}
      <div ref={productsRef} className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-blue-800 text-center mb-6">
          Fresh Dairy Products
        </h2>
        
        {error && (
          <div className="text-center mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">{error}</p>
            <p className="text-blue-600 text-sm mt-1">Connect your backend to see real products</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="dairy-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fresh dairy products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} packageData={product} />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Scroll to Top Button */}
      {showScroll && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition duration-300 cursor-pointer"
        >
          <FaArrowUp size={20} />
        </button>
      )}
    </>
  );
};

export default Home;
