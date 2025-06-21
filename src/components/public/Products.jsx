import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../common/customer/Navbar";
import Footer from "../common/customer/Footer";
import ProductCard from "../common/customer/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Placeholder dairy products data
  const placeholderProducts = [
    { _id: "1", title: "Fresh Whole Milk", description: "Pure, fresh whole milk sourced from local farms.", price: 45, image: null },
    { _id: "2", title: "Organic Greek Yogurt", description: "Creamy organic Greek yogurt made with traditional methods.", price: 65, image: null },
    { _id: "3", title: "Aged Cheddar Cheese", description: "Premium aged cheddar cheese with a rich, sharp flavor.", price: 120, image: null },
    { _id: "4", title: "Fresh Butter", description: "Pure, unsalted butter made from fresh cream.", price: 85, image: null },
    { _id: "5", title: "Homemade Paneer", description: "Fresh homemade paneer, perfect for Indian cuisine.", price: 95, image: null },
    { _id: "6", title: "Fresh Cream", description: "Rich, fresh cream perfect for desserts and coffee.", price: 55, image: null },
    { _id: "7", title: "Skimmed Milk", description: "Low-fat skimmed milk for a healthy lifestyle.", price: 40, image: null },
    { _id: "8", title: "Probiotic Buttermilk", description: "Refreshing probiotic buttermilk, great for digestion.", price: 30, image: null },
    { _id: "9", title: "Mozzarella Cheese", description: "Fresh mozzarella cheese, perfect for pizzas and salads.", price: 110, image: null }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/v1/package");
        setProducts(res.data);
        setError(null);
      } catch (err) {
        console.log("Backend not available, using placeholder data for products page");
        setProducts(placeholderProducts);
        setError("Demo Mode: Showing sample dairy products. Connect your backend to see real products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-6 dairy-heading">
          Our Fresh Dairy Products
        </h1>
        <p className="text-lg text-center text-gray-600 mb-12 max-w-2xl mx-auto dairy-text">
          Browse our wide selection of high-quality dairy products, sourced directly from local farms and delivered fresh to you.
        </p>

        {error && (
          <div className="text-center mb-10 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 font-medium">Demo Mode: Showing sample dairy products</p>
            <p className="text-blue-600 text-sm mt-1">Connect your backend to see real products</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="dairy-spinner mx-auto mb-4"></div>
            <p className="text-gray-600">Loading fresh dairy products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((pkg) => (
              <ProductCard key={pkg._id} packageData={pkg} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Products; 